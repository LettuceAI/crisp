import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { MotionConfig, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, BookOpen, Compass, Library, MessageSquare, Settings } from "lucide-react";
import {
  AppShell, Button, Composer, CopyButton, FrameProvider, Message, PRESETS, themeToVars, type NavDestination, type Theme,
} from "@lettuceai/crisp";
import { REPO } from "../Layout";
import { groups } from "../registry";
import { toHref, useNavigate } from "../router";

const INSTALL = "bun add @lettuceai/crisp";
const SCREEN = { width: 960, height: 600 };
const PHONE = { width: 390, height: 720 };
const THEMES: Theme[] = ["midnight", "ember", "slate", "vellum"].map((id) => PRESETS.find((p) => p.id === id) ?? PRESETS[0]);

const chapters = [
  { at: [0, 0.14], title: null, body: null },
  {
    at: [0.16, 0.42],
    title: "A screen is three layers.",
    body: "The surface it sits on, the components on top, and the tokens that measure both. Change a token and every component that reads it moves with it.",
  },
  {
    at: [0.46, 0.62],
    title: "One layout, two devices.",
    body: "The same code at 960 and at 390 pixels. The rail becomes a tab bar and overlays rise from the bottom, because every component carries its own phone layout.",
  },
  {
    at: [0.66, 0.84],
    title: "One accent, every pixel.",
    body: "A theme is a handful of colors, a radius and a density. Text tiers, fills and lines are derived from them, so a new palette repaints the whole screen.",
  },
  {
    at: [0.88, 1],
    title: "Take it apart yourself.",
    body: "More than a hundred components, each with a live example and its props. Start with the four lines in getting started.",
  },
] as const;

const destinations: NavDestination<string>[] = [
  { id: "chats", icon: <MessageSquare size={20} />, label: "Chats" },
  { id: "discover", icon: <Compass size={20} />, label: "Discover" },
  { id: "library", icon: <Library size={20} />, label: "Library" },
];
const footer: NavDestination<string>[] = [{ id: "settings", icon: <Settings size={20} />, label: "Settings" }];

function fade(progress: MotionValue<number>, [from, to]: readonly [number, number]) {
  if (to >= 1) return useTransform(progress, [Math.max(0, from - 0.03), from], [0, 1]);
  return useTransform(progress, [Math.max(0, from - 0.03), from, to, Math.min(1, to + 0.03)], [0, 1, 1, 0]);
}

function Chapter({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const chapter = chapters[index];
  const opacity = fade(progress, chapter.at as [number, number]);
  const y = useTransform(opacity, [0, 1], [12, 0]);
  if (!chapter.title) return null;
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0 flex flex-col gap-3">
      <span className="font-mono text-xs text-fg-3">0{index}</span>
      <h2 className="text-2xl font-semibold leading-tight tracking-tight text-fg md:text-3xl">{chapter.title}</h2>
      <p className="max-w-sm text-base leading-relaxed text-fg-2">{chapter.body}</p>
      {index === chapters.length - 1 && <DocsButton />}
    </motion.div>
  );
}

function DocsButton() {
  const navigate = useNavigate();
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <Button trailing={<ArrowUpRight size={16} />} onClick={() => navigate("getting-started")}>
        Getting started
      </Button>
      <Button variant="secondary" onClick={() => navigate("components")}>
        All components
      </Button>
    </div>
  );
}

function Cover({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.12, 0.16], [1, 1, 0]);
  const y = useTransform(progress, [0, 0.16], [0, -24]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0 flex flex-col gap-5">
      <h1 className="text-6xl font-semibold tracking-tighter text-fg md:text-7xl">Crisp</h1>
      <p className="max-w-sm text-lg leading-relaxed text-fg-2">
        The React components LettuceAI is made of: tokens, motion and more than a hundred parts that work the same on a phone and a desktop.
      </p>
      <div className="flex max-w-sm items-center justify-between gap-3 rounded-xl border border-line bg-fill px-4 py-2.5">
        <code className="font-mono text-sm text-fg-2">{INSTALL}</code>
        <CopyButton value={INSTALL} />
      </div>
      <DocsButton />
      <span className="mt-6 font-mono text-xs text-fg-3">Scroll to take the screen apart</span>
    </motion.div>
  );
}

function Conversation() {
  const [draft, setDraft] = useState("");
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden px-5 pt-5">
        <Message role="assistant" author={{ name: "Mira" }}>
          The lighthouse was dark when we reached the harbour. Someone had taken the logbook.
        </Message>
        <Message role="user">Then we follow the tracks in the sand before the tide comes in.</Message>
        <Message role="assistant" author={{ name: "Mira" }} state="streaming">
          She is already running, lantern swinging, toward the
        </Message>
      </div>
      <div className="p-4">
        <Composer value={draft} onChange={setDraft} onSend={() => setDraft("")} placeholder="Write the next line" />
      </div>
    </div>
  );
}

const marks = [
  { label: "surface-1", style: { left: 0, top: 0, right: 0, bottom: 0 } },
  { label: "radius-2xl · fill", style: { left: 92, top: 214, width: 520, height: 82 } },
  { label: "accent", style: { right: 22, bottom: 22, width: 52, height: 52 } },
  { label: "control-lg", style: { left: 80, right: 16, bottom: 16, height: 64 } },
  { label: "fg-2 · text-sm", style: { left: 108, top: 140, width: 260, height: 22 } },
  { label: "rail · 64", style: { left: 0, top: 0, bottom: 0, width: 64 } },
] satisfies { label: string; style: CSSProperties }[];

