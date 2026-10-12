import { useState } from "react";
import { motion as fm } from "framer-motion";
import { Search } from "lucide-react";
import { Box, Button, Card, CodeBlock, Grid, icon, motion, Stack, Text } from "@lettuceai/crisp";
import stylesheet from "../../../src/styles.css?raw";
import { DocPage, Section } from "./Doc";

const theme = stylesheet.slice(stylesheet.indexOf("@theme"), stylesheet.indexOf("\n}\n", stylesheet.indexOf("@theme")));
function token(name: string) {
  const match = theme.match(new RegExp(`--${name}:\\s*([^;]+);`));
  return match ? match[1].replace(/\s+/g, " ").trim() : "";
}

function Swatch({ name, tokenName, className, text }: { name: string; tokenName: string; className: string; text?: string }) {
  return (
    <Stack gap={2}>
      <Box className={`flex h-16 items-end rounded-xl border border-line-2 p-2 text-xs ${className} ${text ?? "text-fg-2"}`}>{name}</Box>
      <Box>
        <Box as="code" className="block font-mono text-xs text-fg">{tokenName}</Box>
        <Text variant="caption" as="span" className="block break-words">{token(tokenName.replace(/^--/, "")) || "set by the active theme"}</Text>
      </Box>
    </Stack>
  );
}

const tiers = [
  { cls: "text-fg", name: "fg", use: "Primary: titles, values, body" },
  { cls: "text-fg-2", name: "fg-2", use: "Secondary: labels, supporting copy" },
  { cls: "text-fg-3", name: "fg-3", use: "Muted: hints, meta, placeholders. The last readable tier" },
  { cls: "text-fg-4", name: "fg-4", use: "Faint: disabled and decorative only. Never carries meaning" },
];

const sizes = [
  { cls: "text-2xs", name: "2xs", px: "11 / 14" },
  { cls: "text-xs", name: "xs", px: "12 / 16" },
  { cls: "text-sm", name: "sm", px: "13 / 18" },
  { cls: "text-base", name: "base", px: "14 / 20" },
  { cls: "text-lg", name: "lg", px: "16 / 22" },
  { cls: "text-xl", name: "xl", px: "20 / 26" },
  { cls: "text-2xl", name: "2xl", px: "24 / 30" },
  { cls: "text-3xl", name: "3xl", px: "28 / 34" },
];

const radii = [
  { cls: "rounded-lg", name: "lg", role: "Controls: buttons, inputs, menu items" },
  { cls: "rounded-xl", name: "xl", role: "Fields and cards" },
  { cls: "rounded-2xl", name: "2xl", role: "Sheets and large surfaces" },
  { cls: "rounded-full", name: "full", role: "Pills, badges, avatars" },
];

const controls = [
  { cls: "control-sm", name: "control-sm", value: token("control-sm") },
  { cls: "control-md", name: "control-md", value: token("control-md") },
  { cls: "control-lg", name: "control-lg", value: token("control-lg") },
];

const motionRoles: Record<string, string> = {
  instant: "Something swapped in place: an icon, a tooltip, a popover.",
  quick: "Something appeared or resolved: a fade, a disclosure, a dialog.",
  slow: "Something travelled: a progress bar, a large reveal.",
  snap: "A small control snapping to a new position: a switch knob.",
  settle: "A moving indicator settling: active tab, segmented control.",
  surface: "A large surface arriving: sheets, panels, spotlight.",
  sheetIn: "A sheet presenting from an edge. No wobble.",
  sheetOut: "A sheet dismissed. Faster than it came.",
  sheetSettle: "A sheet let go short of closing.",
  sidebar: "A side panel widening or folding back.",
  rebound: "A dragged card letting go and returning to rest.",
  collapse: "Collapsing and expanding, without overshoot.",
  pulse: "A looping ambient cycle, like the typing indicator.",
  easeOut: "Easing for height and layout changes.",
};

