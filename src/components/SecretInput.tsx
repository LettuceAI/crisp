import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Check, ClipboardPaste, Eye, EyeOff, X } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { useFieldContext } from "./Field";
import { IconButton } from "./IconButton";
import { inputSurface } from "./Input";

export type SecretStatus = { state: "idle" } | { state: "checking" } | { state: "ok"; message?: ReactNode } | { state: "error"; message: ReactNode };

export interface SecretInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  /** What a check of the key came back with — drawn under the field. */
  status?: SecretStatus;
  /** Offer a paste button (reads the clipboard on tap). Default on. */
  paste?: boolean;
}

/**
 * An API key or password: masked by default with a reveal toggle, a paste button
 * where the clipboard is reachable, and room under it for what a connection test
 * said. One field for onboarding, providers and settings alike.
 */
export const SecretInput = forwardRef<HTMLInputElement, SecretInputProps>(function SecretInput(
  { value, onChange, status = { state: "idle" }, paste = true, className, id, disabled, ...rest },
  ref,
) {
  const field = useFieldContext();
  const [shown, setShown] = useState(false);
  const canPaste = paste && typeof navigator !== "undefined" && Boolean(navigator.clipboard?.readText);

  const pasteIn = async () => {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (text) onChange(text);
    } catch {
      /* Clipboard read refused: the field is still there to type into. */
    }
  };

  return (
    <div>
      <div className="relative">
        <input
          ref={ref}
          id={id ?? field?.id}
          type={shown ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
          aria-invalid={status.state === "error" || field?.invalid || undefined}
          className={cn(inputSurface, "control-md px-3.5 font-mono text-sm tracking-wide", canPaste ? "pr-20" : "pr-11", className)}
          {...rest}
        />
        <span className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {canPaste && !value && (
            <IconButton label="Paste" size="sm" disabled={disabled} onClick={pasteIn}><ClipboardPaste size={icon.sm} /></IconButton>
          )}
          {value && (
            <IconButton label="Clear" size="sm" disabled={disabled} onClick={() => onChange("")}><X size={icon.sm} /></IconButton>
          )}
          <IconButton label={shown ? "Hide" : "Show"} size="sm" active={shown} disabled={disabled} onClick={() => setShown((s) => !s)}>
            {shown ? <EyeOff size={icon.sm} /> : <Eye size={icon.sm} />}
          </IconButton>
        </span>
      </div>
      {status.state !== "idle" && (
        <p role="status" className={cn("mt-1.5 flex items-center gap-1.5 text-sm", status.state === "ok" ? "text-accent" : status.state === "error" ? "text-danger" : "text-fg-3")}>
          {status.state === "checking" && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
          {status.state === "ok" && <Check size={icon.sm} />}
          {status.state === "error" && <X size={icon.sm} />}
          {status.state === "checking" ? "Checking…" : status.state === "ok" ? (status.message ?? "Connected") : status.message}
        </p>
      )}
    </div>
  );
});
