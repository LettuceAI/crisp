import { useEffect, useLayoutEffect, useRef } from "react";

const layers: { dismiss: () => void }[] = [];

/** Puts an overlay on top of the stack and returns the function that takes it off. */
export function pushLayer(dismiss: () => void): () => void {
  const layer = { dismiss };
  layers.push(layer);
  return () => {
    const index = layers.indexOf(layer);
    if (index >= 0) layers.splice(index, 1);
  };
}

/**
 * Registers an open overlay on a shared stack, so a platform back gesture (Android's
 * back button and swipe) can close the topmost one, the way Escape does on a keyboard.
 */
export function useDismissLayer(open: boolean, dismiss: () => void) {
  const latest = useRef(dismiss);
  useLayoutEffect(() => {
    latest.current = dismiss;
  });
  useEffect(() => {
    if (!open) return;
    return pushLayer(() => latest.current());
  }, [open]);
}

/**
 * Closes the most recently opened overlay and returns true, or returns false when none
 * is open. A sheet that is not dismissible still counts: the press is used up and it
 * stays open.
 */
export function dismissTopLayer(): boolean {
  const top = layers[layers.length - 1];
  if (!top) return false;
  top.dismiss();
  return true;
}