function MotionDemo({ name }: { name: keyof typeof motion }) {
  const [run, setRun] = useState(0);
  const preset = motion[name];
  if (Array.isArray(preset)) {
    return <Box as="code" className="font-mono text-xs text-fg-2">[{preset.join(", ")}]</Box>;
  }
  const looping = name === "pulse";
  return (
    <Box className="flex items-center gap-3">
      <Box className="relative h-6 w-40 shrink-0 rounded-full bg-fill-2" aria-hidden="true">
        <fm.span
          key={run}
          initial={{ x: 0 }}
          animate={looping ? { opacity: [0.3, 1, 0.3] } : { x: 136 }}
          transition={preset as object}
          className="absolute left-1 top-1 size-4 rounded-full bg-accent"
        />
      </Box>
      <Button size="sm" variant="ghost" onClick={() => setRun((n) => n + 1)} aria-label={`Replay ${name}`}>
        Replay
      </Button>
    </Box>
  );
}

export function Foundations() {
  return (
    <DocPage
      title="Foundations"
      lead="Crisp draws from a small set of tokens. A value that is not a token is a token to add, not a one-off. Everything below is rendered from the real stylesheet and follows the active theme."
    >
      <Section id="surfaces" title="Surfaces">
        <Stack gap={4}>
          <Text variant="secondary" className="max-w-prose">Two visible steps of elevation. Raised carries cards; overlay carries anything floating above the page.</Text>
          <Grid minChildWidth="10rem" gap={4}>
            <Swatch name="Page" tokenName="--color-surface" className="bg-surface" />
            <Swatch name="Raised" tokenName="--color-surface-1" className="bg-surface-1" />
            <Swatch name="Overlay" tokenName="--color-surface-2" className="bg-surface-2" />
            <Swatch name="Elevated" tokenName="--color-surface-el" className="bg-surface-el" />
            <Swatch name="Navigation" tokenName="--color-nav" className="bg-nav" />
          </Grid>
        </Stack>
      </Section>
      <Section id="text" title="Text tiers">
        <Stack gap={3}>
          <Text variant="secondary" className="max-w-prose">Four strengths, derived from one foreground color so they follow a custom palette. Anything a person reads belongs to fg-3 or above.</Text>
          <Card className="border border-line">
            <Stack gap={3}>
              {tiers.map((tier) => (
                <Box key={tier.name} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <Box as="code" className="w-12 shrink-0 font-mono text-xs text-fg-3">{tier.name}</Box>
                  <Box as="span" className={`text-lg font-medium ${tier.cls}`}>The quick brown fox</Box>
                  <Text variant="caption">{tier.use}</Text>
                </Box>
              ))}
            </Stack>
          </Card>
          <Grid minChildWidth="10rem" gap={4}>
            <Swatch name="Fill" tokenName="--color-fill" className="bg-fill" />
            <Swatch name="Fill 2" tokenName="--color-fill-2" className="bg-fill-2" />
            <Swatch name="Fill 3" tokenName="--color-fill-3" className="bg-fill-3" />
            <Swatch name="Line" tokenName="--color-line" className="border-line-2 bg-surface-1 outline outline-line" />
            <Swatch name="Line 3" tokenName="--color-line-3" className="bg-surface-1 outline outline-line-3" />
          </Grid>
        </Stack>
      </Section>
      <Section id="semantic" title="Semantic colors">
        <Grid minChildWidth="10rem" gap={4}>
          <Swatch name="Accent" tokenName="--color-accent" className="bg-accent" text="text-on-accent" />
          <Swatch name="Danger" tokenName="--color-danger" className="bg-danger" text="text-fg" />
          <Swatch name="Warning" tokenName="--color-warning" className="bg-warning" text="text-surface" />
          <Swatch name="Info" tokenName="--color-info" className="bg-info" text="text-fg" />
          <Swatch name="Secondary" tokenName="--color-secondary" className="bg-secondary" text="text-surface" />
        </Grid>
      </Section>
      <Section id="type" title="Type scale">
        <Card className="border border-line">
          <Stack gap={2}>
            {sizes.map((size) => (
              <Box key={size.name} className="flex flex-wrap items-baseline gap-x-4">
                <Box as="code" className="w-10 shrink-0 font-mono text-xs text-fg-3">{size.name}</Box>
                <Box as="span" className={`${size.cls} text-fg`}>Crisp keeps a floor of eleven pixels</Box>
                <Text variant="caption">{size.px} px</Text>
              </Box>
            ))}
          </Stack>
        </Card>
      </Section>
      <Section id="radius" title="Radius by role">
        <Stack gap={3}>
          <Text variant="secondary" className="max-w-prose">Radius is chosen by what the shape is, never by taste. The Sharp and Round theme options scale the whole set.</Text>
          <Grid minChildWidth="12rem" gap={4}>
            {radii.map((r) => (
              <Stack key={r.name} gap={2}>
                <Box className={`h-16 border border-line-3 bg-fill-2 ${r.cls}`} />
                <Box><Box as="code" className="font-mono text-xs text-fg">{r.cls}</Box><Text variant="caption" className="block">{r.role}</Text></Box>
              </Stack>
            ))}
          </Grid>
        </Stack>
      </Section>
      <Section id="controls" title="Control heights">
        <Stack gap={3}>
          <Text variant="secondary" className="max-w-prose">Controls take their height from the density scale. Compact density tightens them all at once.</Text>
          <Card className="border border-line">
            <Stack gap={3}>
              {controls.map((c) => (
                <Box key={c.name} className="flex flex-wrap items-center gap-4">
                  <Box className={`${c.cls} w-40 rounded-lg border border-line-3 bg-fill-2`} />
                  <Box as="code" className="font-mono text-xs text-fg">{c.name}</Box>
                  <Text variant="caption">{c.value}</Text>
                </Box>
              ))}
            </Stack>
          </Card>
        </Stack>
      </Section>
      <Section id="icons" title="Icon ladder">
        <Stack gap={3}>
          <Text variant="secondary" className="max-w-prose">Five steps, mapped to what an icon sits next to. Icons come from lucide-react.</Text>
          <Card className="border border-line">
            <Box className="flex flex-wrap items-end gap-8">
              {(Object.keys(icon) as (keyof typeof icon)[]).map((size) => (
                <Stack key={size} gap={2} className="items-center">
                  <Search size={icon[size]} aria-hidden="true" />
                  <Box as="code" className="font-mono text-xs text-fg">icon.{size}</Box>
                  <Text variant="caption">{icon[size]}px</Text>
                </Stack>
              ))}
            </Box>
          </Card>
        </Stack>
      </Section>
      <Section id="motion" title="Motion presets">
        <Stack gap={3}>
          <Text variant="secondary" className="max-w-prose">Every animation goes through one of these. Pick by what the motion is for, not by how long it should take. They respect prefers-reduced-motion.</Text>
          <Card className="border border-line">
            <Stack gap={5}>
              {(Object.keys(motion) as (keyof typeof motion)[]).map((name) => (
                <Box key={name} className="flex flex-col gap-2 border-b border-line pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-center md:gap-6">
                  <Box className="md:w-48">
                    <Box as="code" className="font-mono text-sm text-fg">motion.{name}</Box>
                    <Text variant="caption" className="mt-1 block">{motionRoles[name]}</Text>
                  </Box>
                  <MotionDemo name={name} />
                  <Box className="min-w-0 flex-1"><CodeBlock code={JSON.stringify(motion[name], (_key, value) => (value === Infinity ? "Infinity" : value))} wrap maxHeight={80} /></Box>
                </Box>
              ))}
            </Stack>
          </Card>
        </Stack>
      </Section>
    </DocPage>
  );
}
