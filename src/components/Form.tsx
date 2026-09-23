import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type FormEvent, type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { confirm } from "./confirm";
import { Button } from "./Button";

interface FormContextValue<T> {
  values: T;
  initial: T;
  dirty: boolean;
  submitting: boolean;
  errors: Partial<Record<keyof T, string>>;
  set: <K extends keyof T>(key: K, value: T[K]) => void;
  patch: (values: Partial<T>) => void;
  reset: () => void;
}

const FormContext = createContext<FormContextValue<Record<string, unknown>> | null>(null);

export function useForm<T extends Record<string, unknown>>() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useForm must be used inside <Form>");
  return ctx as unknown as FormContextValue<T>;
}

export interface FormProps<T extends Record<string, unknown>> {
  initial: T;
  onSubmit: (values: T) => void | Promise<void>;
  /** Return a message per invalid field. Runs on submit. */
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  /** Warn before the tab closes while there are unsaved edits. */
  guardUnload?: boolean;
  children: ReactNode | ((form: FormContextValue<T>) => ReactNode);
  className?: string;
}

/**
 * Owns a form's values, dirty state and validation, so pages stop tracking them by
 * hand — the app's editors run to thousands of lines each and the top bar carries a
 * `wasUnsavedRef` of its own.
 */
export function Form<T extends Record<string, unknown>>({
  initial, onSubmit, validate, guardUnload = true, children, className,
}: FormProps<T>) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const initialRef = useRef(initial);

  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialRef.current),
    [values],
  );

  useEffect(() => {
    if (!guardUnload || !dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [guardUnload, dirty]);

  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  }, []);

  const patch = useCallback((next: Partial<T>) => setValues((current) => ({ ...current, ...next })), []);

  const reset = useCallback(() => {
    setValues(initialRef.current);
    setErrors({});
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const found: Partial<Record<keyof T, string>> = validate?.(values) ?? {};
    const invalid = Object.values(found).some(Boolean);
    setErrors(found);
    if (invalid) {
      /* Move to the problem rather than leaving the person to hunt for it. */
      const first = Object.keys(found).find((key) => Boolean(found[key as keyof T]));
      if (first) document.querySelector<HTMLElement>(`[name="${first}"], #${CSS.escape(first)}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(values);
      initialRef.current = values;
      setValues(values);
    } finally {
      setSubmitting(false);
    }
  };

  const ctx: FormContextValue<T> = { values, initial: initialRef.current, dirty, submitting, errors, set, patch, reset };

  return (
    <FormContext.Provider value={ctx as unknown as FormContextValue<Record<string, unknown>>}>
      <form onSubmit={submit} noValidate className={cn("space-y-5", className)}>
        {typeof children === "function" ? children(ctx) : children}
      </form>
    </FormContext.Provider>
  );
}

export interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  /** Keep the bar visible at the bottom of a long form. */
  sticky?: boolean;
  children?: ReactNode;
}

/** Save / cancel, disabled until something actually changed. */
export function FormActions({ submitLabel = "Save changes", cancelLabel = "Cancel", onCancel, sticky, children }: FormActionsProps) {
  const { dirty, submitting, reset } = useForm();
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t border-line pt-4",
        sticky && "sticky bottom-0 -mx-4 mt-0 bg-surface/90 px-4 pb-[calc(var(--safe-bottom)+12px)] backdrop-blur-md",
      )}
    >
      {dirty && <span className="text-sm text-fg-3">Unsaved changes</span>}
      <span className="flex-1" />
      {children}
      <Button type="button" variant="ghost" disabled={!dirty || submitting} onClick={() => { reset(); onCancel?.(); }}>
        {cancelLabel}
      </Button>
      <Button type="submit" variant="primary" disabled={!dirty} loading={submitting}>
        {submitLabel}
      </Button>
    </div>
  );
}

/**
 * Ask before leaving a dirty form. Wire it to your router's navigation guard:
 * `const leave = useUnsavedGuard(dirty); if (await leave()) navigate(to);`
 */
export function useUnsavedGuard(dirty: boolean) {
  return useCallback(async () => {
    if (!dirty) return true;
    return confirm({
      title: "Discard your changes?",
      message: "You've edited this since you last saved.",
      confirmLabel: "Discard",
      cancelLabel: "Keep editing",
      destructive: true,
    });
  }, [dirty]);
}
