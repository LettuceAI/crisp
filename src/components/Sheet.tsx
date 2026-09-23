import { useEffect, useId, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  animate, AnimatePresence, motion, useMotionValue, usePresence, useReducedMotion, useTransform,
  type AnimationPlaybackControls, type Transition,
} from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { useModal } from "../lib/useModal";
import { useCompactLayout } from "../lib/useMediaQuery";
import { useFrame, usePortalTarget } from "../lib/frame";
import { IconButton } from "./IconButton";

export type SheetPlacement = "auto" | "bottom" | "side" | "center";

/** Fractions of the viewport the bottom sheet rests at. Ascending. */
export type SheetDetent = number;

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Slot left of the title — a back button when a sheet pushes another. */
  leftAction?: ReactNode;
  /** Slot right of the title, before the close button. */
  rightAction?: ReactNode;
  /**
   * Show the × in the header. Off by default on the bottom menu — the handle, a drag
   * down, a tap on the scrim and Escape all close it, and a fourth way costs the header
   * its room. On by default for side and centre panels, which have no handle. When it
   * is off the button is still there for a keyboard or a screen reader, and appears the
   * moment it takes focus.
   */
  closeButton?: boolean;
  footer?: ReactNode;
  /**
   * `bottom` (default) everywhere — the bottom menu is the app's signature surface and
   * stays that way on desktop too. `auto` opts into a right-side panel on desktop,
   * `side` and `center` force one. Only reach for those when a specific screen earns it.
   */
  placement?: SheetPlacement;
  size?: "sm" | "md" | "lg";
  /**
   * Resting heights for the bottom variant, as fractions of the viewport.
   * Drag between them; dragging below the first one closes.
   *
   * Left off, the sheet is as tall as its content and no taller — which is what a
   * bottom menu wants. Pass detents only for a sheet that browses something and so
   * needs a deliberate resting height.
   */
  detents?: readonly SheetDetent[];
  /** Start at this detent index. Default 0. */
  defaultDetent?: number;
  className?: string;
  children: ReactNode;
}

const sideWidth = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-xl" };
const centerWidth = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };
const bottomWidth = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl" };

/** Where the sheet waits before its first frame: far enough below any screen. */
const OFFSCREEN = 4000;
/** Movement before a press becomes a drag — below it, a tap is still a tap. */
const SLOP = 4;

/**
 * Holds its subtree on screen after its owner has let go, until `onExit` settles. The
 * bottom sheet leaves by animating the same value it arrives and is dragged by, so the
 * scrim fades with it — an exit prop would animate the drawn position and leave the
 * scrim behind.
 */
