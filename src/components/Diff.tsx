import { useMemo } from "react";
import { cn } from "../lib/cn";

type Op = "same" | "add" | "remove";
interface Line { op: Op; text: string; a?: number; b?: number }

/** Longest common subsequence, line-wise. Enough for settings and character fields. */
function diffLines(before: string, after: string): Line[] {
  const A = before.split("\n");
  const B = after.split("\n");
  const table: number[][] = Array.from({ length: A.length + 1 }, () => new Array(B.length + 1).fill(0));
  for (let i = A.length - 1; i >= 0; i--) {
    for (let j = B.length - 1; j >= 0; j--) {
      table[i][j] = A[i] === B[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const out: Line[] = [];
  let i = 0;
  let j = 0;
  while (i < A.length && j < B.length) {
    if (A[i] === B[j]) out.push({ op: "same", text: A[i], a: i + 1, b: ++j && i + 1 }), i++;
    else if (table[i + 1][j] >= table[i][j + 1]) out.push({ op: "remove", text: A[i], a: ++i });
    else out.push({ op: "add", text: B[j], b: ++j });
  }
  while (i < A.length) out.push({ op: "remove", text: A[i], a: ++i });
  while (j < B.length) out.push({ op: "add", text: B[j], b: ++j });
  return out;
}

export interface DiffProps {
  before: string;
  after: string;
  /** Labels for the two sides. */
  beforeLabel?: string;
  afterLabel?: string;
  /** `unified` stacks the changes; `split` shows both sides. Split needs room. */
  view?: "unified" | "split";
  /** Collapse runs of unchanged lines longer than this. 0 shows everything. */
  context?: number;
  className?: string;
}

const opClass: Record<Op, string> = {
  same: "text-fg-3",
  add: "bg-accent/10 text-fg",
  remove: "bg-danger/10 text-fg",
};

/**
 * What changed between two versions. The sync conflict inbox asks people to choose a
 * side without showing them what differs; this is the missing half.
 */
export function Diff({ before, after, beforeLabel = "Theirs", afterLabel = "Yours", view = "unified", context = 3, className }: DiffProps) {
  const lines = useMemo(() => diffLines(before, after), [before, after]);

  const visible = useMemo(() => {
    if (!context) return lines.map((line) => ({ line, elided: 0 }));
    const keep = new Set<number>();
    lines.forEach((line, index) => {
      if (line.op === "same") return;
      for (let k = index - context; k <= index + context; k++) if (k >= 0 && k < lines.length) keep.add(k);
    });
    const out: { line: Line | null; elided: number }[] = [];
    let run = 0;
    lines.forEach((line, index) => {
      if (keep.has(index)) {
        if (run) { out.push({ line: null, elided: run }); run = 0; }
        out.push({ line, elided: 0 });
      } else run++;
    });
    if (run) out.push({ line: null, elided: run });
    return out;
  }, [lines, context]);

  const added = lines.filter((l) => l.op === "add").length;
  const removed = lines.filter((l) => l.op === "remove").length;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-line", className)}>
      <div className="flex items-center gap-3 border-b border-line bg-fill px-3 py-1.5">
        <span className="min-w-0 flex-1 truncate text-sm text-fg-3">
          {view === "split" ? `${beforeLabel} → ${afterLabel}` : "Changes"}
        </span>
        <span className="shrink-0 text-2xs tabular-nums text-accent">+{added}</span>
        <span className="shrink-0 text-2xs tabular-nums text-danger">−{removed}</span>
      </div>

      {view === "split" ? (
        <div className="grid grid-cols-2 divide-x divide-line">
          {(["remove", "add"] as const).map((side) => (
            <div key={side} className="scrollbar-thin overflow-x-auto">
              <p className="border-b border-line px-3 py-1 text-2xs font-medium text-fg-3">
                {side === "remove" ? beforeLabel : afterLabel}
              </p>
              {lines.map((line, index) =>
                line.op === "same" || line.op === side ? (
                  <p key={index} className={cn("whitespace-pre px-3 py-0.5 font-mono text-xs", line.op === "same" ? "text-fg-3" : opClass[line.op])}>
                    {line.text || " "}
                  </p>
                ) : (
                  <p key={index} aria-hidden="true" className="px-3 py-0.5 font-mono text-xs opacity-0">·</p>
                ),
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="scrollbar-thin overflow-x-auto py-1">
          {visible.map((row, index) =>
            row.line ? (
              <p key={index} className={cn("flex gap-3 whitespace-pre px-3 py-0.5 font-mono text-xs", opClass[row.line.op])}>
                <span aria-hidden="true" className="w-3 shrink-0 select-none text-fg-4">
                  {row.line.op === "add" ? "+" : row.line.op === "remove" ? "−" : " "}
                </span>
                {row.line.text || " "}
              </p>
            ) : (
              <p key={index} className="px-3 py-1 text-2xs text-fg-3">⋯ {row.elided} unchanged {row.elided === 1 ? "line" : "lines"}</p>
            ),
          )}
        </div>
      )}
    </div>
  );
}
