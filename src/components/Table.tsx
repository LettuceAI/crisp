import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "../lib/cn";
import { ScrollArea } from "./ScrollArea";

export interface Column<Row> {
  key: string;
  header: ReactNode;
  /** Cell renderer. Keep it a pure read of the row. */
  cell: (row: Row) => ReactNode;
  align?: "left" | "right";
  /** Numbers line up only if you say so. */
  numeric?: boolean;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<Row> {
  columns: readonly Column<Row>[];
  rows: readonly Row[];
  rowKey: (row: Row) => string;
  sort?: { key: string; direction: "asc" | "desc" };
  onSortChange?: (sort: { key: string; direction: "asc" | "desc" }) => void;
  onRowClick?: (row: Row) => void;
  /** Rendered in place of the body when there are no rows. */
  empty?: ReactNode;
  caption?: string;
  className?: string;
}

/**
 * A real table for tabular data — logs, usage, model lists — instead of a grid of divs.
 * It scrolls inside itself so a wide table never makes the page scroll sideways.
 */
export function Table<Row>({
  columns, rows, rowKey, sort, onSortChange, onRowClick, empty, caption, className,
}: TableProps<Row>) {
  const toggleSort = (key: string) => {
    if (!onSortChange) return;
    onSortChange({ key, direction: sort?.key === key && sort.direction === "asc" ? "desc" : "asc" });
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border border-line", className)}>
      <ScrollArea axis="x" bar>
        <table className="w-full border-collapse text-left">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-line bg-surface-1">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  style={column.width ? { width: column.width } : undefined}
                  aria-sort={sort?.key === column.key ? (sort.direction === "asc" ? "ascending" : "descending") : undefined}
                  className={cn("px-3 py-2 text-sm font-medium text-fg-3", column.align === "right" && "text-right")}
                >
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className={cn("inline-flex items-center gap-1 rounded-md transition-colors hover:text-fg", column.align === "right" && "flex-row-reverse")}
                    >
                      {column.header}
                      {sort?.key === column.key ? (
                        sort.direction === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      ) : (
                        <ArrowUpDown size={12} className="opacity-40" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-fg-3">
                  {empty ?? "Nothing to show"}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn("border-b border-line last:border-0", onRowClick && "cursor-pointer transition-colors hover:bg-fill")}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-3 py-2.5 text-base text-fg-2",
                        column.align === "right" && "text-right",
                        column.numeric && "tabular-nums",
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}
