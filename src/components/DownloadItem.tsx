import type { ReactNode } from "react";
import { AlertTriangle, Check, Download, Pause, Play, X } from "lucide-react";
import { cn } from "../lib/cn";
import { IconButton } from "./IconButton";
import { Progress } from "./Progress";
import { Spinner } from "./Spinner";
import { fileSize } from "../lib/format";
import { useCrispStrings, type CrispStrings } from "../lib/strings";

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

function duration(t: CrispStrings, locale: string, seconds?: number) {
  if (seconds === undefined || !Number.isFinite(seconds)) return "";
  if (seconds < 60) return t.downloadLeftSeconds(Math.round(seconds));
  if (seconds < 3600) return t.downloadLeftMinutes(Math.round(seconds / 60));
  const hours = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(seconds / 3600);
  return t.downloadLeftHours(hours);
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
  const { strings: t, locale } = useCrispStrings();
  const bytes = (n?: number) => (n === undefined ? "" : fileSize(n, locale));
  const pct = progress === undefined ? undefined : Math.round(progress * 100);
  const done = status === "done";
  const failed = status === "failed";

  const line =
    failed ? error ?? t.downloadFailed
    : done ? bytes(size)
    : status === "queued" ? t.downloadWaiting
    : status === "verifying" ? t.downloadVerifying
    : status === "paused" ? `${t.downloadPaused}${size ? ` · ${t.downloadProgress(bytes((progress ?? 0) * size), bytes(size))}` : ""}`
    : [
        size ? t.downloadProgress(bytes((progress ?? 0) * size), bytes(size)) : undefined,
        speed ? t.downloadSpeed(bytes(speed)) : undefined,
        duration(t, locale, eta),
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
          <IconButton label={t.downloadPause(name)} size="sm" onClick={onPause}><Pause size={16} /></IconButton>
        )}
        {status === "paused" && onResume && (
          <IconButton label={t.downloadResume(name)} size="sm" onClick={onResume}><Play size={16} /></IconButton>
        )}
        {failed && onRetry && (
          <IconButton label={t.downloadRetry(name)} size="sm" onClick={onRetry}><Download size={16} /></IconButton>
        )}
        {!done && onCancel && (
          <IconButton label={t.downloadCancel(name)} size="sm" onClick={onCancel}><X size={16} /></IconButton>
        )}
      </div>
    </div>
  );
}
