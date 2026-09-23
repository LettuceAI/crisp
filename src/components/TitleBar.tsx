import type { ReactNode } from "react";
import { Minus, Square, X } from "lucide-react";
import { cn } from "../lib/cn";

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
        <div data-tauri-drag-region="false" className="flex shrink-0 items-center">
          {onMinimize && (
            <button type="button" onClick={onMinimize} aria-label="Minimize" className="flex h-9 w-11 items-center justify-center text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg">
              <Minus size={14} />
            </button>
          )}
          {onMaximize && (
            <button type="button" onClick={onMaximize} aria-label="Maximize" className="flex h-9 w-11 items-center justify-center text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg">
              <Square size={12} />
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Close window" className="flex h-9 w-11 items-center justify-center text-fg-3 transition-colors hover:bg-danger hover:text-fg">
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
