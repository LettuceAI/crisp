import { createContext, forwardRef, useContext, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useImageBrightness } from "../lib/imageBrightness";

interface SurfaceContextValue {
  /** Something is painted behind the content — chrome above it should frost, not sit flat. */
  hasBackground: boolean;
  /** Whether that something is light or dark, so glass knows which way to tint. */
  tone: "light" | "dark";
}

const SurfaceContext = createContext<SurfaceContextValue>({ hasBackground: false, tone: "dark" });

/**
 * "Am I sitting on a photo or a gradient, and is it light or dark?" Components use this
 * to switch to glass — a translucent fill plus backdrop-blur — tinted the right way.
 */
export function useOnSurface() {
  return useContext(SurfaceContext);
}

export interface SurfaceProps {
  /** A background image (data URL or asset URL) painted under the content. */
  image?: string | null;
  /** Which part of the image to keep when it is cropped to fit — `object-position`. */
  imagePosition?: string;
  /** A CSS colour or gradient painted under the content — what useAvatarGradient returns. */
  tint?: string | null;
  /**
   * Foreground colour for everything inside. When a gradient or photo decides the
   * background, it also decides the text colour, so pass what the extractor computed.
   */
  fg?: string | null;
  /** Optional explicit secondary colour; otherwise derived from `fg`. */
  fgMuted?: string | null;
  /**
   * How far to push the art away from the text. The image itself is never blurred —
   * the picture is the point. The chrome above it frosts instead.
   *
   * The veil follows the image: dark art gets a black veil, light art a white one, so
   * a bright photograph does not leave white text sitting on white.
   */
  scrim?: "none" | "soft" | "auto" | "strong";
  /**
   * Skip measuring and state the art's tone yourself — the app already computes this
   * when it extracts an avatar's gradient.
   */
  tone?: "light" | "dark";
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const scrimClass: Record<"light" | "dark", Record<"none" | "soft" | "auto" | "strong", string | null>> = {
  dark: { none: null, soft: "bg-black/20", auto: "bg-black/40", strong: "bg-black/60" },
  light: { none: null, soft: "bg-white/25", auto: "bg-white/50", strong: "bg-white/70" },
};

/** Above this mean luminance, text has to go dark. */
const LIGHT_THRESHOLD = 0.42;

/**
 * A patch of UI whose background is decided by content — a character's extracted
 * gradient, a chat's background image — rather than by the theme.
 *
 * It rebinds the colour tiers for its subtree, so every Crisp component inside keeps
 * using `text-fg`, `text-fg-3`, `bg-fill`, `border-line` and simply comes out the right
 * colour. Without this, each component ends up carrying its own
 * `style={hasGradient ? { color: textColor } : {}}` — which is what the app does today,
 * four times in one card.
 */
export const Surface = forwardRef<HTMLElement, SurfaceProps>(function Surface(
  { image, imagePosition, tint, fg, fgMuted, scrim = "auto", tone: toneProp, as, className, style, children },
  ref,
) {
  const Tag = (as ?? "div") as ElementType;
  const painted = Boolean(image || tint);
  const measured = useImageBrightness(toneProp || fg ? null : image);
  /* Unknown stays dark: a wrong guess toward light puts pale text on a pale photo. */
  const tone: "light" | "dark" = toneProp ?? (measured !== null && measured > LIGHT_THRESHOLD ? "light" : "dark");
  /* Without an explicit foreground, follow the art rather than the theme. */
  const resolvedFg = fg ?? (image && tone === "light" ? "#111112" : image ? "#ffffff" : null);

  /* Tiers are mixed toward transparent, not toward the surface colour: over a photo
     or a gradient there is no flat backdrop to blend into. */
  const vars = resolvedFg
    ? ({
        "--color-fg": resolvedFg,
        "--color-fg-2": fgMuted ?? `color-mix(in oklab, ${resolvedFg} 78%, transparent)`,
        "--color-fg-3": `color-mix(in oklab, ${resolvedFg} 58%, transparent)`,
        "--color-fg-4": `color-mix(in oklab, ${resolvedFg} 38%, transparent)`,
        /* Inputs and hover fills go the art's own way rather than lightening it: a
           white haze on a photograph reads as fog. */
        "--color-fill": tone === "light" ? "rgb(255 255 255 / 0.45)" : "rgb(0 0 0 / 0.35)",
        "--color-fill-2": `color-mix(in oklab, ${resolvedFg} 12%, transparent)`,
        "--color-fill-3": `color-mix(in oklab, ${resolvedFg} 18%, transparent)`,
        "--color-line": `color-mix(in oklab, ${resolvedFg} 14%, transparent)`,
        "--color-line-2": `color-mix(in oklab, ${resolvedFg} 22%, transparent)`,
        "--color-line-3": `color-mix(in oklab, ${resolvedFg} 32%, transparent)`,
        /* Cards and sheets inside become glass: a veil in the art's own darkness (or
           lightness), so a Card, an Input or a ListGroup dropped on a photo needs no
           special variant. */
        "--color-surface-1": tone === "light" ? "rgb(255 255 255 / 0.55)" : "rgb(0 0 0 / 0.45)",
        "--color-surface-2": tone === "light" ? "rgb(255 255 255 / 0.7)" : "rgb(0 0 0 / 0.6)",
        "--color-surface-el": tone === "light" ? "rgb(255 255 255 / 0.55)" : "rgb(0 0 0 / 0.45)",
      } as CSSProperties)
    : undefined;

  return (
    <SurfaceContext.Provider value={{ hasBackground: painted, tone }}>
      <Tag
        ref={ref}
        className={cn("relative isolate", className)}
        style={{ ...vars, ...(tint && !image ? { background: tint } : undefined), ...style }}
      >
        {image && (
          /* An <img>, not a CSS background: an unquoted url() breaks on any URL
             containing parentheses — which a data URI routinely does — and fails
             silently. It is also never blurred; the picture is the point. */
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
            style={{ objectPosition: imagePosition, ...(tint ? { backgroundColor: tint } : undefined) }}
          />
        )}
        {painted && scrimClass[tone][scrim] && (
          <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10", scrimClass[tone][scrim])} />
        )}
        {children}
      </Tag>
    </SurfaceContext.Provider>
  );
});
