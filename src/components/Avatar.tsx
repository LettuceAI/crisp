import { useState } from "react";
import { cn } from "../lib/cn";

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Accent ring — the "active" / "speaking" state. */
  ring?: boolean;
  className?: string;
  /** Used by AvatarGroup to cut the overlap notch. */
  style?: React.CSSProperties;
}

const sizeClass = {
  xs: "h-6 w-6 text-2xs",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-24 w-24 text-2xl",
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ src, name, size = "md", ring, className, style }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(src) && !broken;
  return (
    <span
      role="img"
      aria-label={name}
      style={style}
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full",
        "border border-line bg-fill-2 font-semibold text-fg-2",
        ring && "ring-2 ring-accent ring-offset-2 ring-offset-surface",
        sizeClass[size],
        className,
      )}
    >
      {showImage ? (
        <img src={src!} alt="" onError={() => setBroken(true)} className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}
