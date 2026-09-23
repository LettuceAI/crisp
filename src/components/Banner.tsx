import type { ReactNode } from "react";
import { AlertTriangle, Info, WifiOff, X, XCircle } from "lucide-react";
import { cn } from "../lib/cn";

export type BannerTone = "info" | "warning" | "danger" | "offline";

export interface BannerProps {
  tone?: BannerTone;
  children: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  /** Stick to the top of the scroll container. */
  sticky?: boolean;
  className?: string;
}

const toneClass: Record<BannerTone, string> = {
  info: "bg-info/15 text-info",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  offline: "bg-fill-3 text-fg-2",
};

const toneIcon: Record<BannerTone, ReactNode> = {
  info: <Info size={16} />,
  warning: <AlertTriangle size={16} />,
  danger: <XCircle size={16} />,
  offline: <WifiOff size={16} />,
};

/**
 * A full-width notice about the whole app or page — you're offline, a migration is
 * running, an update is ready. Alert is about one thing on the page; a Banner is about
 * the page. One line only: if it needs a paragraph, it's an Alert.
 */
export function Banner({ tone = "info", children, action, onDismiss, sticky, className }: BannerProps) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "flex items-center gap-2.5 px-4 py-2 text-sm",
        toneClass[tone],
        sticky && "sticky top-0 z-30",
        className,
      )}
    >
      <span className="shrink-0">{toneIcon[tone]}</span>
      <span className="min-w-0 flex-1 truncate font-medium">{children}</span>
      {action && <span className="shrink-0">{action}</span>}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-mr-1 shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
