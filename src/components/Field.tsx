import { createContext, useContext, useId, type ReactNode } from "react";
import { cn } from "../lib/cn";

interface FieldContextValue {
  id: string;
  describedBy?: string;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Inputs call this to pick up id / aria wiring from the surrounding Field. */
export function useFieldContext() {
  return useContext(FieldContext);
}

export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Label and control on one row — for switches and compact selects. */
  inline?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, required, inline, className, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  const labelNode = label && (
    <label htmlFor={id} className="block text-sm font-medium text-fg-2">
      {label}
      {required && (
        <span className="ml-0.5 text-danger" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );

  const helpNode = error ? (
    <p id={errorId} role="alert" className="text-sm text-danger">
      {error}
    </p>
  ) : hint ? (
    <p id={hintId} className="text-sm text-fg-3">
      {hint}
    </p>
  ) : null;

  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error) }}>
      {inline ? (
        <div className={cn("flex items-center justify-between gap-4", className)}>
          <div className="min-w-0 space-y-0.5">
            {labelNode}
            {helpNode}
          </div>
          <div className="shrink-0">{children}</div>
        </div>
      ) : (
        <div className={cn("space-y-1.5", className)}>
          {labelNode}
          {children}
          {helpNode}
        </div>
      )}
    </FieldContext.Provider>
  );
}
