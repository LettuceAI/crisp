import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { Avatar, type AvatarProps } from "./Avatar";

export interface AvatarGroupProps {
  people: readonly { name: string; src?: string | null }[];
  /** Show at most this many, then a +N counter. Default 4. */
  max?: number;
  size?: AvatarProps["size"];
  /** Hover/focus a face to bring it forward — desktop only, it's decoration. */
  interactive?: boolean;
  /** Replaces the +N chip. */
  overflow?: ReactNode;
  className?: string;
}

/**
 * Overlapping faces with a count.
 *
 * The gap between faces is cut out of each avatar with a mask, not painted with a ring
 * in the page colour. A ring has to guess the backdrop, and gets it wrong the moment the
 * group sits on a card, a gradient or a photo — which in this app it usually does.
 */
const geometry = {
  xs: { size: 24, pull: "-ml-2", cx: 28, cut: 14, chip: "h-6 w-6 text-2xs" },
  sm: { size: 32, pull: "-ml-2.5", cx: 38, cut: 18, chip: "h-8 w-8 text-2xs" },
  md: { size: 40, pull: "-ml-3", cx: 48, cut: 22, chip: "h-10 w-10 text-xs" },
  lg: { size: 56, pull: "-ml-4", cx: 68, cut: 30, chip: "h-14 w-14 text-sm" },
  xl: { size: 96, pull: "-ml-6", cx: 120, cut: 50, chip: "h-24 w-24 text-lg" },
} as const;

export function AvatarGroup({ people, max = 4, size = "sm", interactive, overflow, className }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  const g = geometry[size ?? "sm"];
  const hasTrailing = rest > 0 || Boolean(overflow);

  /* Cut a notch where the next face will sit, so the real backdrop shows through. */
  const notch = `radial-gradient(circle ${g.cut}px at ${g.cx}px 50%, transparent 100%, black 100%)`;

  return (
    <div
      className={cn("flex items-center", className)}
      role="group"
      aria-label={`${people.length} ${people.length === 1 ? "person" : "people"}`}
    >
      {shown.map((person, index) => {
        const masked = index < shown.length - 1 || hasTrailing;
        return (
          <Avatar
            key={`${person.name}-${index}`}
            name={person.name}
            src={person.src}
            size={size}
            className={cn(index > 0 && g.pull, interactive && "transition-transform hoverable:hover:-translate-y-0.5 hoverable:hover:z-10")}
            style={masked ? { maskImage: notch, WebkitMaskImage: notch } : undefined}
          />
        );
      })}
      {rest > 0 &&
        (overflow ?? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-full bg-fill-3 font-medium tabular-nums text-fg-2",
              g.pull,
              g.chip,
            )}
          >
            +{rest}
          </span>
        ))}
    </div>
  );
}
