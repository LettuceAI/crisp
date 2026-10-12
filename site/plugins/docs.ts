import { globSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { withCustomConfig } from "react-docgen-typescript";
import type { Plugin } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const VIRTUAL = "virtual:crisp-docs";

export interface DocProp {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface DocComponent {
  description: string;
  props: DocProp[];
}

export interface DocSymbol {
  kind: "function" | "value" | "type";
  signature: string;
  description: string;
}

export interface DocsData {
  components: Record<string, DocComponent>;
  symbols: Record<string, DocSymbol>;
}

/* Props that come from React and Framer Motion rather than from crisp. Docgen cannot
   tell where a prop was declared once it passes through Omit<>, so they are named. */
function inheritedPropNames(program: ts.Program, checker: ts.TypeChecker): Set<string> {
  const names = new Set<string>();
  const add = (file: ts.SourceFile | undefined, interfaces: string[]) => {
    if (!file) return;
    const visit = (node: ts.Node) => {
      if (ts.isInterfaceDeclaration(node) && interfaces.includes(node.name.text)) {
        for (const prop of checker.getTypeAtLocation(node).getProperties()) names.add(prop.name);
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
  };
  const react = program.getSourceFiles().find((f) => /@types\/react\/index\.d\.ts$/.test(f.fileName));
  add(react, [
    "DOMAttributes", "AriaAttributes", "HTMLAttributes", "ButtonHTMLAttributes", "InputHTMLAttributes",
    "TextareaHTMLAttributes", "SelectHTMLAttributes", "AnchorHTMLAttributes", "FormHTMLAttributes",
    "LabelHTMLAttributes", "ImgHTMLAttributes", "TableHTMLAttributes", "ThHTMLAttributes", "TdHTMLAttributes",
    "OlHTMLAttributes", "LiHTMLAttributes", "DetailsHTMLAttributes", "DialogHTMLAttributes",
  ]);
  const motion = program.getSourceFiles().find((f) => /framer-motion\/dist\/types\/index\.d\.ts$/.test(f.fileName));
  const motionProps = motion && checker.getSymbolAtLocation(motion);
  for (const exp of motionProps ? checker.getExportsOfModule(motionProps) : []) {
    if (exp.name === "MotionProps" || exp.name === "MotionAdvancedProps") {
      const decl = checker.getDeclaredTypeOfSymbol(checker.getAliasedSymbol(exp.flags & ts.SymbolFlags.Alias ? exp : exp));
      for (const prop of decl.getProperties()) names.add(prop.name);
    }
  }
  return names;
}

/* Em dashes read as AI filler in running text. The first one in a sentence becomes a colon, the rest commas. */
function tidy(text: string) {
  let first = true;
  return text.replace(/\s*—\s*|[.!?](?=\s)/g, (match) => {
    if (match.length === 1 && /[.!?]/.test(match)) {
      first = true;
      return match;
    }
    const out = first ? ": " : ", ";
    first = false;
    return out;
  });
}

/* JSDoc is hard-wrapped; only blank lines are paragraphs. */
function unwrap(text: string) {
  return text.replace(/(?<!\n)\n(?!\n)/g, " ");
}

function clean(text: string) {
  return tidy(text.replace(/\s*\n\s*/g, " ").trim());
}

function typeText(prop: { type: { name: string; value?: unknown; raw?: string } }) {
  const t = prop.type;
  if (t.name === "enum" && Array.isArray(t.value)) return (t.value as { value: string }[]).map((v) => v.value).join(" | ");
  return t.name;
}

/* Docgen returns nothing for a component whose props extend Framer Motion's element
   types, so those are read from the `<Name>Props` interface directly. */
function propsFromInterface(program: ts.Program, checker: ts.TypeChecker, name: string): DocProp[] {
  for (const file of program.getSourceFiles()) {
    if (file.fileName.includes("node_modules") || !file.fileName.startsWith(root + "/src/")) continue;
    for (const node of file.statements) {
      if (!ts.isInterfaceDeclaration(node) || node.name.text !== `${name}Props`) continue;
      const source = file.text;
      const start = source.search(new RegExp(`(function|const) ${name}\\b`));
      const head = start < 0 ? "" : source.slice(start, start + 1200);
      const out: DocProp[] = [];
      for (const member of node.members) {
        if (!ts.isPropertySignature(member) || !member.name) continue;
        const propName = member.name.getText(file);
        const symbol = checker.getSymbolAtLocation(member.name);
        const fallback = head.match(new RegExp(`\\b${propName}\\s*=\\s*("[^"]*"|-?\\d+(?:\\.\\d+)?|true|false|\\[\\])`));
        out.push({
          name: propName,
          type: member.type ? member.type.getText(file).replace(/\s+/g, " ") : "unknown",
          required: !member.questionToken,
          default: fallback?.[1],
          description: clean(symbol ? ts.displayPartsToString(symbol.getDocumentationComment(checker)) : ""),
        });
      }
      return out;
    }
  }
  return [];
}

export function buildDocs(): DocsData {
  const configPath = path.join(root, "tsconfig.json");
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  const program = ts.createProgram({
    rootNames: [path.join(root, "src/index.ts")],
    options: { ...parsed.options, noEmit: true },
  });
  const checker = program.getTypeChecker();
  const inherited = inheritedPropNames(program, checker);

  const parser = withCustomConfig(configPath, {
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: (prop) => {
      const decls = (prop as { declarations?: { fileName: string }[] }).declarations;
      if (decls?.length) return decls.some((d) => !/node_modules/.test(d.fileName));
      return !inherited.has(prop.name);
    },
  });
  const files = [...globSync(path.join(root, "src/components/*.tsx")), ...globSync(path.join(root, "src/layout/*.tsx"))];
  const components: Record<string, DocComponent> = {};
  for (const doc of parser.parse(files)) {
    if (!/^[A-Z]/.test(doc.displayName)) continue;
    components[doc.displayName] = {
      description: tidy(unwrap(doc.description.trim())),
      props: Object.values(doc.props)
        .filter((p) => p.name !== "ref")
        .map((p) => ({
          name: p.name,
          type: typeText(p),
          required: p.required,
          default: p.defaultValue ? String(p.defaultValue.value) : undefined,
          description: clean(p.description),
        })),
    };
  }

  for (const [name, doc] of Object.entries(components)) {
    if (doc.props.length) continue;
    const props = propsFromInterface(program, checker, name);
    if (props.length) doc.props = props;
  }

  const entry = program.getSourceFile(path.join(root, "src/index.ts"))!;
  const symbols: Record<string, DocSymbol> = {};
  for (const exp of checker.getExportsOfModule(checker.getSymbolAtLocation(entry)!)) {
    const symbol = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
    const decl = symbol.declarations?.[0];
    if (!decl) continue;
    const description = tidy(unwrap(ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim()));
    const type = checker.getTypeOfSymbolAtLocation(symbol, decl);
    const isType = !(symbol.flags & ts.SymbolFlags.Value);
    const signatures = type.getCallSignatures();
    symbols[exp.name] = {
      kind: isType ? "type" : signatures.length ? "function" : "value",
      signature: isType
        ? ""
        : signatures.length
          ? signatures.map((s) => `${exp.name}${checker.signatureToString(s).replace(/^<[^>]*>/, (m) => m)}`).join("\n")
          : `${exp.name}: ${checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation)}`,
      description,
    };
  }
  return { components, symbols };
}

export function docsPlugin(): Plugin {
  let data: DocsData | undefined;
  return {
    name: "crisp-docs",
    resolveId(id) {
      return id === VIRTUAL ? `\0${VIRTUAL}` : undefined;
    },
    load(id) {
      if (id !== `\0${VIRTUAL}`) return undefined;
      data ??= buildDocs();
      return `export default ${JSON.stringify(data)};`;
    },
  };
}
