import type { ReactNode } from "react";
import { motion as fm } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  AvatarGroup, Badge, Box, Button, Card, CodeBlock, Message, Meter, Slider, Sparkline, StatTile, Stack, Switch, Text, motion,
} from "@lettuceai/crisp";
import { useState } from "react";
import { REPO } from "../Layout";
import { useNavigate } from "../router";

const trend = [12, 18, 15, 24, 22, 31, 29, 38, 44, 41, 52];

function Float({ children, from, delay, span }: { children: ReactNode; from: { x: number; y: number; rotate: number }; delay: number; span?: boolean }) {
  return (
    <fm.div
      initial={{ opacity: 0, ...from, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      transition={{ ...(motion.surface as object), delay }}
      className={span ? "col-span-2" : undefined}
    >
      <fm.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5 + delay * 3, repeat: Infinity, ease: "easeInOut", delay: delay + 1 }}>
        {children}
      </fm.div>
    </fm.div>
  );
}

function Stage() {
  const [dark, setDark] = useState(true);
  const [temp, setTemp] = useState(70);
  return (
    <Box className="grid grid-cols-2 gap-3 md:gap-4" aria-label="A few Crisp components">
      <Float span from={{ x: -80, y: 40, rotate: -4 }} delay={0.1}>
        <Card level="raised" padding="sm" className="border border-line">
          <Stack gap={1}>
            <Message role="user" timestamp="09:41">Can the whole app share one design language?</Message>
            <Message role="assistant" author={{ name: "Crisp" }} timestamp="09:41">One set of tokens, from a phone to a desktop. Try it below.</Message>
          </Stack>
        </Card>
      </Float>
      <Float from={{ x: 70, y: -50, rotate: 5 }} delay={0.25}>
        <StatTile label="Tokens today" value="12.4k" trend={{ value: 18, direction: "up" }} sub={<Sparkline data={trend} height={28} />} />
      </Float>
      <Float from={{ x: -60, y: -40, rotate: -6 }} delay={0.4}>
        <Card level="raised" padding="sm" className="border border-line">
          <Stack gap={3}>
            <Box className="flex items-center justify-between gap-2">
              <Text variant="label">Dark theme</Text>
              <Switch checked={dark} onChange={setDark} aria-label="Dark theme" />
            </Box>
            <Slider value={temp} onChange={setTemp} showValue={(v) => `${v}%`} />
          </Stack>
        </Card>
      </Float>
      <Float span from={{ x: 60, y: 60, rotate: 4 }} delay={0.55}>
        <Card level="raised" padding="sm" className="border border-line">
          <Box className="flex flex-wrap items-center justify-between gap-3">
            <Box className="flex flex-wrap items-center gap-2">
              <Badge tone="accent" dot>Online</Badge>
              <Badge tone="info">v1.1</Badge>
              <Badge>MIT</Badge>
            </Box>
            <AvatarGroup people={[{ name: "Ada" }, { name: "Linus" }, { name: "Grace" }, { name: "Alan" }, { name: "Edsger" }]} />
          </Box>
        </Card>
      </Float>
      <Float span from={{ x: 0, y: 70, rotate: 0 }} delay={0.7}>
        <Card level="raised" padding="sm" className="border border-line">
          <Meter label="Context window" valueLabel="96k / 128k" value={96} max={128} />
        </Card>
      </Float>
    </Box>
  );
}

export function Hero() {
  const navigate = useNavigate();
  return (
    <Box as="section" aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-line">
      <Box aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <svg className="absolute inset-0 h-full w-full text-fg/10 mask-[radial-gradient(ellipse_at_30%_20%,black,transparent_70%)]">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <fm.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 -top-24 size-120 rounded-full bg-accent/25 blur-3xl"
        />
        <fm.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 right-0 size-120 rounded-full bg-secondary/20 blur-3xl"
        />
      </Box>
      <Box className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.05fr_1fr]">
        <Stack gap={6}>
          <Badge tone="accent" className="w-fit">Open source, MIT</Badge>
          <Text variant="hero" as="h1" id="hero-title">
            Interfaces with an edge.
          </Text>
          <Text variant="secondary" className="max-w-xl text-lg">
            Crisp is the React 19 and Tailwind 4 component library behind LettuceAI. More than a hundred components, one set of tokens and motion
            presets, light and dark themes, and the same screen on a phone and a desktop.
          </Text>
          <Box className="max-w-md">
            <CodeBlock code="bun add @lettuceai/crisp" label="Terminal" />
          </Box>
          <Box className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg" onClick={() => navigate("getting-started")} trailing={<ArrowRight size={18} />}>
              Get started
            </Button>
            <Button size="lg" onClick={() => window.open(REPO, "_blank", "noopener")} trailing={<ExternalLink size={16} />}>
              GitHub
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate("components")}>
              Browse components
            </Button>
          </Box>
        </Stack>
        <Stage />
      </Box>
    </Box>
  );
}
