import { createContext, useContext, type ReactNode } from "react";

interface FrameValue {
  /** Where overlays portal to. `null` is the document body — the real app. */
  portal: HTMLElement | null;
  /** Force the phone or desktop layout for this subtree, whatever the viewport says. */
  compact?: boolean;
}

const FrameContext = createContext<FrameValue>({ portal: null });

/**
 * Runs a piece of the app inside a device frame on the lab page: overlays open inside
 * the frame instead of at the bottom of the browser window, and layout decisions follow
 * the device being simulated rather than the monitor it is being viewed on.
 *
 * The element passed as `portal` must establish a containing block for fixed-position
 * descendants (a `transform` does it), or sheets will still pin to the viewport.
 *
 * The real app never mounts this. Every hook falls back to the document and the
 * viewport, so components written against it behave identically outside a frame.
 */
export function FrameProvider({ portal, compact, children }: FrameValue & { children: ReactNode }) {
  return <FrameContext.Provider value={{ portal, compact }}>{children}</FrameContext.Provider>;
}

export function useFrame() {
  return useContext(FrameContext);
}

/** The node overlays should portal into. */
export function usePortalTarget(): HTMLElement | null {
  const { portal } = useContext(FrameContext);
  if (portal) return portal;
  return typeof document === "undefined" ? null : document.body;
}