function Stage({ progress, scale }: { progress: MotionValue<number>; scale: number }) {
  const [phone, setPhone] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);

  useMotionValueEvent(progress, "change", (p) => {
    setPhone(p > 0.52 && p < 0.66);
    setThemeIndex(p < 0.66 ? 0 : Math.min(THEMES.length - 1, Math.floor(((p - 0.66) / 0.2) * THEMES.length)));
  });

  const rotateX = useTransform(progress, [0.12, 0.24, 0.38, 0.46], [0, 56, 56, 0]);
  const rotateZ = useTransform(progress, [0.12, 0.24, 0.38, 0.46], [0, -32, -32, 0]);
  const lift = useTransform(progress, [0.12, 0.24, 0.38, 0.46], [0, 1, 1, 0]);
  const middle = useTransform(lift, (v) => v * 90);
  const top = useTransform(lift, (v) => v * 180);
  const width = useTransform(progress, [0.46, 0.56, 0.62, 0.68], [SCREEN.width, PHONE.width, PHONE.width, SCREEN.width]);
  const height = useTransform(progress, [0.46, 0.56, 0.62, 0.68], [SCREEN.height, PHONE.height, PHONE.height, SCREEN.height]);
  const radius = useTransform(progress, [0.46, 0.56, 0.62, 0.68], [20, 44, 44, 20]);
  const theme = THEMES[themeIndex];
  const vars = themeToVars(theme) as CSSProperties;

  return (
    <div style={{ perspective: 2000, transform: `scale(${scale})`, transformOrigin: "center" }} className="flex items-center justify-center">
      <motion.div style={{ rotateX, rotateZ, transformStyle: "preserve-3d", width, height }} className="relative">
        <motion.div
          style={{ ...vars, borderRadius: radius }}
          className="absolute inset-0 border border-line-2 bg-surface-1 shadow-overlay"
        />
        <motion.div
          ref={setFrame}
          style={{ ...vars, borderRadius: radius, translateZ: middle }}
          className="absolute inset-0 overflow-hidden text-fg"
        >
          <FrameProvider portal={frame} compact={phone}>
            <AppShell items={destinations} footerItems={footer} value="chats" onChange={() => {}} className="bg-transparent">
              <Conversation />
            </AppShell>
          </FrameProvider>
        </motion.div>
        <motion.div style={{ translateZ: top, opacity: lift }} className="pointer-events-none absolute inset-0">
          {marks.map((mark) => (
            <div key={mark.label} style={mark.style} className="absolute rounded-lg border border-dashed border-accent/70">
              <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-accent px-1.5 py-0.5 font-mono text-2xs text-on-accent">
                {mark.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
      <motion.span
        style={{ opacity: useTransform(progress, [0.64, 0.68, 0.86, 0.9], [0, 1, 1, 0]) }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-fg-3"
      >
        {theme.name}
      </motion.span>
    </div>
  );
}

function useStageScale(ref: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(1, (width - 16) / SCREEN.width, (height - 16) / SCREEN.height));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return scale;
}

function Scene() {
  const scene = useRef<HTMLElement>(null);
  const stageBox = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scene, offset: ["start start", "end end"] });
  const scale = useStageScale(stageBox);
  return (
    <section ref={scene} className="relative h-[560vh]">
      <div className="sticky top-0 flex h-dvh flex-col gap-6 overflow-hidden px-5 py-8 md:flex-row md:items-center md:gap-10 md:px-12">
        <div className="relative h-72 w-full shrink-0 md:h-96 md:w-96">
          <Cover progress={scrollYProgress} />
          {chapters.map((_, i) => (
            <Chapter key={i} progress={scrollYProgress} index={i} />
          ))}
        </div>
        <div ref={stageBox} className="relative flex min-h-0 flex-1 items-center justify-center self-stretch">
          <Stage progress={scrollYProgress} scale={scale} />
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-24 md:px-12">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <h2 className="text-3xl font-semibold tracking-tight text-fg">Index</h2>
        <span className="font-mono text-xs text-fg-3">{groups.reduce((n, g) => n + g.items.length, 0)} entries</span>
      </div>
      <div className="columns-1 gap-10 sm:columns-2 lg:columns-4">
        {groups.map((group) => (
          <div key={group.id} className="mb-8 break-inside-avoid">
            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-fg-3">{group.title}</h3>
            <ul className="flex flex-col">
              {group.items.map((item) => (
                <li key={item.slug}>
                  <a href={toHref(`components/${item.slug}`)} className="block py-0.5 text-sm text-fg-2 transition-colors motion-instant hover:text-accent">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Colophon(): ReactNode {
  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-8 font-mono text-xs text-fg-3 md:px-12">
      <span>Crisp · MIT · set in Inter · part of LettuceAI</span>
      <span className="flex gap-4">
        <a href={toHref("getting-started")} className="hover:text-fg">
          Docs
        </a>
        <a href={REPO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-fg">
          Source <BookOpen size={12} />
        </a>
      </span>
    </footer>
  );
}

export function Landing() {
  useEffect(() => {
    const at = /#at=([0-9.]+)/.exec(location.hash);
    if (import.meta.env.DEV && at) window.scrollTo(0, Number(at[1]) * innerHeight * 4.6);
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-surface text-fg">
        <Scene />
        <Index />
        <Colophon />
      </div>
    </MotionConfig>
  );
}
