import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";

export interface ContextMenuProps {
  /** The menu body — reuse MenuItem / MenuSeparator / MenuLabel. */
  menu: ReactNode;
  /** ms to hold before it opens on touch. Default 450. */
  longPressDelay?: number;
  /** Fires when the menu opens and closes — use it to mark the target as held. */
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Right-click on desktop, long-press on touch — one component for both, which is what
 * the app writes by hand at every message and library item. Opens at the pointer and
 * flips to stay on screen.
 */
export function ContextMenu({ menu, longPressDelay = 450, onOpenChange, disabled, className, children }: ContextMenuProps) {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);

  const clear = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => {
    if (!point) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    /* Capture, so a click inside the menu still closes it after the item handles it. */
    const onPointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", close, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point]);

  useEffect(() => clear, [clear]);

  const open = (x: number, y: number) => {
    const width = 224;
    const height = 260;
    setPoint({
      x: Math.min(x, window.innerWidth - width - 8),
      y: Math.min(y, window.innerHeight - height - 8),
    });
    onOpenChange?.(true);
  };

  const close = () => {
    setPoint(null);
    onOpenChange?.(false);
  };

  if (disabled) return <>{children}</>;

  return (
    <>
      <div
        className={cn("contents", className)}
        onContextMenu={(event) => {
          event.preventDefault();
          open(event.clientX, event.clientY);
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== "touch") return;
          origin.current = { x: event.clientX, y: event.clientY };
          clear();
          timer.current = window.setTimeout(() => open(event.clientX, event.clientY), longPressDelay);
        }}
        onPointerMove={(event) => {
          if (!origin.current) return;
          const moved = Math.hypot(event.clientX - origin.current.x, event.clientY - origin.current.y);
          if (moved > 10) clear();
        }}
        onPointerUp={clear}
        onPointerCancel={clear}
      >
        {children}
      </div>
      {createPortal(
        <AnimatePresence>
          {point && (
            <motion.div
              ref={panelRef}
              role="menu"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={m.instant}
              style={{ top: point.y, left: point.x }}
              onClick={close}
              className="fixed z-[80] min-w-48 origin-top-left rounded-xl border border-line bg-surface-2 p-1 shadow-raised"
            >
              {menu}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
