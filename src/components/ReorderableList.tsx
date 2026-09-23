import { type KeyboardEvent, type ReactNode } from "react";
import { Reorder, useDragControls, useReducedMotion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { motion as m } from "../lib/motion";

export interface ReorderableListProps<T> {
  items: readonly T[];
  onReorder: (items: T[]) => void;
  keyOf: (item: T) => string;
  /** Draw one item. `handle` is the grab handle; put it where the row wants it. */
  children: (item: T, handle: ReactNode, index: number) => ReactNode;
  /** `y` (default) stacks; `x` lays the items in a row. */
  axis?: "x" | "y";
  /** Only the handle starts a drag. Off, the whole row does. Default on. */
  handleOnly?: boolean;
  "aria-label": string;
  className?: string;
  itemClassName?: string;
}

/**
 * A list whose order is the point: lorebook entries, starting scenes, widgets.
 * Drag by the handle (or the row), or focus the handle and press Alt+↑/↓. The item
 * being dragged lifts; the others slide out of its way.
 */
export function ReorderableList<T>({ items, onReorder, keyOf, children, axis = "y", handleOnly = true, className, itemClassName, ...aria }: ReorderableListProps<T>) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onReorder(next);
  };
  return (
    <Reorder.Group
      axis={axis}
      values={items as T[]}
      onReorder={onReorder}
      aria-label={aria["aria-label"]}
      className={cn("flex", axis === "y" ? "flex-col gap-2" : "flex-row gap-2", className)}
    >
      {items.map((item, index) => (
        <Item key={keyOf(item)} item={item} index={index} count={items.length} handleOnly={handleOnly} axis={axis} onMove={move} className={itemClassName}>
          {children}
        </Item>
      ))}
    </Reorder.Group>
  );
}

function Item<T>({
  item, index, count, handleOnly, axis, onMove, className, children,
}: {
  item: T;
  index: number;
  count: number;
  handleOnly: boolean;
  axis: "x" | "y";
  onMove: (from: number, to: number) => void;
  className?: string;
  children: (item: T, handle: ReactNode, index: number) => ReactNode;
}) {
  const controls = useDragControls();
  const reduced = useReducedMotion();
  const onKey = (e: KeyboardEvent) => {
    if (!e.altKey) return;
    const back = axis === "y" ? "ArrowUp" : "ArrowLeft";
    const fwd = axis === "y" ? "ArrowDown" : "ArrowRight";
    if (e.key === back) { e.preventDefault(); onMove(index, index - 1); }
    if (e.key === fwd) { e.preventDefault(); onMove(index, index + 1); }
  };
  const handle = (
    <button
      type="button"
      aria-label={`Reorder, item ${index + 1} of ${count}. Alt and arrow keys move it.`}
      onKeyDown={onKey}
      onPointerDown={(e) => controls.start(e)}
      className="tap-target flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-fg-4 hover:bg-fill-2 hover:text-fg-2 active:cursor-grabbing"
    >
      <GripVertical size={icon.md} />
    </button>
  );
  return (
    <Reorder.Item
      value={item}
      dragListener={!handleOnly}
      dragControls={controls}
      layout
      transition={reduced ? { duration: 0 } : m.settle}
      whileDrag={{ scale: 1.02, boxShadow: "var(--shadow-raised)", zIndex: 1 }}
      className={cn("relative rounded-2xl", className)}
    >
      {children(item, handle, index)}
    </Reorder.Item>
  );
}
