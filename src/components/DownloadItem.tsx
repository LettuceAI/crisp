import type { ReactNode } from "react";
import { AlertTriangle, Check, Download, Pause, Play, X } from "lucide-react";
import { cn } from "../lib/cn";
import { IconButton } from "./IconButton";
import { Progress } from "./Progress";
import { Spinner } from "./Spinner";

export type DownloadStatus = "queued" | "downloading" | "paused" | "verifying" | "done" | "failed";

export interface DownloadItemProps {
  name: string;
  /** Under the name — the repo, the quantisation, the format. */
  detail?: ReactNode;
  status: DownloadStatus;
  /** 0–1. Omit while queued or verifying. */
  progress?: number;
  /** Bytes per second. */
  speed?: number;
  /** Seconds remaining. */
  eta?: number;
  /** Total bytes, for the "x of y" line. */
  size?: number;
  error?: string;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
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
  if (seconds === undefined || !Number.isFinite(seconds)) return "";
  if (seconds < 60) return `${Math.round(seconds)}s left`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min left`;
  return `${(seconds / 3600).toFixed(1)} h left`;
}

/**
 * One download, with everything a person needs to decide whether to wait: how far
 * along, how fast, how long left, and how to stop. The app has four different
 * download UIs and none of them shows all four.
 */
export function DownloadItem({
  name, detail, status, progress, speed, eta, size, error,
  onPause, onResume, onCancel, onRetry, className,
}: DownloadItemProps) {
  const pct = progress === undefined ? undefined : Math.round(progress * 100);
  const done = status === "done";
  const failed = status === "failed";

  const line =
    failed ? error ?? "Download failed"
    : done ? bytes(size)
    : status === "queued" ? "Waiting…"
    : status === "verifying" ? "Verifying…"
    : status === "paused" ? `Paused${size ? ` · ${bytes((progress ?? 0) * size)} of ${bytes(size)}` : ""}`
    : [
        size ? `${bytes((progress ?? 0) * size)} of ${bytes(size)}` : undefined,
        speed ? `${bytes(speed)}/s` : undefined,
        duration(eta),
      ].filter(Boolean).join(" · ");

  return (
    <div className={cn("flex items-center gap-3 rounded-xl border border-line bg-surface-1 p-3", className)}>
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
          done ? "border-accent/30 bg-accent/12 text-accent"
            : failed ? "border-danger/30 bg-danger/12 text-danger"
            : "border-line bg-fill-2 text-fg-3",
        )}
      >
        {done ? <Check size={18} /> : failed ? <AlertTriangle size={18} /> : status === "verifying" ? <Spinner size="md" /> : <Download size={18} />}
      </span>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="min-w-0 truncate text-base font-medium text-fg">{name}</p>
          {pct !== undefined && !done && !failed && (
            <span className="shrink-0 text-sm tabular-nums text-fg-2">{pct}%</span>
          )}
        </div>
        {detail && <p className="truncate text-sm text-fg-3">{detail}</p>}
        {!done && !failed && (
          <Progress value={status === "queued" || status === "verifying" ? undefined : pct} size="sm" />
        )}
        <p className={cn("truncate text-sm tabular-nums", failed ? "text-danger" : "text-fg-3")}>{line}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {status === "downloading" && onPause && (
          <IconButton label={`Pause ${name}`} size="sm" onClick={onPause}><Pause size={16} /></IconButton>
        )}
        {status === "paused" && onResume && (
          <IconButton label={`Resume ${name}`} size="sm" onClick={onResume}><Play size={16} /></IconButton>
        )}
        {failed && onRetry && (
          <IconButton label={`Retry ${name}`} size="sm" onClick={onRetry}><Download size={16} /></IconButton>
        )}
        {!done && onCancel && (
          <IconButton label={`Cancel ${name}`} size="sm" onClick={onCancel}><X size={16} /></IconButton>
        )}
      </div>
    </div>
  );
}
