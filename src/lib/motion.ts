import type { Transition } from "framer-motion";

/**
 * Every animation in Crisp goes through one of these. Before this file there were
 * seven durations and six springs scattered inline — the same drift the app has with
 * fifteen icon sizes, just in milliseconds.
 *
 * Pick by what the motion is *for*, not by how long it should take.
 */

/** Something swapped in place: an icon, a tooltip, a popover, a context menu. */
export const instant: Transition = { duration: 0.12 };

/** Something appeared or resolved: a fade, a disclosure, a dialog. */
export const quick: Transition = { duration: 0.18 };

/** Something travelled: a progress bar, a large reveal. */
export const slow: Transition = { duration: 0.3 };

/** A small control snapping to a new position: a switch knob. */
export const snap: Transition = { type: "spring", stiffness: 700, damping: 40 };

/** A moving indicator settling: active tab, segmented control, stepper. */
export const settle: Transition = { type: "spring", stiffness: 500, damping: 40 };

/** A large surface arriving: sheets, panels, spotlight. */
export const surface: Transition = { type: "spring", stiffness: 420, damping: 42 };

/** Easing for height and layout changes, where a spring would overshoot. */
export const easeOut = [0.25, 1, 0.5, 1] as const;

/** Collapsing and expanding, which must not overshoot or the content clips. */
export const collapse: Transition = { duration: 0.2, ease: easeOut };

/*
 * Sheets. Written as how long they take to arrive and how far they overshoot, the way
 * the platform describes its own, rather than as stiffness and damping.
 *
 * In and out are different on purpose: a sheet that leaves as slowly as it arrived
 * makes you wait for something you have already dismissed.
 */
/** A sheet presenting from an edge. Covers the distance quickly, lands without a wobble. */
export const sheetIn: Transition = { type: "spring", visualDuration: 0.32, bounce: 0 };
/** A sheet dismissed. Faster than it came, and it never bounces on the way out. */
export const sheetOut: Transition = { type: "spring", visualDuration: 0.26, bounce: 0 };
/** A sheet let go short of closing. Returns from the speed it was thrown at, and stops
    at its resting place — an overshoot there would lift it off the edge. */
export const sheetSettle: Transition = { type: "spring", visualDuration: 0.3, bounce: 0 };

/** A side panel widening or folding back. No overshoot: the content beside it reflows
    with it, and a bounce would shake every line of text twice. */
export const sidebar: Transition = { type: "spring", visualDuration: 0.3, bounce: 0 };

/** A dragged card letting go and returning to rest. Stiff, so it snaps rather than drifts. */
export const rebound: Transition = { type: "spring", stiffness: 900, damping: 55, restDelta: 0.5 };

/** A looping ambient cycle — the typing indicator. Not a transition; it never resolves. */
export const pulse: Transition = { duration: 1.2, repeat: Infinity, ease: "easeInOut" };

export const motion = { instant, quick, slow, snap, settle, surface, sheetIn, sheetOut, sheetSettle, sidebar, rebound, collapse, pulse, easeOut } as const;
