import { useEffect, type RefObject } from "react";

const FOCUSABLE = 'input, textarea, select, [data-autofocus], a[href], button:not([data-modal-chrome])';

/**
 * Shared modal behaviour for Sheet and Dialog: Escape closes, body scroll locks,
 * focus moves inside on open and returns to the opener on close.
 */
export function useModal(
  open: boolean,
  onClose: () => void,
  panelRef: RefObject<HTMLElement | null>,
  { lockScroll = true }: { lockScroll?: boolean } = {},
) {
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    if (lockScroll) document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panelRef.current) {
        const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE + ", [data-modal-chrome]")).filter(
          (node) => !node.hasAttribute("disabled"),
        );
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    /* Focus the panel, not the first control. Landing on a control paints a focus ring
       on a row nobody chose — and a bottom menu is usually opened by a thumb, so that
       ring is pure noise. Tab still walks into the content from here. A sheet that
       genuinely wants a cursor in a field marks that field `data-autofocus`. */
    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      /* preventScroll: the panel starts below the edge it slides in from. Focusing it
         normally makes the browser scroll its container to reveal it — overflow:hidden
         does not stop programmatic scrolling — and the whole screen jumps up underneath
         the sheet while it animates. */
      (panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel)?.focus({ preventScroll: true });
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      if (lockScroll) document.body.style.overflow = previousOverflow;
      opener?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, panelRef, lockScroll]);
}
