import type { ReactNode } from "react";
import { motion as fm } from "framer-motion";
import { Box, Stack, Text, motion } from "@lettuceai/crisp";

export function Band({ id, eyebrow, title, lead, children }: { id: string; eyebrow: string; title: string; lead: ReactNode; children: ReactNode }) {
  return (
    <Box as="section" aria-labelledby={`${id}-title`} className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <Stack gap={10}>
        <Stack gap={3} className="max-w-2xl">
          <Text variant="caption" as="p" className="font-medium uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </Text>
          <Text variant="display" as="h2" id={`${id}-title`} className="text-3xl md:text-4xl">
            {title}
          </Text>
          <Text variant="secondary" as="div" className="text-lg">
            {lead}
          </Text>
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}

/** Content that settles into place as it scrolls into view. Reduced motion turns the travel off. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <fm.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ ...(motion.surface as object), delay }}
      className={className}
    >
      {children}
    </fm.div>
  );
}
