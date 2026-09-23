import { forwardRef, useState, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { tintFromName } from "../lib/tint";
import { Surface } from "./Surface";
import { Skeleton } from "./Skeleton";

export type CharacterCardVariant = "row" | "banner";

export interface CharacterCardProps extends Omit<HTMLMotionProps<"button">, "title"> {
  name: string;
  description?: ReactNode;
  avatar?: string | null;
  /** CSS colour or gradient extracted from the avatar. Falls back to a tint from the name. */
  gradient?: string | null;
  /** Text colours that go with the gradient. */
  fg?: string | null;
  fgMuted?: string | null;
  /** `row` is the horizontal list card; `banner` is the wide cover card. */
  variant?: CharacterCardVariant;
  /** Slot on the trailing edge — a badge, a menu. Replaces the chevron. */
  trailing?: ReactNode;
  selected?: boolean;
}

/**
 * The home-screen character card, in the app's two shapes. When the avatar yields a
 * gradient, the whole card becomes a Surface and every child re-colours itself —
 * no per-element `style={{ color: textColor }}`.
 *
 * It grows with the column it sits in, not with the window: a container query, so a
 * narrow pane on a wide monitor still gets the phone-sized card.
 */
export const CharacterCard = forwardRef<HTMLButtonElement, CharacterCardProps>(function CharacterCard(
  { name, description, avatar, gradient, fg, fgMuted, variant = "row", trailing, selected, className, type = "button", ...rest },
  ref,
) {
  const [broken, setBroken] = useState(false);
  const tint = gradient ?? tintFromName(name).background;
  const showAvatar = Boolean(avatar) && !broken;

  const shell = cn(
    "group relative w-full overflow-hidden text-left",
    "rounded-2xl @3xl:rounded-3xl",
    "ring-1 ring-inset ring-line-2 transition-[box-shadow,transform] motion-instant",
    selected && "ring-2 ring-accent",
    className,
  );

  if (variant === "banner") {
    return (
      <motion.button ref={ref} type={type} aria-pressed={selected} whileTap={{ scale: 0.99 }} transition={m.instant} className={shell} {...rest}>
        <Surface tint={tint} fg={fg} fgMuted={fgMuted} scrim="none" className="flex h-24 w-full @3xl:h-36">
          {/* The cover fades into the gradient rather than ending on a hard edge. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-3/5 max-w-[420px] overflow-hidden @3xl:w-1/2"
            style={{ maskImage: "linear-gradient(to right, black 55%, transparent)", WebkitMaskImage: "linear-gradient(to right, black 55%, transparent)" }}
          >
            {showAvatar && (
              <img
                src={avatar!}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => setBroken(true)}
                className="h-full w-full scale-[1.14] object-cover transition-transform motion-slow ease-out group-hover:-translate-x-3"
              />
            )}
          </span>
          <span className="relative ml-auto flex w-3/5 flex-col justify-center gap-1 p-4 @3xl:w-1/2 @3xl:p-6">
            <span className="truncate text-lg font-semibold leading-tight text-fg @3xl:text-2xl">{name}</span>
            {description && <span className="line-clamp-2 text-sm leading-snug text-fg-2 @3xl:text-base">{description}</span>}
          </span>
          {trailing && <span className="absolute right-3 top-3">{trailing}</span>}
        </Surface>
      </motion.button>
    );
  }

  return (
    <motion.button ref={ref} type={type} aria-pressed={selected} whileTap={{ scale: 0.99 }} transition={m.instant} className={shell} {...rest}>
      <Surface tint={tint} fg={fg} fgMuted={fgMuted} scrim="none" className="flex w-full items-center gap-3.5 p-3.5 @3xl:gap-6 @3xl:p-6">
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-line-3 @3xl:h-24 @3xl:w-24">
          {showAvatar ? (
            <img src={avatar!} alt="" loading="lazy" decoding="async" onError={() => setBroken(true)} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-fill-2 text-lg font-semibold text-fg-2">
              {name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5 @3xl:gap-1.5">
          <span className="truncate text-base font-semibold leading-tight text-fg @3xl:text-xl">{name}</span>
          {description && <span className="line-clamp-1 text-sm leading-snug text-fg-2 @3xl:line-clamp-2 @3xl:text-base">{description}</span>}
        </span>
        {trailing ?? <ChevronRight size={20} className="shrink-0 text-fg-3 transition-colors group-hover:text-fg-2" />}
      </Surface>
    </motion.button>
  );
});

export function CharacterCardSkeleton({ variant = "row" }: { variant?: CharacterCardVariant }) {
  if (variant === "banner") return <Skeleton shape="block" className="h-24 w-full rounded-2xl @3xl:h-36 @3xl:rounded-3xl" />;
  return (
    <div className="flex w-full items-center gap-3.5 rounded-2xl border border-line p-3.5 @3xl:gap-6 @3xl:rounded-3xl @3xl:p-6">
      <Skeleton shape="circle" className="h-14 w-14 shrink-0 @3xl:h-24 @3xl:w-24" />
      <div className="flex-1 space-y-2">
        <Skeleton width="40%" className="h-4" />
        <Skeleton width="70%" className="h-3" />
      </div>
    </div>
  );
}
