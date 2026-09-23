import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { Sheet } from "./Sheet";
import { Alert } from "./Alert";

export interface ConfirmOptions {
  title: ReactNode;
  /** What actually happens, in plain terms. Say what is lost and whether it can be undone. */
  message?: ReactNode;
  /** Names the action, matching the button that opened it — "Delete chat", not "OK". */
  confirmLabel?: string;
  cancelLabel?: string;
  /** Paints the confirm button as destructive. */
  destructive?: boolean;
  /** An extra consequence the person should read before confirming. */
  warning?: { title: ReactNode; body: ReactNode };
}

interface ConfirmRequest {
  options: ConfirmOptions;
  resolve: (confirmed: boolean) => void;
}

let handler: ((request: ConfirmRequest) => void) | null = null;

/**
 * `await confirm({...})` from anywhere — no local open state, no dialog JSX at the
 * call site. Resolves false when nothing is mounted, so a missing host can never
 * silently confirm a destructive action.
 */
export function confirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    if (!handler) {
      if (import.meta.env?.DEV) console.warn("confirm() called with no <ConfirmHost /> mounted; resolving false.");
      resolve(false);
      return;
    }
    handler({ options, resolve });
  });
}

/** Mount once, at the app root, next to <Toaster />. */
export function ConfirmHost() {
  const [request, setRequest] = useState<ConfirmRequest | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    handler = (next) => {
      setRequest(next);
      setOpen(true);
    };
    return () => {
      handler = null;
    };
  }, []);

  const close = (confirmed: boolean) => {
    request?.resolve(confirmed);
    setOpen(false);
  };

  const options = request?.options;

  return (
    <Sheet
      open={open}
      /* Dismissing without choosing is a "no". */
      onClose={() => close(false)}
      size="sm"
      title={options?.title ?? "Are you sure?"}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => close(false)}>
            {options?.cancelLabel ?? "Cancel"}
          </Button>
          <Button variant={options?.destructive ? "danger" : "primary"} onClick={() => close(true)} data-autofocus>
            {options?.confirmLabel ?? "Confirm"}
          </Button>
        </div>
      }
    >
      <div className="space-y-3 pb-1">
        {options?.message && <p className="text-base leading-relaxed text-fg-2">{options.message}</p>}
        {options?.warning && (
          <Alert tone="warning" title={options.warning.title} description={options.warning.body} />
        )}
        {!options?.message && !options?.warning && (
          <p className="flex items-center gap-2 text-base text-fg-2">
            <AlertTriangle size={16} className="shrink-0 text-warning" />
            This can't be undone.
          </p>
        )}
      </div>
    </Sheet>
  );
}
