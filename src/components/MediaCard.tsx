import { forwardRef, useState, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { tintFromName } from "../lib/tint";
import { Skeleton } from "./Skeleton";

export type MediaCardTone = "accent" | "info" | "warning" | "secondary" | "neutral";

export interface MediaCardProps extends Omit<HTMLMotionProps<"button">, "title"> {
  title: string;
  description?: ReactNode;
  image?: string | null;
  /** What kind of thing this is — a dot plus a word, only where it disambiguates. */
  kind?: string;
  tone?: MediaCardTone;
  /** Small pill next to the title (a persona's nickname, an entry count). */
  tag?: ReactNode;
  /** Bottom-right corner slot — a count, a duration. */
  meta?: ReactNode;
  selected?: boolean;
}

const toneDot: Record<MediaCardTone, string> = {
  accent: "bg-accent",
  info: "bg-info",
  warning: "bg-warning",
  secondary: "bg-secondary",
  neutral: "bg-fg-3",
};

/**
 * The poster card: a character, persona or lorebook at a glance.
 * Full-bleed art, one scrim behind the text only, title and one line of description.
 */
export const MediaCard = forwardRef<HTMLButtonElement, MediaCardProps>(function MediaCard(
  { title, description, image, kind, tone = "neutral", tag, meta, selected, className, type = "button", ...rest },
  ref,
) {
  const [broken, setBroken] = useState(false);
  const tint = tintFromName(title);
  const showImage = Boolean(image) && !broken;

  return (
    <motion.button
      ref={ref}
      type={type}
      aria-pressed={selected}
      whileTap={{ scale: 0.985 }}
      transition={m.instant}
      className={cn(
        "group relative flex aspect-3/4 w-full flex-col justify-end overflow-hidden rounded-2xl text-left",
        "border border-line transition-colors motion-instant hover:border-line-3",
        selected && "ring-2 ring-inset ring-fg/35",
        className,
      )}
      style={showImage ? undefined : { background: tint.background }}
      {...rest}
    >
      {showImage ? (
        <img
          src={image!}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform motion-slow ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-fg/25">
          {title.slice(0, 2).toUpperCase()}
        </span>
      )}

      {/* Scrim sits behind the text only, so the art stays readable above it. */}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

      {kind && (
        <span className="absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-black/55 px-2 py-1 text-2xs font-medium text-white/90 backdrop-blur-md">
          <span className={cn("h-1.5 w-1.5 rounded-full", toneDot[tone])} />
          {kind}
        </span>
      )}
      {meta && (
        <span className="absolute right-2.5 top-2.5 z-10 rounded-full border border-white/12 bg-black/55 px-2 py-1 text-2xs font-medium tabular-nums text-white/90 backdrop-blur-md">
          {meta}
        </span>
      )}

      <span className="relative z-10 flex flex-col gap-0.5 p-3">
        <span className="flex items-center gap-1.5">
          <span className="min-w-0 flex-1 truncate text-lg font-semibold leading-tight text-white">{title}</span>
          {tag && (
            <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-1.5 py-0.5 text-2xs font-medium text-white/80">
              {tag}
            </span>
          )}
        </span>
        {description && <span className="line-clamp-2 text-sm leading-snug text-white/70">{description}</span>}
      </span>
    </motion.button>
  );
});

/** Matches MediaCard's aspect and radius exactly, so the grid never reflows on load. */
export function MediaCardSkeleton() {
  return (
    <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl border border-line">
      <Skeleton shape="block" className="h-full w-full rounded-none" />
      <div className="absolute inset-x-0 bottom-0 space-y-2 p-3">
        <Skeleton width="65%" className="h-4" />
        <Skeleton width="90%" className="h-3" />
      </div>
    </div>
  );
}
