import { cloneElement, useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { Popover, PopoverAnchor, PopoverContent } from "./Popover";

export interface HoverCardProps {
  content: ReactNode;
  /** ms before it appears / disappears. */
  openDelay?: number;
  closeDelay?: number;
  side?: "top" | "bottom" | "left" | "right";
  children: ReactElement<Record<string, unknown>>;
}

/**
 * A preview on hover — a character card under a mention, model details under a name.
 * Pointer-only by design: it never opens on touch, so it must never hold anything you
 * can't reach another way.
 */
export function HoverCard({ content, openDelay = 400, closeDelay = 150, side = "top", children }: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const schedule = (next: boolean) => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), next ? openDelay : closeDelay);
  };

  const child = children.props as { onPointerEnter?: (e: unknown) => void; onPointerLeave?: (e: unknown) => void };
  const trigger = cloneElement(children, {
    onPointerEnter: (event: React.PointerEvent) => {
      child.onPointerEnter?.(event);
      if (event.pointerType === "mouse") schedule(true);
    },
    onPointerLeave: (event: unknown) => {
      child.onPointerLeave?.(event);
      schedule(false);
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* PopoverAnchor, not PopoverTrigger: hovering opens this, clicking does nothing.
          It also has to be the Popover's own anchor ref — a local one of our own never
          reaches the panel, which then has nothing to measure and lands at 0,0. */}
      <PopoverAnchor>{trigger}</PopoverAnchor>
      <PopoverContent
        side={side}
        align="center"
        className="w-72 p-0"
      >
        <div onPointerEnter={() => schedule(true)} onPointerLeave={() => schedule(false)}>
          {content}
        </div>
      </PopoverContent>
    </Popover>
  );
}
