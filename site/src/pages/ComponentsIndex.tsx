import { Box, Grid, Stack, Text } from "@lettuceai/crisp";
import { summaryOf } from "../docs";
import { groups } from "../registry";
import { toHref } from "../router";
import { DocPage, Section } from "./Doc";

function brief(text: string) {
  const flat = text.replace(/\s+/g, " ").replace(/`/g, "");
  const end = flat.search(/[.!?](\s|$)/);
  const first = end > 0 ? flat.slice(0, end + 1) : flat;
  return first.length > 120 ? `${first.slice(0, 117).trimEnd()}…` : first;
}

export function ComponentsIndex() {
  return (
    <DocPage title="Components" lead="Every component and hook Crisp exports, grouped by what it is for. Each page has live examples, the example source and a props table generated from the TypeScript types.">
      {groups.map((group) => (
        <Section key={group.id} id={group.id} title={group.title}>
          <Stack gap={4}>
            <Text variant="secondary" className="max-w-prose">{group.blurb}</Text>
            <Grid minChildWidth="16rem" gap={3}>
              {group.items.map((item) => (
                <Box
                  key={item.slug}
                  as="a"
                  href={toHref(`components/${item.slug}`)}
                  className="flex flex-col gap-1 rounded-xl border border-line bg-surface-1 p-4 transition-colors motion-instant hover:border-line-3 hover:bg-surface-2"
                >
                  <Text variant="title" as="span">{item.name}</Text>
                  <Text variant="hint" as="span" className="line-clamp-2">{brief(summaryOf(item))}</Text>
                </Box>
              ))}
            </Grid>
          </Stack>
        </Section>
      ))}
    </DocPage>
  );
}
