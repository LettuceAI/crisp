import { useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, Info, X, XCircle } from "lucide-react";
import { cn } from "../lib/cn";
import { Badge } from "./Badge";

export type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertProps {
  tone?: AlertTone;
  title: ReactNode;
  description?: ReactNode;
  /** Small tag next to the title — an HTTP status, a model name. */
  meta?: ReactNode;
  /** Collapsed by default; raw payloads, stack traces. */
  details?: string;
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const tone = {
  info: { icon: Info, iconClass: "text-info", bar: "bg-info" },
  success: { icon: CheckCircle2, iconClass: "text-accent", bar: "bg-accent" },
  warning: { icon: AlertTriangle, iconClass: "text-warning", bar: "bg-warning" },
  danger: { icon: XCircle, iconClass: "text-danger", bar: "bg-danger" },
};

/**
 * Inline notice. Explains what happened and what to do next, in the interface's voice.
 * Replaces the chat error banner; same information, one type scale.
 */
export function Alert({ tone: toneKey = "info", title, description, meta, details, action, onDismiss, className }: AlertProps) {
  const [open, setOpen] = useState(false);
  const { icon: Icon, iconClass, bar } = tone[toneKey];
  return (
    <div role={toneKey === "danger" || toneKey === "warning" ? "alert" : "status"} className={cn("relative overflow-hidden rounded-xl border border-line bg-fill", className)}>
      <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-0.5", bar)} />
      <div className="flex items-start gap-3 py-3 pl-4 pr-3">
        <Icon size={18} className={cn("mt-0.5 shrink-0", iconClass)} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-base font-medium text-fg">{title}</p>
            {meta && <Badge className="h-5 px-1.5">{meta}</Badge>}
          </div>
          {description && <p className="mt-1 text-sm text-fg-2">{description}</p>}
          {(details || action) && (
            /* -ml-3 cancels the button padding so actions align with the text above. */
            <div className="-ml-3 mt-1 flex flex-wrap items-center gap-1">
              {action}
              {details && (
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg-2"
                >
                  <ChevronDown size={14} className={cn("transition-transform motion-quick", open && "rotate-180")} />
                  {open ? "Hide details" : "Show details"}
                </button>
              )}
            </div>
          )}
          {details && open && (
            <pre className="scrollbar-thin mt-1.5 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-line bg-surface px-3 py-2 text-xs leading-relaxed text-fg-3">{details}</pre>
          )}
        </div>
        {onDismiss && (
          <button type="button" onClick={onDismiss} aria-label="Dismiss" className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-fg-3 hover:bg-fill-2 hover:text-fg">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
