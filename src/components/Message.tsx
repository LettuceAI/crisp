import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Brain, ChevronDown, Clapperboard, Info, Pin } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { Avatar } from "./Avatar";
import { useOnSurface } from "./Surface";
import { Sheet } from "./Sheet";
import { useLongPress } from "../lib/useLongPress";

export type MessageRole = "user" | "assistant" | "scene" | "system";
export type MessageState = "idle" | "streaming" | "typing";

/** User-facing chat appearance settings. Mirrors what the app already exposes. */
export interface MessageAppearance {
  fontSize?: "small" | "medium" | "large" | "xlarge";
  lineSpacing?: "tight" | "normal" | "relaxed";
  radius?: "sharp" | "rounded" | "pill";
  maxWidth?: "compact" | "normal" | "wide";
  padding?: "compact" | "normal" | "spacious";
  /** `filled` is a tinted bubble, `bordered` adds a hairline, `minimal` drops the bubble entirely. */
  style?: "filled" | "bordered" | "minimal";
  avatar?: "circle" | "rounded" | "hidden";
  avatarSize?: "small" | "medium" | "large";
  /** Where the byline sits. `below` puts it under the bubble with the timestamp. */
  headerPlacement?: "below" | "outside" | "inside";
}

export interface MessageVariants {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export interface MessageProps {
  role: MessageRole;
  children?: ReactNode;
  author?: { name: string; avatar?: string | null };
  timestamp?: string;
  state?: MessageState;
  /** The model's visible reasoning, collapsed by default. */
  reasoning?: { text: ReactNode; label?: string };
  /** Images and files sent with the message. */
  attachments?: ReactNode;
  /** Regeneration variants. Swipe the bubble sideways to move between them. */
  variants?: MessageVariants;
  /**
   * Where this message sits in a run from the same author.
   * The avatar is drawn once at the top of the run, the byline once at the bottom —
   * so a three-message reply reads as one block instead of three headed cards.
   */
  group?: "only" | "start" | "middle" | "end";
  pinned?: boolean;
  /**
   * Everything a person can do to this message, shown in a bottom menu on long-press
   * or right-click. It is the only path, so it is the same path on every platform —
   * no row of icons that a phone can never reveal.
   */
  menu?: ReactNode;
  /** Title for that menu. */
  menuTitle?: ReactNode;
  /**
   * Take the gesture instead of the menu: long-press and right-click call this, and the
   * message draws no sheet of its own. For a screen that keeps one menu for every
   * message — richer than a list of rows, and closed from the screen's own state.
   * Pair with `held` so the bubble shows which message it is for.
   */
  onMenu?: () => void;
  /** Force the held look — for a menu you control yourself. */
  held?: boolean;
  appearance?: MessageAppearance;
  className?: string;
}

const fontSize = { small: "text-sm", medium: "text-base", large: "text-lg", xlarge: "text-xl" };
const lineSpacing = { tight: "leading-snug", normal: "leading-normal", relaxed: "leading-relaxed" };
const radiusClass = { sharp: "rounded-md", rounded: "rounded-xl", pill: "rounded-2xl" };
/*
 * How wide a bubble may grow: the column minus a gutter, capped at a reading measure.
 *
 * A percentage did one of those jobs and wasted the other. 82% keeps a desktop line
 * readable, but a phone's column is already narrow — there it left a third of the
 * screen empty beside every message. Now the gutter decides on a phone (the gap on the
 * far side is what says whose message it is) and the cap decides on a desktop, where
 * 36rem lands within a few pixels of the old 82%.
 */
const maxWidth = {
  compact: "max-w-[min(calc(100%-3rem),30rem)]",
  normal: "max-w-[min(calc(100%-1.5rem),36rem)]",
  wide: "max-w-[min(100%,44rem)]",
};
const padding = { compact: "px-3 py-2", normal: "px-4 py-2.5", spacious: "px-5 py-3.5" };
const avatarSize = { small: "xs", medium: "sm", large: "md" } as const;

const DEFAULTS: Required<Omit<MessageAppearance, never>> = {
  fontSize: "medium",
  lineSpacing: "relaxed",
  radius: "rounded",
  maxWidth: "normal",
  padding: "normal",
  style: "filled",
  avatar: "circle",
  avatarSize: "medium",
  headerPlacement: "below",
};

export function Message({
  role, children, author, timestamp, state = "idle", reasoning, attachments,
  variants, group = "only", pinned, held, menu, menuTitle = "Message", onMenu, appearance, className,
}: MessageProps) {
  const a = { ...DEFAULTS, ...appearance };
  const mine = role === "user";
  /* On a background image the flat theme fill disappears into the art, so bubbles
     become glass: a stronger translucent fill that blurs what is behind it. */
  const { hasBackground: glass, tone: surfaceTone } = useOnSurface();
  const showsAvatar = group === "only" || group === "start";
  /* The byline is drawn once per run, at whichever end it sits: below the last bubble
     when it trails the message, above the first when it heads it. Tying it to the last
     message either way put the name over the middle of a block. */
  const showsByline = group === "only" || group === (a.headerPlacement === "below" ? "end" : "start");
  const [menuOpen, setMenuOpen] = useState(false);
  const isHeld = held || menuOpen;
  const openMenu = onMenu ?? (menu ? () => setMenuOpen(true) : undefined);
  const longPress = useLongPress(openMenu, { enabled: Boolean(openMenu) });

  /* Regenerations are moved through by throwing the bubble sideways — left for the next
     one, right for the previous — with the count in its corner. Arrows beside the byline
     were a second, desktop-only control for something the card itself already does. */
  const swipeable = Boolean(variants && variants.total > 1);
  /* How far the card can travel. Inside this range it tracks the pointer exactly; past
     it the rubber band takes over and it goes almost nowhere. At either end of the run
     the travel is short, so a swipe with nothing behind it says so before you let go. */
  const swipeReach = 176;
  const swipeEdge = 56;
  const onVariantDragEnd = (_: unknown, info: PanInfo) => {
    if (!variants) return;
    const far = Math.abs(info.offset.x) > 40;
    const fast = Math.abs(info.velocity.x) > 320;
    if (!far && !fast) return;
    if (info.offset.x < 0) {
      if (variants.index < variants.total - 1) variants.onNext();
    } else if (variants.index > 0) {
      variants.onPrev();
    }
  };

  /* Scene and system are narrated rather than spoken, but they are still messages:
     same row, same bubble, same menu and variants. Only the byline changes. */
  const narration = role === "scene" || role === "system";
  const byline = author?.name ?? (role === "scene" ? "Scene" : role === "system" ? "System" : undefined);

  const showAvatar = a.avatar !== "hidden" && Boolean(author) && !narration && showsAvatar;
  /* An empty meta line still costs the column gap, so only draw it when it holds something. */
  const hasMeta =
    (showsByline && a.headerPlacement === "below" && Boolean(byline || timestamp)) ||
    (Boolean(pinned) && a.headerPlacement === "below");
  const header = showsByline && (byline || timestamp) && (
    <div className={cn("flex items-baseline gap-2", mine && "flex-row-reverse")}>
      {byline && (
        <span className={cn("truncate text-sm font-medium", narration && !author ? "text-fg-3" : "text-fg-2")}>
          {byline}
        </span>
      )}
      {timestamp && <span className="shrink-0 text-2xs tabular-nums text-fg-3">{timestamp}</span>}
      {pinned && (
        <span className="inline-flex shrink-0 items-center gap-1 text-2xs text-info" aria-label="Pinned">
          <Pin size={12} />
          Pinned
        </span>
      )}
    </div>
  );

  const bubble = (
    <motion.div
      initial={state === "typing" ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={m.quick}
      {...(swipeable
        ? {
            /* The constraints are the travel limit, not a brake: inside them the card
               tracks the pointer one to one. Elasticity only applies past the edge, so
               it stops where it should instead of crawling the whole way. */
            drag: "x" as const,
            dragDirectionLock: true,
            dragConstraints: {
              left: variants!.index >= variants!.total - 1 ? -swipeEdge : -swipeReach,
              right: variants!.index <= 0 ? swipeEdge : swipeReach,
            },
            dragElastic: 0.08,
            dragSnapToOrigin: true,
            dragMomentum: false,
            dragTransition: m.rebound,
            whileDrag: { cursor: "grabbing" },
            onDragEnd: onVariantDragEnd,
          }
        : {})}
      className={cn(
        "relative min-w-0",
        fontSize[a.fontSize],
        lineSpacing[a.lineSpacing],
        /* Narration is a note dropped into the story, not something anybody says: full
           width to its own measure, and a step quieter. It still answers to the bubble
           style — a minimal chat is minimal everywhere, or the setting is a lie. */
        narration
          ? cn(
              /* Sized like a reply, not stretched across the column: a card twice
                 the width of the bubbles around it reads as a different kind of page. */
              "w-fit text-fg-2",
              maxWidth[a.maxWidth],
              a.style !== "minimal" && padding[a.padding],
              /* A system note is bookkeeping — "three days pass" — not a line of the
                 story. One step down in size and padding, so it marks time without
                 taking the room a reply would. A scene keeps body size: it is prose. */
              role === "system" && "text-sm leading-normal",
              role === "system" && a.style !== "minimal" && "px-3 py-2",
              a.style !== "minimal" && radiusClass[a.radius],
              glass && a.style !== "minimal" && "backdrop-blur-md",
              a.style === "filled" &&
                (glass
                  ? surfaceTone === "light"
                    ? "border border-black/10 bg-white/45"
                    : "border border-white/10 bg-black/45"
                  : "border border-line bg-fill"),
              a.style === "bordered" && "border border-line-2",
            )
          : cn(
              "w-fit",
              maxWidth[a.maxWidth],
              a.style !== "minimal" && padding[a.padding],
              a.style !== "minimal" && radiusClass[a.radius],
              a.style === "minimal" && "text-fg",
              a.style === "filled" && (mine ? "bg-accent/22 text-fg" : "bg-fill-2 text-fg"),
              glass && a.style !== "minimal" && "backdrop-blur-md",
              glass && a.style === "filled" && surfaceTone === "dark" && (mine ? "bg-accent/35" : "border border-white/10 bg-black/35"),
              glass && a.style === "filled" && surfaceTone === "light" && (mine ? "bg-accent/40" : "border border-black/10 bg-white/55"),
              a.style === "bordered" && (mine ? "border border-accent/40 text-fg" : "border border-line-2 text-fg"),
              mine && "ml-auto",
            ),
        /* Room in the corner for the counter, so it never lands on the last line.
           Last in the list so it wins over the padding preset. */
        swipeable && "pb-6",
        isHeld && "ring-2 ring-accent/50",
      )}
    >
      {a.headerPlacement === "inside" && header && <div className="mb-1.5">{header}</div>}
      {attachments && <div className="mb-2">{attachments}</div>}

      {state === "typing" ? <TypingDots /> : children}
      {state === "streaming" && (
        <span aria-hidden="true" className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse bg-accent" />
      )}

      {swipeable && (
        <span
          className="pointer-events-none absolute bottom-1.5 right-3 text-2xs tabular-nums text-fg-3 select-none"
          aria-live="polite"
        >
          {variants!.index + 1}/{variants!.total}
        </span>
      )}
    </motion.div>
  );

  const row = (
    <div
      /* The gesture sits on the row itself. A wrapper around it — even `display:contents`
         — makes every message the first child of its own wrapper, and `first:mt-0` then
         strips the leading margin from all of them. */
      {...(openMenu ? longPress.handlers : {})}
      className={cn(
        "group/message flex w-full gap-2",
        group === "start" || group === "only" ? "mt-5 first:mt-0" : "mt-1",
        mine ? "flex-row-reverse" : "flex-row",
        className,
      )}
    >
      {showAvatar ? (
        <Avatar
          name={author!.name}
          src={author!.avatar}
          size={avatarSize[a.avatarSize]}
          className={cn("mt-0.5", a.avatar === "rounded" && "rounded-lg")}
        />
      ) : narration && a.avatar !== "hidden" && showsAvatar ? (
        /* A mark, not a face — narration is not a person, but it still holds the lane so
           the column of avatars stays unbroken. */
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex shrink-0 items-center justify-center border border-line bg-fill text-fg-3",
            a.avatar === "rounded" ? "rounded-lg" : "rounded-full",
            a.avatarSize === "small" ? "h-6 w-6" : a.avatarSize === "large" ? "h-10 w-10" : "h-8 w-8",
          )}
        >
          {role === "scene" ? <Clapperboard size={14} /> : <Info size={14} />}
        </span>
      ) : (
        a.avatar !== "hidden" && (
          <span className={cn("shrink-0", a.avatarSize === "small" ? "w-6" : a.avatarSize === "large" ? "w-10" : "w-8")} aria-hidden="true" />
        )
      )}

      <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5", mine && "items-end")}>
        {a.headerPlacement === "outside" && header}
        {reasoning && (
          <Reasoning label={reasoning.label} align={mine ? "end" : "start"}>
            {reasoning.text}
          </Reasoning>
        )}
        {bubble}

        {/* Byline, pin and version counter, on one quiet line under the bubble. Nothing
            else lives here — the actions are in the bottom menu, one gesture away. */}
        {hasMeta && (
          <div className={cn("flex items-center gap-2", mine && !narration && "flex-row-reverse")}>
            {showsByline && a.headerPlacement === "below" && byline && (
              <span className="truncate text-2xs text-fg-3">
                {byline}
                {timestamp && <span className="ml-1.5 tabular-nums text-fg-3">{timestamp}</span>}
              </span>
            )}
            {pinned && (
              <span className="inline-flex shrink-0 items-center gap-1 text-2xs text-info" aria-label="Pinned">
                <Pin size={12} />
                Pinned
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (!menu || onMenu) return row;
  return (
    <>
      {row}
      {/* Portals to the body, so it takes no place in the message flow. */}
      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title={menuTitle} size="sm">
        <div className="pb-2">{menu}</div>
      </Sheet>
    </>
  );
}

/**
 * The model's reasoning. It sits above the bubble, unboxed: a quiet toggle, and when
 * open, an aside marked by a single rule. A bordered panel here would be a card inside
 * a card, and the reasoning is not the reply.
 */
function Reasoning({
  label = "Thought process",
  align = "start",
  children,
}: {
  label?: string;
  align?: "start" | "end";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("flex w-full flex-col", align === "end" ? "items-end" : "items-start")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="-mx-1 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm text-fg-3 transition-colors hover:text-fg-2"
      >
        <Brain size={14} className="shrink-0 text-secondary" />
        {label}
        <ChevronDown size={14} className={cn("shrink-0 transition-transform motion-quick", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={m.collapse}
            className="w-full overflow-hidden"
          >
            <div
              className={cn(
                "mt-1 max-w-[min(calc(100%-1.5rem),36rem)] py-0.5 text-sm leading-relaxed text-fg-3",
                align === "end" ? "ml-auto border-r border-line-2 pr-3 text-right" : "border-l border-line-2 pl-3",
              )}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TypingDots({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-1 py-1", className)} role="status" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-fg-3"
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.1, 0.85] }}
          transition={{ ...m.pulse, delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}

/** Date separator between days of conversation. */
export function MessageDivider({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="h-px flex-1 bg-line" />
      <span className="shrink-0 text-2xs font-medium text-fg-3">{children}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
