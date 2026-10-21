import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ConnectedTreeNode {
  id: string;
  title: ReactNode;
  /** The line under the title: counts, a date, where it came from. */
  description?: ReactNode;
  /** Leading mark. One per node, `icon.md`. */
  icon?: ReactNode;
  /** Beside the title: a state word such as "Current". */
  badge?: ReactNode;
  /** Outside the node's button, right-aligned: a menu trigger. */
  trailing?: ReactNode;
  /** Marks where the reader is; gives the node a stronger fill. */
  current?: boolean;
  disabled?: boolean;
  /** Makes the node a button. Without it the node is plain text. */
  onSelect?: () => void;
  /** Replaces the node's card, for an inline editor. The lines still attach to it. */
  content?: ReactNode;
  children?: readonly ConnectedTreeNode[];
}

export interface ConnectedTreeProps {
  nodes: readonly ConnectedTreeNode[];
  "aria-label"?: string;
  className?: string;
}

function NodeCard({ node }: { node: ConnectedTreeNode }) {
  const body = (
    <>
      {node.icon && <span className="mt-1 shrink-0 text-fg-3">{node.icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-base font-medium text-fg">{node.title}</span>
          {node.badge}
        </span>
        {node.description && <span className="block truncate text-sm text-fg-3">{node.description}</span>}
      </span>
    </>
  );
  return (
    <div className={cn("flex items-center rounded-xl border", node.current ? "border-line-3 bg-fill-2" : "border-line bg-surface-1")}>
      {node.onSelect ? (
        <button
          type="button"
          disabled={node.disabled}
          aria-current={node.current ? "true" : undefined}
          onClick={node.onSelect}
          className="touch-target flex min-w-0 flex-1 items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors motion-instant hover:bg-fill-2 disabled:pointer-events-none disabled:opacity-40"
        >
          {body}
        </button>
      ) : (
        <div aria-current={node.current ? "true" : undefined} className="flex min-w-0 flex-1 items-start gap-3 px-3 py-2.5">
          {body}
        </div>
      )}
      {node.trailing}
    </div>
  );
}

function Level({ nodes, nested, label }: { nodes: readonly ConnectedTreeNode[]; nested: boolean; label?: string | undefined }) {
  return (
    <ul aria-label={label} className={cn("list-none space-y-2", nested && "mt-2 pl-6")}>
      {nodes.map((node, index) => (
        <li
          key={node.id}
          className={cn(
            nested &&
              "relative before:absolute before:-left-3 before:-top-2 before:w-px before:bg-line after:absolute after:-left-3 after:top-5.5 after:h-px after:w-3 after:bg-line",
            nested && (index === nodes.length - 1 ? "before:h-7.5" : "before:-bottom-2"),
          )}
        >
          {node.content ?? <NodeCard node={node} />}
          {node.children && node.children.length > 0 && <Level nodes={node.children} nested />}
        </li>
      ))}
    </ul>
  );
}

/**
 * Nodes joined to their parent by lines: the chats a chat was branched from, the versions
 * of a document, forks of a project. Every node stays visible and reads as a card, so the
 * shape of the history shows at a glance.
 *
 * Reach for `Tree` instead when the content is a long, collapsible hierarchy such as files,
 * and for `Timeline` when the events happen in a single sequence.
 */
export function ConnectedTree({ nodes, className, "aria-label": label }: ConnectedTreeProps) {
  return (
    <div className={className}>
      <Level nodes={nodes} nested={false} label={label} />
    </div>
  );
}
