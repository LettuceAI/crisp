import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Right-aligned slot — a count, a badge, a menu. */
  trailing?: ReactNode;
  children?: readonly TreeNode[];
}

export interface TreeProps {
  nodes: readonly TreeNode[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  defaultExpanded?: readonly string[];
  className?: string;
}

/**
 * A nested list you can collapse — the chat tree, lorebook entries by category,
 * a file bundle. Rows are buttons, so the whole tree is keyboard-operable.
 */
export function Tree({ nodes, selectedId, onSelect, defaultExpanded = [], className }: TreeProps) {
  const [expanded, setExpanded] = useState(() => new Set(defaultExpanded));
  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const render = (list: readonly TreeNode[], depth: number): ReactNode =>
    list.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const open = expanded.has(node.id);
      return (
        <li key={node.id} role="none">
          <div
            role="treeitem"
            aria-expanded={hasChildren ? open : undefined}
            aria-selected={selectedId === node.id}
            className={cn(
              "group flex items-center gap-1 rounded-lg pr-1.5 transition-colors",
              selectedId === node.id ? "bg-fill-2 text-fg" : "text-fg-2 hover:bg-fill",
            )}
            style={{ paddingLeft: depth * 14 }}
          >
            <button
              type="button"
              onClick={() => hasChildren && toggle(node.id)}
              aria-label={hasChildren ? (open ? "Collapse" : "Expand") : undefined}
              tabIndex={hasChildren ? 0 : -1}
              className={cn("touch-target flex h-7 w-5 shrink-0 items-center justify-center text-fg-3", !hasChildren && "invisible")}
            >
              <ChevronRight size={14} className={cn("transition-transform motion-instant", open && "rotate-90")} />
            </button>
            <button
              type="button"
              onClick={() => onSelect?.(node.id)}
              className="flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left text-base"
            >
              {node.icon && <span className="shrink-0 text-fg-3">{node.icon}</span>}
              <span className="min-w-0 truncate">{node.label}</span>
            </button>
            {node.trailing && <span className="shrink-0">{node.trailing}</span>}
          </div>
          {hasChildren && open && (
            <ul role="group" className="list-none">
              {render(node.children!, depth + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul role="tree" className={cn("list-none space-y-px", className)}>
      {render(nodes, 0)}
    </ul>
  );
}
