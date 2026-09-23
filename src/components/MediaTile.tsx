import { forwardRef, useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Layers } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { Skeleton } from "./Skeleton";

export interface MediaTileProps extends Omit<HTMLMotionProps<"button">, "title" | "variants"> {
  src: string;
  /** Describes the image for screen readers; also the fallback text. */
  alt: string;
  /** Badge in the corner — "Avatar", "Background". Omit when it isn't useful. */
  kind?: string;
  /** Number of variants stacked under this one. */
  variantCount?: number;
  selected?: boolean;
  aspect?: "square" | "portrait";
}

/**
 * A square image in a grid. Deliberately bare: on a touch screen there is no hover,
 * so metadata that only appears on hover is metadata nobody reads. Size, dimensions
 * and format belong in the detail sheet this tile opens.
 */
export const MediaTile = forwardRef<HTMLButtonElement, MediaTileProps>(function MediaTile(
  { src, alt, kind, variantCount, selected, aspect = "square", className, type = "button", ...rest },
  ref,
) {
  const [broken, setBroken] = useState(false);
  return (
    <motion.button
      ref={ref}
      type={type}
      aria-label={alt}
      aria-pressed={selected}
      whileTap={{ scale: 0.985 }}
      transition={m.instant}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border border-line bg-fill",
        "transition-colors motion-instant hover:border-line-3",
        selected && "ring-2 ring-inset ring-fg/45",
        aspect === "square" ? "aspect-square" : "aspect-3/4",
        className,
      )}
      {...rest}
    >
      {broken ? (
        <span className="flex h-full w-full items-center justify-center px-2 text-center text-2xs text-fg-3">{alt}</span>
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setBroken(true)}
          className="h-full w-full object-cover transition-transform motion-slow ease-out group-hover:scale-[1.04]"
        />
      )}
      {kind && (
        <span className="absolute left-1.5 top-1.5 rounded-md border border-white/12 bg-black/60 px-1.5 py-0.5 text-2xs font-medium text-white/90 backdrop-blur-md">
          {kind}
        </span>
      )}
      {variantCount && variantCount > 1 && (
        <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-md border border-white/12 bg-black/60 px-1.5 py-0.5 text-2xs font-medium tabular-nums text-white/90 backdrop-blur-md">
          <Layers size={12} />
          {variantCount}
        </span>
      )}
    </motion.button>
  );
});

export function MediaTileSkeleton({ aspect = "square" }: { aspect?: "square" | "portrait" }) {
  return <Skeleton shape="block" className={cn("w-full rounded-xl", aspect === "square" ? "aspect-square" : "aspect-3/4")} />;
}
