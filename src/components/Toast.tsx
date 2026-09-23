import type { ReactNode } from "react";
import { toast as sonner, Toaster as SonnerToaster } from "sonner";
import { AlertTriangle, CheckCircle2, Info, Loader2, X, XCircle } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Toasts are sonner underneath, rendered `unstyled` with our own body so they
 * follow the tokens and the four text tiers.
 *
 * The call signature matches the app's existing `toast.*` helpers, so call sites
 * migrate without edits. Tone naming follows the event (`error`), while Alert —
 * which paints a colour — follows the token (`danger`).
 */

export type ToastTone = "info" | "success" | "warning" | "error";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** Sits under the text, never beside it. */
  action?: ToastAction;
  secondary?: ToastAction;
  /** ms, or Infinity to keep it until dismissed. Default 5000. */
  duration?: number;
  /** Pass a stable id to update a toast in place instead of stacking a new one. */
  id?: string | number;
}

const toneIcon: Record<ToastTone, ReactNode> = {
  info: <Info size={16} className="text-info" />,
  success: <CheckCircle2 size={16} className="text-accent" />,
  warning: <AlertTriangle size={16} className="text-warning" />,
  error: <XCircle size={16} className="text-danger" />,
};

const toneBar: Record<ToastTone, string> = {
  info: "bg-info",
  success: "bg-accent",
  warning: "bg-warning",
  error: "bg-danger",
};

/* Neutral surface + a coloured bar, like Alert — a full-strength colour wash
   behind the whole toast makes the description hard to read. */
const shell =
  "pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-line bg-surface-2 py-3 pl-4 pr-3 shadow-raised";

function ToastBody({
  tone,
  title,
  description,
  action,
  secondary,
  onDismiss,
}: {
  tone: ToastTone;
  title: ReactNode;
  description?: ReactNode;
  action?: ToastAction;
  secondary?: ToastAction;
  onDismiss: () => void;
}) {
  const runAction = (handler: () => void) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handler();
    onDismiss();
  };

  return (
    <>
      <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-0.5", toneBar[tone])} />
      <span className="mt-0.5 shrink-0">{toneIcon[tone]}</span>
      <div className="min-w-0 flex-1">
        <p className="text-base font-medium text-fg">{title}</p>
        {description && <p className="mt-0.5 text-sm text-fg-2">{description}</p>}
        {(action || secondary) && (
          <div className="-ml-2 mt-1.5 flex flex-wrap items-center gap-1">
            {action && (
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={runAction(action.onClick)}
                className="touch-target inline-flex h-7 items-center rounded-lg px-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
              >
                {action.label}
              </button>
            )}
            {secondary && (
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={runAction(secondary.onClick)}
                className="touch-target inline-flex h-7 items-center rounded-lg px-2 text-sm font-medium text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg-2"
              >
                {secondary.label}
              </button>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => { event.stopPropagation(); onDismiss(); }}
        aria-label="Dismiss"
        className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg"
      >
        <X size={14} />
      </button>
    </>
  );
}

function show(tone: ToastTone, title: ReactNode, description?: ReactNode, options?: ToastOptions) {
  return sonner.custom(
    (id) => (
      <div className={shell}>
        <ToastBody
          tone={tone}
          title={title}
          description={description}
          action={options?.action}
          secondary={options?.secondary}
          onDismiss={() => sonner.dismiss(id)}
        />
      </div>
    ),
    { duration: options?.duration ?? 5000, id: options?.id },
  );
}

export interface ProgressToastOptions {
  id: string | number;
  title: ReactNode;
  description?: ReactNode;
  /** 0–1. Omit for an indeterminate spinner. */
  progress?: number;
  duration?: number;
}

/** Long-running work that reports progress — model downloads, indexing. */
function progressToast({ id, title, description, progress, duration }: ProgressToastOptions) {
  const percent = progress === undefined ? undefined : Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return sonner.custom(
    () => (
      <div className={cn(shell, "items-center")}>
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 bg-accent" />
        <Loader2 size={16} className="shrink-0 animate-spin text-fg-3" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-base font-medium text-fg">{title}</p>
            {percent !== undefined && <span className="shrink-0 text-sm tabular-nums text-fg-2">{percent}%</span>}
          </div>
          {description && <p className="mt-0.5 truncate text-sm text-fg-3">{description}</p>}
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="mt-2 h-1 w-full overflow-hidden rounded-full bg-fill-3"
          >
            <div
              className={cn("h-full rounded-full bg-accent", percent === undefined && "w-1/3 animate-[indeterminate_1.4s_ease-in-out_infinite]")}
              style={percent === undefined ? undefined : { width: `${percent}%`, transition: "width 300ms ease-out" }}
            />
          </div>
        </div>
      </div>
    ),
    { duration: duration ?? Infinity, id },
  );
}

export const toast = {
  info: (title: ReactNode, description?: ReactNode, options?: ToastOptions) => show("info", title, description, options),
  success: (title: ReactNode, description?: ReactNode, options?: ToastOptions) => show("success", title, description, options),
  warning: (title: ReactNode, description?: ReactNode, options?: ToastOptions) => show("warning", title, description, options),
  error: (title: ReactNode, description?: ReactNode, options?: ToastOptions) => show("error", title, description, options),
  progress: progressToast,
  dismiss: (id?: string | number) => sonner.dismiss(id),
  isVisible: (id: string | number) => sonner.getToasts().some((entry) => entry.id === id),
};

export interface ToasterProps {
  position?: "top-center" | "bottom-center" | "top-right" | "bottom-right";
  /** Extra bottom offset on phones — clear the TabBar. */
  bottomInset?: number;
}

/** Mount once, at the app root. */
export function Toaster({ position = "bottom-center", bottomInset = 0 }: ToasterProps = {}) {
  return (
    <SonnerToaster
      position={position}
      gap={8}
      visibleToasts={3}
      /* Sonner stacks by default and only expands on hover, which a phone never gets. */
      expand
      offset={{ bottom: `calc(env(safe-area-inset-bottom) + ${16 + bottomInset}px)`, top: 16, left: 16, right: 16 }}
      toastOptions={{ unstyled: true, classNames: { toast: "w-full" } }}
      style={{ ["--width" as string]: "384px" }}
    />
  );
}
