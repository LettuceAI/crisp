import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ResizableProps {
  /** Fixed-size pane. */
  panel: ReactNode;
  /** Fills whatever is left. */
  children: ReactNode;
  side?: "left" | "right";
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  /** Persisted key, so a person's split survives a reload. */
  storageKey?: string;
  className?: string;
}

/**
 * A draggable split, for desktop screens that pair a list with an inspector — the
 * lorebook trigger preview does this with a hard-coded width. The handle is a real
 * separator: arrow keys resize it, so it isn't mouse-only.
 */
export function Resizable({
  panel, children, side = "left", defaultSize = 320, minSize = 200, maxSize = 640, storageKey, className,
}: ResizableProps) {
  const [size, setSize] = useState(() => {
    if (!storageKey || typeof localStorage === "undefined") return defaultSize;
    try {
      const stored = Number(localStorage.getItem(storageKey));
      return Number.isFinite(stored) && stored > 0 ? stored : defaultSize;
    } catch {
      return defaultSize;
    }
  });
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const clamp = useCallback((n: number) => Math.min(maxSize, Math.max(minSize, n)), [minSize, maxSize]);

  const commit = useCallback(
    (next: number) => {
      const value = clamp(next);
      setSize(value);
      if (storageKey) {
        try { localStorage.setItem(storageKey, String(value)); } catch { /* private mode */ }
      }
    },
    [clamp, storageKey],
  );

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!dragging.current) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      commit(side === "left" ? event.clientX - rect.left : rect.right - event.clientX);
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [commit, side]);

  const handle = (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-valuenow={size}
      aria-valuemin={minSize}
      aria-valuemax={maxSize}
      aria-label="Resize panel"
      tabIndex={0}
      onPointerDown={() => {
        dragging.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      }}
      onKeyDown={(event) => {
        const delta = event.key === "ArrowRight" ? 16 : event.key === "ArrowLeft" ? -16 : 0;
        if (!delta) return;
        event.preventDefault();
        commit(size + (side === "left" ? delta : -delta));
      }}
      onDoubleClick={() => commit(defaultSize)}
      className="group relative w-px shrink-0 cursor-col-resize bg-line outline-none"
    >
      <span className="absolute inset-y-0 -left-1.5 -right-1.5" />
      <span className="absolute inset-y-0 left-0 w-px bg-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
    </div>
  );

  return (
    <div ref={containerRef} className={cn("flex min-h-0 w-full", side === "right" && "flex-row-reverse", className)}>
      <div style={{ width: size }} className="min-w-0 shrink-0 overflow-hidden">
        {panel}
      </div>
      {handle}
      <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
