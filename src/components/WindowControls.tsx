import { cn } from "../lib/cn";

const HANDLES = [
  { dir: "North", className: "left-2 right-2 top-0 h-1 cursor-n-resize" },
  { dir: "South", className: "left-2 right-2 bottom-0 h-1 cursor-s-resize" },
  { dir: "West", className: "top-2 bottom-2 left-0 w-1 cursor-w-resize" },
  { dir: "East", className: "top-2 bottom-2 right-0 w-1 cursor-e-resize" },
  { dir: "NorthWest", className: "left-0 top-0 h-2.5 w-2.5 cursor-nw-resize" },
  { dir: "NorthEast", className: "right-0 top-0 h-2.5 w-2.5 cursor-ne-resize" },
  { dir: "SouthWest", className: "bottom-0 left-0 h-2.5 w-2.5 cursor-sw-resize" },
  { dir: "SouthEast", className: "bottom-0 right-0 h-2.5 w-2.5 cursor-se-resize" },
] as const;

export type ResizeDirection = (typeof HANDLES)[number]["dir"];

export interface WindowResizeHandlesProps {
  /** Start a native window resize — wire to Tauri's `startResizeDragging(dir)`. */
  onResizeStart: (direction: ResizeDirection) => void;
  /** Hidden when the window can't be resized: maximised, full screen, or native chrome. */
  disabled?: boolean;
}

/**
 * Invisible grab strips around a frameless desktop window. macOS keeps its own chrome,
 * so this is for Windows and Linux when the app draws its own title bar.
 */
export function WindowResizeHandles({ onResizeStart, disabled }: WindowResizeHandlesProps) {
  if (disabled) return null;
  return (
    <>
      {HANDLES.map(({ dir, className }) => (
        <div
          key={dir}
          aria-hidden="true"
          data-tauri-drag-region="false"
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            onResizeStart(dir);
          }}
          className={cn("fixed z-[101] select-none", className)}
        />
      ))}
    </>
  );
}
