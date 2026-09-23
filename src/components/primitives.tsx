import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * Text for screen readers only. Use it to name a control whose meaning is carried
 * visually — never to hide something a sighted user also needs.
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
      {children}
    </span>
  );
}

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** width / height. 16/9, 1, 3/4. */
  ratio?: number;
}

/** Reserves the right shape before an image loads, so the layout never jumps. */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 1, className, style, ...rest },
  ref,
) {
  return <div ref={ref} className={cn("relative w-full overflow-hidden", className)} style={{ aspectRatio: ratio, ...style }} {...rest} />;
});
