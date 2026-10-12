import type { ComponentType } from "react";
import { Badge, Box, Breadcrumb, Card, CodeBlock, Flex, Stack, Table, Text } from "@lettuceai/crisp";
import { apiOf, importLine, type ApiBlock } from "../docs";
import { groupOf, type Entry } from "../registry";
import { toHref } from "../router";
import { DocPage, Section } from "./Doc";

const demos = import.meta.glob<{ default: ComponentType }>("../examples/*.tsx", { eager: true });
const sources = import.meta.glob<string>("../examples/*.tsx", { eager: true, query: "?raw", import: "default" });

export function hasExample(slug: string) {
  return `../examples/${slug}.tsx` in demos;
}

interface Row {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

const columns = [
  {
    key: "name",
    header: "Prop",
    cell: (row: Row) => (
      <Box as="code" className="font-mono text-xs text-fg">
        {row.name}
        {row.required && <Box as="span" className="text-danger" title="Required"> *</Box>}
      </Box>
    ),
  },
  {
    key: "type",
    header: "Type",
    cell: (row: Row) => <Box as="code" className="block max-w-80 whitespace-normal break-words font-mono text-xs text-fg-2">{row.type}</Box>,
  },
  {
    key: "default",
    header: "Default",
    cell: (row: Row) => (row.default ? <Box as="code" className="font-mono text-xs text-fg-2">{row.default}</Box> : <Box as="span" className="text-fg-4">-</Box>),
  },
  {
    key: "description",
    header: "Description",
    cell: (row: Row) => <Box as="span" className="block min-w-48 whitespace-normal text-sm text-fg-2">{row.description || <Box as="span" className="text-fg-4">-</Box>}</Box>,
  },
];

function Api({ block }: { block: ApiBlock }) {
  const props = block.component?.props ?? [];
  return (
    <Stack gap={3}>
      <Flex align="center" gap={2} wrap>
        <Text variant="title" as="h3" id={`api-${block.name}`}>
          <Box as="code" className="font-mono">{block.name}</Box>
        </Text>
        {block.symbol && block.symbol.kind !== "type" && !block.component && <Badge>{block.symbol.kind}</Badge>}
      </Flex>
      {block.description && <Text variant="secondary" className="max-w-prose whitespace-pre-line text-sm">{block.description}</Text>}
      {block.component ? (
        props.length > 0 ? (
          <Table<Row> caption={`${block.name} props`} columns={columns} rows={props} rowKey={(row) => row.name} />
        ) : (
          <Text variant="hint">No props of its own.</Text>
        )
      ) : (
        block.symbol && <CodeBlock code={block.symbol.signature} label="Signature" wrap />
      )}
    </Stack>
  );
}

export function ComponentPage({ item }: { item: Entry }) {
  const group = groupOf(item.slug)!;
  const Demo = demos[`../examples/${item.slug}.tsx`]?.default;
  const source = sources[`../examples/${item.slug}.tsx`] ?? "";
  const api = apiOf(item);

  return (
    <DocPage
      title={item.name}
      before={
        <Breadcrumb
          items={[
            { label: "Components", href: toHref("components") },
            { label: group.title, href: `${toHref("components")}#${group.id}` },
            { label: item.name },
          ]}
        />
      }
      lead={api[0]?.description || item.summary}
    >
      <Section id="import" title="Import">
        <CodeBlock code={importLine(item)} label="TypeScript" wrap />
      </Section>
      <Section id="example" title="Example">
        <Stack gap={3}>
          <Card padding="none" className="border border-line">
            <Box className="flex min-h-40 flex-wrap items-center justify-center gap-4 overflow-x-auto p-4 md:p-8">{Demo ? <Demo /> : null}</Box>
          </Card>
          <CodeBlock code={source.trim()} label={`${item.slug}.tsx`} maxHeight={420} />
        </Stack>
      </Section>
      <Section id="api" title="API">
        <Stack gap={8}>
          {api.map((block) => (
            <Api key={block.name} block={block} />
          ))}
        </Stack>
      </Section>
    </DocPage>
  );
}
