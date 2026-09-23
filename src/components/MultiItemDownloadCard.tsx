import { useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, Check, ChevronDown, Download, Pause, Play, X } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { DownloadItem, type DownloadStatus } from "./DownloadItem";
import { IconButton } from "./IconButton";
import { Progress } from "./Progress";
import { Spinner } from "./Spinner";

export interface DownloadGroupItem {
  id: string;
  name: string;
  detail?: ReactNode;
  status: DownloadStatus;
  /** 0–1. */
  progress?: number;
  /** Bytes. Needed for an honest overall percentage. */
  size?: number;
  speed?: number;
  eta?: number;
  error?: string;
}

export interface MultiItemDownloadCardProps {
  title: string;
  detail?: ReactNode;
  items: readonly DownloadGroupItem[];
  onPauseAll?: () => void;
  onResumeAll?: () => void;
  onCancelAll?: () => void;
  onItemPause?: (id: string) => void;
  onItemResume?: (id: string) => void;
  onItemCancel?: (id: string) => void;
  onItemRetry?: (id: string) => void;
  defaultExpanded?: boolean;
  className?: string;
}

function bytes(n?: number) {
  if (n === undefined) return "";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = n <= 0 ? 0 : Math.min(units.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  const value = n / 1024 ** i;
  return `${value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}

function duration(seconds?: number) {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds <= 0) return "";
  if (seconds < 60) return `${Math.round(seconds)}s left`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min left`;
  return `${(seconds / 3600).toFixed(1)} h left`;
}

/**
 * One download made of several files — a model with its shards, tokenizer and config;
 * a voice pack; an image-generation bundle. The parts are what actually transfer, but
 * the bundle is what a person chose, so the card reports the bundle and keeps the parts
 * a disclosure away.
 *
 * The overall figure is weighted by file size, not a mean of percentages: a 16 GB shard
 * at 10% and a 2 KB config at 100% is not "55% done".
 */
export function MultiItemDownloadCard({
  title, detail, items, onPauseAll, onResumeAll, onCancelAll,
  onItemPause, onItemResume, onItemCancel, onItemRetry, defaultExpanded = false, className,
}: MultiItemDownloadCardProps) {
  const [open, setOpen] = useState(defaultExpanded);

  const summary = useMemo(() => {
    const failed = items.filter((i) => i.status === "failed");
    const done = items.filter((i) => i.status === "done");
    const active = items.filter((i) => i.status === "downloading");
    const paused = items.filter((i) => i.status === "paused");
    const verifying = items.filter((i) => i.status === "verifying");

    const status: DownloadStatus =
      failed.length ? "failed"
      : done.length === items.length ? "done"
      : active.length ? "downloading"
      : verifying.length ? "verifying"
      : paused.length && paused.length + done.length === items.length ? "paused"
      : "queued";

    const knownSizes = items.every((i) => i.size !== undefined);
    const total = items.reduce((sum, i) => sum + (i.size ?? 0), 0);
    const transferred = items.reduce(
      (sum, i) => sum + (i.status === "done" ? (i.size ?? 0) : (i.progress ?? 0) * (i.size ?? 0)),
      0,
    );
    /* Without sizes, a mean of percentages is the best available — and it is only fair
       because we then don't claim a byte count either. */
    const progress = knownSizes && total > 0
      ? transferred / total
      : items.reduce((sum, i) => sum + (i.status === "done" ? 1 : i.progress ?? 0), 0) / Math.max(1, items.length);

    const speed = active.reduce((sum, i) => sum + (i.speed ?? 0), 0);
    const eta = speed > 0 && knownSizes ? (total - transferred) / speed : undefined;

    return { status, progress, total, transferred, speed, eta, knownSizes, doneCount: done.length, failedCount: failed.length };
  }, [items]);

  const pct = Math.round(summary.progress * 100);
  const isDone = summary.status === "done";
  const isFailed = summary.status === "failed";

  const line = isFailed
    ? `${summary.failedCount} of ${items.length} failed`
    : isDone
      ? `${items.length} files · ${summary.knownSizes ? bytes(summary.total) : ""}`.trim()
      : [
          `${summary.doneCount} of ${items.length} files`,
          summary.knownSizes ? `${bytes(summary.transferred)} of ${bytes(summary.total)}` : undefined,
          summary.speed ? `${bytes(summary.speed)}/s` : undefined,
          duration(summary.eta),
        ].filter(Boolean).join(" · ");

  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-surface-1", className)}>
      <div className="flex items-center gap-3 p-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
            isDone ? "border-accent/30 bg-accent/12 text-accent"
              : isFailed ? "border-danger/30 bg-danger/12 text-danger"
              : "border-line bg-fill-2 text-fg-3",
          )}
        >
          {isDone ? <Check size={18} /> : isFailed ? <AlertTriangle size={18} /> : summary.status === "verifying" ? <Spinner size="md" /> : <Download size={18} />}
        </span>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="min-w-0 truncate text-base font-medium text-fg">{title}</p>
            {!isDone && !isFailed && <span className="shrink-0 text-sm tabular-nums text-fg-2">{pct}%</span>}
          </div>
          {detail && <p className="truncate text-sm text-fg-3">{detail}</p>}
          {!isDone && !isFailed && (
            <Progress value={summary.status === "queued" ? undefined : pct} size="sm" />
          )}
          <p className={cn("truncate text-sm tabular-nums", isFailed ? "text-danger" : "text-fg-3")}>{line}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {summary.status === "downloading" && onPauseAll && (
            <IconButton label={`Pause ${title}`} size="sm" onClick={onPauseAll}><Pause size={16} /></IconButton>
          )}
          {summary.status === "paused" && onResumeAll && (
            <IconButton label={`Resume ${title}`} size="sm" onClick={onResumeAll}><Play size={16} /></IconButton>
          )}
          {!isDone && onCancelAll && (
            <IconButton label={`Cancel ${title}`} size="sm" onClick={onCancelAll}><X size={16} /></IconButton>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-1.5 border-t border-line px-3 py-2 text-sm text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg-2"
      >
        <ChevronDown size={14} className={cn("shrink-0 transition-transform motion-quick", open && "rotate-180")} />
        {open ? "Hide files" : `Show ${items.length} files`}
        {summary.failedCount > 0 && (
          <span className="ml-auto shrink-0 rounded-md bg-danger/12 px-1.5 py-0.5 text-2xs font-medium text-danger">
            {summary.failedCount} failed
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={m.collapse}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 border-t border-line bg-surface/40 p-2">
              {items.map((item) => (
                <DownloadItem
                  key={item.id}
                  name={item.name}
                  detail={item.detail}
                  status={item.status}
                  progress={item.progress}
                  size={item.size}
                  speed={item.speed}
                  eta={item.eta}
                  error={item.error}
                  onPause={onItemPause ? () => onItemPause(item.id) : undefined}
                  onResume={onItemResume ? () => onItemResume(item.id) : undefined}
                  onCancel={onItemCancel ? () => onItemCancel(item.id) : undefined}
                  onRetry={onItemRetry ? () => onItemRetry(item.id) : undefined}
                  className="border-line/60 bg-fill/60"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
