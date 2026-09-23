import { useCallback, useRef } from "react";
import type { MouseEvent, PointerEvent } from "react";

/**
 * Long-press (and right-click) on a button, without swallowing the normal click.
 * Returns handlers to spread on the element.
 */
export function useLongPress(onLongPress: (() => void) | undefined, { delay = 450, enabled = true } = {}) {
  const timer = useRef<number | null>(null);
  const fired = useRef(false);
  const origin = useRef<{ x: number; y: number } | null>(null);

  const clear = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!enabled || !onLongPress || event.button !== 0) return;
      clear();
      fired.current = false;
      origin.current = { x: event.clientX, y: event.clientY };
      timer.current = window.setTimeout(() => {
        fired.current = true;
        onLongPress();
      }, delay);
    },
    [clear, delay, enabled, onLongPress],
  );

  /* A press that travels is a swipe or a selection, not a hold. Without this the menu
     fires in the middle of a gesture the person is still making. */
  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (timer.current === null || !origin.current) return;
      const { x, y } = origin.current;
      if (Math.abs(event.clientX - x) > 10 || Math.abs(event.clientY - y) > 10) clear();
    },
    [clear],
  );

  const onContextMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!enabled || !onLongPress) return;
      event.preventDefault();
      clear();
      fired.current = true;
      onLongPress();
    },
    [clear, enabled, onLongPress],
  );

  /** Wrap the click handler so a completed long-press does not also click. */
  const guardClick = useCallback(
    (handler: () => void) => (event: MouseEvent<HTMLElement>) => {
      clear();
      if (fired.current) {
        event.preventDefault();
        fired.current = false;
        return;
      }
      handler();
    },
    [clear],
  );

  return {
    handlers: { onPointerDown, onPointerMove, onPointerUp: clear, onPointerLeave: clear, onPointerCancel: clear, onContextMenu },
    guardClick,
  };
}
