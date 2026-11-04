import { generate, lexer, parse, walk } from "css-tree";

const colors = /^(?:[a-z]+|#[\da-f]{3,4}|#[\da-f]{6}|#[\da-f]{8}|(?:rgb|rgba|hsl|hsla)\([\d\s.,%+/-]+\))$/i;
const decorations = new Set(["none", "underline", "overline", "line-through", "solid", "double", "dotted", "dashed", "wavy"]);
const boxProperties = new Set([
  "background", "background-image", "border", "border-top", "border-right", "border-bottom", "border-left",
  "border-color", "border-width", "border-style", "border-radius", "border-top-left-radius", "border-top-right-radius",
  "border-bottom-left-radius", "border-bottom-right-radius", "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
  "margin", "margin-top", "margin-right", "margin-bottom", "margin-left", "gap", "row-gap", "column-gap",
  "width", "max-width", "height", "max-height", "box-shadow", "flex-basis",
]);
const functions = new Set(["rgb", "rgba", "hsl", "hsla", "linear-gradient", "radial-gradient"]);

function fontSize(value: string): string | undefined {
  const keywords: Record<string, string> = { small: "0.875rem", medium: "1rem", large: "1.25rem", "x-large": "1.5rem", "xx-large": "2rem", smaller: "0.875em", larger: "1.25em" };
  if (Object.hasOwn(keywords, value)) return `clamp(0.5rem, ${keywords[value]}, 2rem)`;
  const match = /^(\d+(?:\.\d+)?)(px|rem|em|%)$/.exec(value);
  if (!match) return;
  const amount = Number(match[1]);
  const unit = match[2];
  const [minimum, maximum] = unit === "px" ? [8, 32] : unit === "%" ? [50, 200] : [0.5, 2];
  if (amount < minimum || amount > maximum) return;
  return `clamp(0.5rem, ${value}, 2rem)`;
}

function boxStyle(property: string, value: string): string | undefined {
  if (!boxProperties.has(property) || /[\\!{}]|\/\*/.test(value) || /^(?:inherit|initial|unset|revert|revert-layer)$/.test(value)) return;
  try {
    const tree = parse(value, { context: "value" });
    if (!lexer.matchProperty(property, tree).matched) return;
    const background = property.startsWith("background");
    const sizing = ["width", "max-width", "height", "max-height", "flex-basis"].includes(property);
    const radius = property.includes("radius");
    const shadow = property === "box-shadow";
    const maximum = sizing ? 48 : radius ? 4 : 3;
    let safe = true;
    walk(tree, (node) => {
      if (node.type === "Url" || node.type === "Raw" || node.type === "String") safe = false;
      if (node.type === "Function" && !functions.has(node.name.toLowerCase())) safe = false;
      if (node.type === "Dimension") {
        const amount = Number(node.value);
        const unit = node.unit.toLowerCase();
        if (!Number.isFinite(amount) || (!shadow && amount < 0)) safe = false;
        if (unit === "px") { if (Math.abs(amount) > maximum * 16) safe = false; }
        else if (unit === "rem" || unit === "em") { if (Math.abs(amount) > maximum) safe = false; }
        else if (background && unit === "deg") { if (Math.abs(amount) > 360) safe = false; }
        else if (background && unit === "turn") { if (Math.abs(amount) > 1) safe = false; }
        else safe = false;
      }
      if (node.type === "Percentage" && (Number(node.value) < 0 || Number(node.value) > 100)) safe = false;
    });
    return safe ? generate(tree) : undefined;
  } catch {
    return;
  }
}

export function safeInlineStyle(input: string): string | undefined {
  const styles = new Map<string, string>();
  for (const declaration of input.split(";")) {
    const colon = declaration.indexOf(":");
    if (colon < 0) continue;
    const property = declaration.slice(0, colon).trim().toLowerCase();
    const value = declaration.slice(colon + 1).trim().toLowerCase();
    let allowed: string | undefined;
    switch (property) {
      case "color":
      case "background-color":
      case "text-decoration-color":
        if (colors.test(value)) allowed = value;
        break;
      case "font-weight":
        if (/^(?:normal|bold|bolder|lighter|[1-9]00)$/.test(value)) allowed = value;
        break;
      case "font-style":
        if (/^(?:normal|italic|oblique)$/.test(value)) allowed = value;
        break;
      case "font-size":
        allowed = fontSize(value);
        break;
      case "font-family":
        if (/^(?:serif|sans-serif|monospace)$/.test(value)) allowed = value;
        break;
      case "text-align":
        if (/^(?:left|right|center|start|end|justify)$/.test(value)) allowed = value;
        break;
      case "text-decoration":
      case "text-decoration-line":
        if (value && value.split(/\s+/).every((part) => decorations.has(part))) allowed = value;
        break;
      case "display":
        if (/^(?:block|inline|inline-block|flex|inline-flex|grid|inline-grid)$/.test(value)) allowed = value;
        break;
      case "flex-direction":
        if (/^(?:row|column|row-reverse|column-reverse)$/.test(value)) allowed = value;
        break;
      case "flex-wrap":
        if (/^(?:wrap|nowrap)$/.test(value)) allowed = value;
        break;
      case "align-items":
        if (/^(?:start|end|center|stretch|baseline|flex-start|flex-end)$/.test(value)) allowed = value;
        break;
      case "justify-content":
        if (/^(?:start|end|center|flex-start|flex-end|space-between|space-around|space-evenly)$/.test(value)) allowed = value;
        break;
      case "grid-template-columns": {
        const repeat = /^repeat\(\s*([1-6])\s*,\s*(?:1fr|minmax\(\s*0\s*,\s*1fr\s*\))\s*\)$/.exec(value);
        if (repeat) allowed = `repeat(${repeat[1]}, minmax(0, 1fr))`;
        else if (/^[1-6]fr(?:\s+[1-6]fr){0,5}$/.test(value)) allowed = value.split(/\s+/).map((part) => `minmax(0, ${part})`).join(" ");
        break;
      }
      case "flex-grow":
      case "flex-shrink":
        if (/^[0-4]$/.test(value)) allowed = value;
        break;
      case "min-width":
        if (value === "0" || value === "0px") allowed = "0";
        break;
      case "overflow":
      case "overflow-x":
      case "overflow-y":
        if (/^(?:auto|hidden|clip|scroll)$/.test(value)) allowed = value;
        break;
      case "white-space":
        if (/^(?:normal|pre-wrap|break-spaces)$/.test(value)) allowed = value;
        break;
      default:
        allowed = boxStyle(property, value);
    }
    if (allowed !== undefined) styles.set(property, allowed);
  }
  return styles.size ? Array.from(styles, ([property, value]) => `${property}:${value}`).join(";") : undefined;
}
