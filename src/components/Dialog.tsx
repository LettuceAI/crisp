import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { useModal } from "../lib/useModal";
import { IconButton } from "./IconButton";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Hide the corner close button — for confirmations where the footer is the only way out. */
  dismissible?: boolean;
  className?: string;
  children?: ReactNode;
}

const sizeClass = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };

/** Centred modal. Confirmations, short forms, anything that should not feel like a page. */
export function Dialog({ open, onClose, title, description, footer, size = "md", dismissible = true, className, children }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  useModal(open, onClose, panelRef);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <motion.div
            key="overlay"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={m.quick}
            onClick={dismissible ? onClose : undefined}
          />
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            className={cn(
              "relative flex max-h-[85dvh] w-full flex-col overflow-hidden outline-none",
              "rounded-2xl border border-line bg-surface-2 shadow-raised",
              sizeClass[size],
              className,
            )}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={m.settle}
          >
            {(title || dismissible) && (
              <div className="flex items-start gap-3 px-5 pt-5">
                <div className="min-w-0 flex-1">
                  {title && (
                    <h2 id={titleId} className="text-lg font-semibold text-fg">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id={descriptionId} className="mt-1 text-sm text-fg-3">
                      {description}
                    </p>
                  )}
                </div>
                {dismissible && (
                  <IconButton label="Close" shape="round" variant="secondary" size="sm" onClick={onClose} className="-mr-1 -mt-1" data-modal-chrome>
                    <X size={14} />
                  </IconButton>
                )}
              </div>
            )}
            {children && <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>}
            {footer && <div className="flex justify-end gap-2 border-t border-line px-5 py-3">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
