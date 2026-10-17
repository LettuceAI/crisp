import { forwardRef, useCallback, useLayoutEffect, useRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { textareaHeight } from "../lib/textarea";
import { useFieldContext } from "./Field";

export const inputSurface = cn(
  "w-full rounded-xl border border-line bg-fill text-base text-fg placeholder:text-fg-4",
  "transition-[border-color,background-color] motion-instant",
  "hover:border-line-2 focus:border-accent focus:bg-fill-2 focus:outline-none focus:ring-1 focus:ring-accent/35",
  "disabled:cursor-not-allowed disabled:opacity-40",
  "aria-invalid:border-danger/60 aria-invalid:focus:border-danger",
);

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leading, trailing, className, id, ...rest },
  ref,
) {
  const field = useFieldContext();
  const control = (
    <input
      ref={ref}
      id={id ?? field?.id}
      aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
      aria-invalid={rest["aria-invalid"] ?? (field?.invalid || undefined)}
      className={cn(inputSurface, "control-md px-3.5", leading && "pl-10", trailing && "pr-10", className)}
      {...rest}
    />
  );
  if (!leading && !trailing) return control;
  return (
    <div className="relative">
      {leading && (
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-fg-3">{leading}</span>
      )}
      {control}
      {trailing && <span className="absolute inset-y-0 right-2 flex items-center">{trailing}</span>}
    </div>
  );
});

Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Grow with the text instead of scrolling inside a fixed box. `rows` is the minimum. */
  autoGrow?: boolean;
  /** With `autoGrow`, stop growing here and scroll. Default 12. */
  maxRows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, id, rows = 4, autoGrow, maxRows = 12, onChange, ...rest },
  ref,
) {
  const field = useFieldContext();
  const inner = useRef<HTMLTextAreaElement | null>(null);

  const fit = useCallback(() => {
    const el = inner.current;
    if (!el || !autoGrow) return;
    const line = parseFloat(getComputedStyle(el).lineHeight) || 24;
    const pad = el.offsetHeight - el.clientHeight + (parseFloat(getComputedStyle(el).paddingTop) + parseFloat(getComputedStyle(el).paddingBottom));
    el.style.height = "0px";
    const fitted = textareaHeight({ content: el.scrollHeight, line, pad, rows, maxRows });
    el.style.height = `${fitted.height}px`;
    el.style.overflowY = fitted.scrolls ? "auto" : "hidden";
  }, [autoGrow, rows, maxRows]);

  /* Fit on mount and whenever the value is set from outside. */
  useLayoutEffect(fit, [fit, rest.value]);

  return (
    <textarea
      ref={(el) => {
        inner.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      id={id ?? field?.id}
      rows={rows}
      onChange={(e) => { onChange?.(e); fit(); }}
      aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
      aria-invalid={rest["aria-invalid"] ?? (field?.invalid || undefined)}
      className={cn(inputSurface, "resize-none px-3.5 py-2.5 leading-relaxed", className)}
      {...rest}
    />
  );
});

Textarea.displayName = "Textarea";
