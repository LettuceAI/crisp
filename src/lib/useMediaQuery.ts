import { useSyncExternalStore } from "react";
import { useFrame } from "./frame";

/** Subscribes to a media query. SSR-safe: returns `false` on the server. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return () => {};
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => (typeof window === "undefined" ? false : window.matchMedia(query).matches),
    () => false,
  );
}

/**
 * "Is this a touch-first, phone-sized viewport?"
 * Width alone is wrong (a small desktop window still has a mouse) and pointer alone
 * is wrong (a Surface has both), so we ask for narrow OR coarse.
 */
export function useCompactLayout() {
  const narrow = useMediaQuery("(max-width: 767px)");
  const coarse = useMediaQuery("(pointer: coarse)");
  const { compact } = useFrame();
  /* Inside a device frame the device decides, not the monitor it is shown on. */
  if (compact !== undefined) return compact;
  return narrow || coarse;
}
