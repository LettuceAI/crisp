import {
  cloneElement, createContext, useCallback, useContext, useEffect, useId, useLayoutEffect,
  useRef, useState, type ReactElement, type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";

export type PopoverSide = "top" | "bottom" | "left" | "right";
export type PopoverAlign = "start" | "center" | "end";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("Popover parts must be used inside <Popover>");
  return ctx;
}

export interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/**
 * An anchored floating panel, portalled to the body so it is never clipped by an
 * ancestor's overflow — which is why the app's own pickers live inside their scroll
 * containers and get cut off. Combobox, DatePicker, ColorPicker and HoverCard build on it.
 */
export function Popover({ open: openProp, onOpenChange, children }: PopoverProps) {
  const [uncontrolled, setUncontrolled] = useState(false);
  const open = openProp ?? uncontrolled;
  const anchorRef = useRef<HTMLElement | null>(null);
  const id = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  return <PopoverContext.Provider value={{ open, setOpen, id, anchorRef }}>{children}</PopoverContext.Provider>;
}

export function PopoverTrigger({ children }: { children: ReactElement<Record<string, unknown>> }) {
  const { open, setOpen, id, anchorRef } = usePopover();
  const child = children.props as { onClick?: (e: unknown) => void };
  return cloneElement(children, {
    ref: anchorRef,
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-controls": open ? id : undefined,
    onClick: (event: unknown) => {
      child.onClick?.(event);
      setOpen(!open);
    },
  });
}

/**
 * The element the panel points at, when opening it is not that element's job — a
 * hover card, or anything that opens on its own. Same anchoring, no click handler.
 */
export function PopoverAnchor({ children }: { children: ReactElement<Record<string, unknown>> }) {
  const { anchorRef } = usePopover();
  return cloneElement(children, { ref: anchorRef });
}

/** Anchors to the trigger and flips to the other side when it would leave the viewport. */
export function usePopoverPosition(
  anchorRef: React.MutableRefObject<HTMLElement | null>,
  panelRef: React.RefObject<HTMLElement | null>,
  { open, side, align, offset }: { open: boolean; side: PopoverSide; align: PopoverAlign; offset: number },
) {
  const [style, setStyle] = useState<{ top: number; left: number; minWidth?: number }>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const anchor = anchorRef.current?.getBoundingClientRect();
      const panel = panelRef.current?.getBoundingClientRect();
      if (!anchor || !panel) return;
      const margin = 8;
      let resolved = side;

      if (side === "bottom" && anchor.bottom + offset + panel.height > window.innerHeight - margin) resolved = "top";
      if (side === "top" && anchor.top - offset - panel.height < margin) resolved = "bottom";

      let top = 0;
      let left = 0;
      if (resolved === "bottom" || resolved === "top") {
        top = resolved === "bottom" ? anchor.bottom + offset : anchor.top - offset - panel.height;
        left = align === "start" ? anchor.left : align === "end" ? anchor.right - panel.width : anchor.left + anchor.width / 2 - panel.width / 2;
      } else {
        left = resolved === "right" ? anchor.right + offset : anchor.left - offset - panel.width;
        top = align === "start" ? anchor.top : align === "end" ? anchor.bottom - panel.height : anchor.top + anchor.height / 2 - panel.height / 2;
      }

      setStyle({
        top: Math.max(margin, Math.min(top, window.innerHeight - panel.height - margin)),
        left: Math.max(margin, Math.min(left, window.innerWidth - panel.width - margin)),
        minWidth: anchor.width,
      });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, side, align, offset, anchorRef, panelRef]);

  return style;
}

export interface PopoverContentProps {
  side?: PopoverSide;
  align?: PopoverAlign;
  offset?: number;
  /** Stretch to the trigger's width — what a select-style dropdown wants. */
  matchWidth?: boolean;
  className?: string;
  children: ReactNode;
}

export function PopoverContent({ side = "bottom", align = "start", offset = 6, matchWidth, className, children }: PopoverContentProps) {
  const { open, setOpen, id, anchorRef } = usePopover();
  const panelRef = useRef<HTMLDivElement>(null);
  const position = usePopoverPosition(anchorRef, panelRef, { open, side, align, offset });

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        anchorRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen, anchorRef]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id={id}
          role="dialog"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={m.instant}
          style={{ top: position.top, left: position.left, ...(matchWidth ? { minWidth: position.minWidth } : undefined) }}
          className={cn("fixed z-[70] rounded-xl border border-line bg-surface-2 p-1 shadow-raised", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