function Leaving({ onExit, children }: { onExit: () => Promise<unknown>; children: ReactNode }) {
  const [present, safeToRemove] = usePresence();
  const stillPresent = useRef(present);
  stillPresent.current = present;
  useEffect(() => {
    if (present) return;
    /* Reopened before it finished leaving: the exit was interrupted, so it must not
       remove the sheet that is now coming back. */
    void onExit().then(() => {
      if (!stillPresent.current) safeToRemove?.();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [present]);
  return <>{children}</>;
}

interface DragState {
  pointerId: number;
  startY: number;
  fromBody: boolean;
  active: boolean;
  /** Where the finger actually is, which the sheet does not follow above its rest. */
  dy: number;
  samples: { t: number; y: number }[];
}

export function Sheet({
  open,
  onClose,
  title,
  description,
  leftAction,
  rightAction,
  closeButton,
  footer,
  placement = "bottom",
  size = "md",
  detents,
  defaultDetent = 0,
  className,
  children,
}: SheetProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const compact = useCompactLayout();
  const reduced = useReducedMotion();
  const [detent, setDetent] = useState(defaultDetent);
  const portalTarget = usePortalTarget();
  /* Inside a device frame, heights resolve against the frame — `dvh` would measure the
     monitor the lab is open on, not the phone being simulated. */
  const framed = Boolean(useFrame().portal);
  const unit = framed ? "%" : "dvh";

  useModal(open, onClose, panelRef, { lockScroll: !framed });
  useEffect(() => {
    if (open) setDetent(defaultDetent);
  }, [open, defaultDetent]);

  const resolved: Exclude<SheetPlacement, "auto"> =
    placement === "auto" ? (compact ? "bottom" : "side") : placement;
  const bottom = resolved === "bottom";

  /* No detents means the sheet hugs its content, capped so it can never swallow the
     screen. A six-row menu is six rows tall. */
  const steps = detents?.length ? detents : null;
  const height = steps ? `${Math.round(steps[Math.min(detent, steps.length - 1)] * 100)}${unit}` : undefined;

  /* ── the bottom sheet's motion ──────────────────────────────────────────────
     One number drives everything: `y`, how far the sheet is below where it rests.
     The finger writes it directly while dragging, springs take over on release with
     the speed the finger left behind, and the scrim is derived from it — so it dims
     and clears with the sheet, whether it is animating or being held. Nothing here
     re-renders React while it moves. */
  const y = useMotionValue(0);
  const sheetHeight = useRef(0);
  const running = useRef<AnimationPlaybackControls | null>(null);
  const closing = useRef(false);
  const drag = useRef<DragState | null>(null);
  const [bodyScrolls, setBodyScrolls] = useState(false);
  /* What is drawn is clamped at the rest position: even a spring released with the
     finger still travelling upward can cross its target once, and that one frame would
     be the sheet leaving the edge. */
  const shownY = useTransform(y, (value) => Math.max(0, value));
  const scrim = useTransform(y, (value) => {
    const h = sheetHeight.current;
    return h ? 1 - Math.min(1, Math.max(0, value / h)) : 0;
  });

  const run = (to: number, transition: Transition, velocity = 0) => {
    running.current?.stop();
    running.current = animate(y, to, reduced ? { duration: 0 } : { ...transition, velocity });
    return running.current;
  };

  /* Park the sheet out of sight before its first frame. Written during render because
     the first paint reads the value synchronously; in an effect it would already have
     flashed fully open for a frame. */
  const wasOpen = useRef(false);
  if (bottom && open && !wasOpen.current) {
    closing.current = false;
    y.jump(OFFSCREEN);
  }
  wasOpen.current = open;

  useLayoutEffect(() => {
    if (!open || !bottom) return;
    const panel = panelRef.current;
    if (!panel) return;
    sheetHeight.current = panel.offsetHeight;
    y.jump(sheetHeight.current);
    run(0, m.sheetIn);

    /* Content can change while the sheet is up — keep the height the scrim and the
       dismissal measure against current, and know whether the body scrolls. */
    const observer = new ResizeObserver(() => {
      sheetHeight.current = panel.offsetHeight;
      const body = bodyRef.current;
      setBodyScrolls(Boolean(body && body.scrollHeight > body.clientHeight + 1));
    });
    observer.observe(panel);
    if (bodyRef.current) observer.observe(bodyRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, bottom]);

  const dismiss = (velocity: number) => {
    closing.current = true;
    /* Finish the throw ourselves, then tell the owner. Handing over mid-flight would
       lose the finger's speed at the seam and the sheet would visibly stall. */
    void run(sheetHeight.current, m.sheetOut, Math.max(0, velocity)).finished.then(() => {
      if (closing.current) onClose();
    });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>, fromBody: boolean) => {
    if (!bottom || event.button !== 0 || closing.current) return;
    /* A press in a text field is selecting text, and one on a slider is moving it —
       neither is a request to move the sheet. `data-no-drag` opts anything else out. */
    if (fromBody && (event.target as HTMLElement).closest("input, textarea, select, [contenteditable='true'], [data-no-drag]")) return;
    drag.current = { pointerId: event.pointerId, startY: event.clientY, fromBody, active: false, dy: 0, samples: [{ t: event.timeStamp, y: event.clientY }] };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== event.pointerId) return;
    const dy = event.clientY - d.startY;

    if (!d.active) {
      if (Math.abs(dy) < SLOP) return;
      /* From the content, a drag belongs to the sheet only while there is nothing to
         scroll back to — otherwise it is the list's. */
      const body = bodyRef.current;
      if (d.fromBody && bodyScrolls && (dy < 0 || (body?.scrollTop ?? 0) > 0)) {
        drag.current = null;
        return;
      }
      d.active = true;
      running.current?.stop();
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    /* Down follows the finger one to one. Up goes nowhere: the sheet is anchored to
       the bottom edge and never rises above where it rests. */
    d.dy = dy;
    y.set(Math.max(0, dy));
    d.samples.push({ t: event.timeStamp, y: event.clientY });
    /* Only the last moment of the gesture counts: a throw is judged by how it ends, not
       by the slow start that preceded it. */
    while (d.samples.length > 2 && event.timeStamp - d.samples[0].t > 60) d.samples.shift();
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.active || d.pointerId !== event.pointerId) return;

    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const dt = Math.max(1, last.t - first.t);
    const velocity = ((last.y - first.y) / dt) * 1000;
    const offset = y.get();
    const h = sheetHeight.current || 1;

    /* A light flick is enough to dismiss — half a screen a second — or a quarter of
       the sheet's height at any speed. Anything less goes back. */
    const flungDown = velocity > 500;
    const flungUp = velocity < -500;
    const farDown = offset > Math.min(h * 0.25, 160);

    if (steps && (flungUp || d.dy < -40) && detent < steps.length - 1) {
      setDetent((i) => Math.min(i + 1, steps.length - 1));
      run(0, m.sheetSettle, velocity);
      return;
    }
    if ((flungDown || farDown) && velocity > -200) {
      if (steps && detent > 0) {
        setDetent((i) => Math.max(i - 1, 0));
        run(0, m.sheetSettle, velocity);
      } else {
        dismiss(velocity);
      }
      return;
    }
    run(0, m.sheetSettle, velocity);
  };

  const dragHandlers = (fromBody: boolean) =>
    bottom
      ? {
          onPointerDown: (event: ReactPointerEvent<HTMLElement>) => onPointerDown(event, fromBody),
          onPointerMove,
          onPointerUp,
          onPointerCancel: onPointerUp,
        }
      : {};

  const showClose = closeButton ?? !bottom;
  const shared = "flex flex-col overflow-hidden border-line bg-surface-2 outline-none";

  const header = (
    <div className={cn("shrink-0", bottom && "cursor-grab touch-none select-none active:cursor-grabbing")} {...dragHandlers(false)}>
      {bottom && (
        <div className="flex justify-center pb-1 pt-2.5">
          <span className="h-1 w-9 rounded-full bg-line-3" aria-hidden="true" />
        </div>
      )}
      <div className={cn("flex items-start gap-2 px-4", bottom ? "pb-3 pt-1.5" : "py-4")}>
        {leftAction && <div className="shrink-0 pt-0.5">{leftAction}</div>}
        <div className="min-w-0 flex-1">
          {title && (
            <h2 id={titleId} className="truncate text-lg font-semibold text-fg">
              {title}
            </h2>
          )}
          {description && (
            <p id={descriptionId} className="mt-0.5 text-sm text-fg-3">
              {description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {rightAction}
          <IconButton
            label="Close"
            shape="round"
            variant="secondary"
            size="sm"
            onClick={onClose}
            data-modal-chrome
            className={cn(!showClose && "sr-only focus-visible:not-sr-only")}
          >
            <X size={14} />
          </IconButton>
        </div>
      </div>
      <div className="h-px bg-line" />
    </div>
  );

  const body = (
    <div
      ref={bodyRef}
      {...dragHandlers(true)}
      className={cn(
        "scrollbar-thin min-h-0 overflow-y-auto overscroll-contain px-5 py-4",
        steps ? "flex-1" : "shrink",
        /* A body with nothing to scroll is part of the handle: the whole sheet can be
           taken hold of, as on the platform. One that scrolls keeps its pan. Text
           fields keep theirs either way, so a long draft can still be scrolled. */
        bottom && !bodyScrolls && "touch-none [&_input]:touch-auto [&_textarea]:touch-auto",
      )}
    >
      {children}
    </div>
  );

  const dialogProps = {
    role: "dialog" as const,
    "aria-modal": true as const,
    "aria-labelledby": title ? titleId : undefined,
    "aria-describedby": description ? descriptionId : undefined,
    tabIndex: -1,
  };

  let content: ReactNode = null;
  if (open && bottom) {
    content = (
      <Leaving key="bottom" onExit={() => run(sheetHeight.current, m.sheetOut).finished}>
      <div className="fixed inset-0 z-50">
        {/* No backdrop blur: blurring the whole page under a moving scrim is the most
            expensive frame a webview can be asked for, and the platform only dims. */}
        <motion.div className="absolute inset-0 bg-black/50" style={{ opacity: scrim }} onClick={onClose} />
        <motion.div
          ref={panelRef}
          {...dialogProps}
          style={{
            y: shownY,
            height,
            /* A skirt of the sheet's own colour below its bottom edge — insurance, so
               no frame of any animation can ever open a gap under it. */
            boxShadow: "var(--shadow-sheet), 0 120px 0 0 var(--color-surface-2)",
            transition: steps ? "height 0.4s cubic-bezier(0.32, 0.72, 0, 1)" : undefined,
          }}
          className={cn(
            shared,
            "absolute inset-x-0 bottom-0 mx-auto w-full rounded-t-2xl border border-b-0 will-change-transform",
            "pb-[var(--safe-bottom)]",
            !steps && (framed ? "max-h-[85%]" : "max-h-[85dvh]"),
            bottomWidth[size],
            className,
          )}
        >
          {header}
          {body}
          {footer && <div className="shrink-0 border-t border-line px-5 py-3">{footer}</div>}
        </motion.div>
      </div>
      </Leaving>
    );
  } else if (open) {
    const side = resolved === "side";
    const panel = (
      <motion.div
        ref={panelRef}
        {...dialogProps}
        initial={side ? { x: "100%" } : { opacity: 0, scale: 0.97, y: 10 }}
        animate={side ? { x: 0 } : { opacity: 1, scale: 1, y: 0 }}
        exit={side ? { x: "100%", transition: m.sheetOut } : { opacity: 0, scale: 0.97, y: 10, transition: m.instant }}
        transition={side ? m.sheetIn : m.settle}
        className={cn(
          shared,
          side
            ? cn("fixed inset-y-0 right-0 z-50 w-full border-l shadow-sheet pb-[var(--safe-bottom)]", sideWidth[size])
            : cn("relative z-50 w-full rounded-2xl border shadow-raised", framed ? "max-h-[85%]" : "max-h-[85dvh]", centerWidth[size]),
          className,
        )}
      >
        {header}
        {body}
        {footer && <div className="shrink-0 border-t border-line px-5 py-3">{footer}</div>}
      </motion.div>
    );
    content = (
      <motion.div key={resolved} className="fixed inset-0 z-50">
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={m.quick}
          onClick={onClose}
        />
        {side ? panel : <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 [&>*]:pointer-events-auto">{panel}</div>}
      </motion.div>
    );
  }

  if (!portalTarget) return null;
  return createPortal(<AnimatePresence>{content}</AnimatePresence>, portalTarget);
}

/**
 * The team's name for this surface. Same component — `BottomMenu` reads better at
 * call sites that are, and always will be, a bottom menu.
 */
export const BottomMenu = Sheet;
export type BottomMenuProps = SheetProps;
