import type { ReactNode } from "react";
import { Minus, Square, X } from "lucide-react";
import { cn } from "../lib/cn";
import { useCrispStrings } from "../lib/strings";

const control = "flex h-7 w-9 items-center justify-center rounded-lg text-fg-3 transition-colors motion-instant hover:bg-fill-2 hover:text-fg active:bg-fill-3 focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-fg-2";

export interface TitleBarProps {
  title?: ReactNode;
  /** macOS puts the traffic lights on the left and we leave room; Windows/Linux draw ours on the right. */
  platform?: "macos" | "windows" | "linux";
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  /** Slot in the drag region — a back button, a status chip. */
  children?: ReactNode;
  className?: string;
}

/**
 * Desktop window chrome. The whole bar is a drag region except the buttons,
 * which opt out with `data-tauri-drag-region="false"`.
 */
export function TitleBar({ title, platform = "linux", onMinimize, onMaximize, onClose, children, className }: TitleBarProps) {
  const { strings: t } = useCrispStrings();
  const mac = platform === "macos";
  return (
    <div
      data-tauri-drag-region
      className={cn(
        "flex h-9 shrink-0 select-none items-center gap-2 border-b border-line bg-nav px-2 text-fg",
        mac && "pl-20", // room for the system traffic lights
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      {title && <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-2xs font-medium text-fg-3">{title}</span>}
      {!mac && (onMinimize || onMaximize || onClose) && (
        <div data-tauri-drag-region="false" className="flex shrink-0 items-center gap-0.5 pr-1.5">
          {onMinimize && (
            <button type="button" onClick={onMinimize} aria-label={t.titleBarMinimize} className={control}>
              <Minus size={14} />
            </button>
          )}
          {onMaximize && (
            <button type="button" onClick={onMaximize} aria-label={t.titleBarMaximize} className={control}>
              <Square size={12} />
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} aria-label={t.titleBarClose} className={cn(control, "hover:bg-danger active:bg-danger/80")}>
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
