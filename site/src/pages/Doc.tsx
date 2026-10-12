import type { ReactNode } from "react";
import { Box, Container, Stack, Text } from "@lettuceai/crisp";

export function DocPage({ title, lead, before, children }: { title: string; lead?: ReactNode; before?: ReactNode; children: ReactNode }) {
  return (
    <Container size="lg" className="py-8 md:py-12">
      <Stack gap={10}>
        <Stack gap={3}>
          {before}
          <Text variant="page" as="h1" className="text-3xl md:text-4xl">
            {title}
          </Text>
          {lead && (
            <Text variant="secondary" as="div" className="max-w-prose text-lg">
              {lead}
            </Text>
          )}
        </Stack>
        {children}
      </Stack>
    </Container>
  );
}

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Box as="section" aria-labelledby={`${id}-title`} className="scroll-mt-20">
      <Stack gap={4}>
        <Text variant="section" as="h2" id={`${id}-title`}>
          <Box as="a" href={`#${id}`} id={id} className="rounded-md hover:text-fg-2">
            {title}
          </Box>
        </Text>
        {children}
      </Stack>
    </Box>
  );
}
