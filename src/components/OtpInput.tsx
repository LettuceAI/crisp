import {
  forwardRef, useCallback, useRef, type ClipboardEvent, type KeyboardEvent,
} from "react";
import { cn } from "../lib/cn";
import { useFieldContext } from "./Field";
import { useCrispStrings } from "../lib/strings";

export interface OtpInputProps {
  /** Total number of PIN digits/cells. Default 6. */
  length?: number;
  /** Current combined string value. */
  value: string;
  /** Callback fired whenever the value changes. */
  onChange: (value: string) => void;
  /** Callback fired when all digits have been entered. */
  onComplete?: (value: string) => void;
  /** Numeric (digits only) or alphanumeric. Default "number". */
  type?: "number" | "text";
  /** Mask characters like password dots. */
  mask?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  id?: string;
}

/**
 * Segmented PIN / OTP verification code input.
 * Supports auto-advancing focus, backspace navigation, and multi-digit paste splitting.
 */
export const OtpInput = forwardRef<HTMLDivElement, OtpInputProps>(function OtpInput(
  {
    length = 6,
    value = "",
    onChange,
    onComplete,
    type = "number",
    mask = false,
    disabled = false,
    autoFocus = false,
    className,
    id,
  },
  ref,
) {
  const { strings: t } = useCrispStrings();
  const field = useFieldContext();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const chars = Array.from({ length }, (_, i) => value[i] ?? "");

  const focusIndex = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(length - 1, idx));
    inputsRef.current[clamped]?.focus();
    inputsRef.current[clamped]?.select();
  }, [length]);

  const handleChange = (idx: number, char: string) => {
    if (disabled) return;
    const sanitized = type === "number" ? char.replace(/\D/g, "") : char;
    if (!sanitized && char !== "") return;

    const nextChars = [...chars];
    const latest = sanitized.slice(-1);
    nextChars[idx] = latest;
    const nextVal = nextChars.join("").slice(0, length);
    onChange(nextVal);

    if (latest && idx < length - 1) {
      focusIndex(idx + 1);
    }
    if (nextVal.length === length) {
      onComplete?.(nextVal);
    }
  };

  const handleKeyDown = (idx: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (!chars[idx] && idx > 0) {
        event.preventDefault();
        const nextChars = [...chars];
        nextChars[idx - 1] = "";
        const nextVal = nextChars.join("");
        onChange(nextVal);
        focusIndex(idx - 1);
      } else {
        const nextChars = [...chars];
        nextChars[idx] = "";
        onChange(nextChars.join(""));
      }
    } else if (event.key === "ArrowLeft" && idx > 0) {
      event.preventDefault();
      focusIndex(idx - 1);
    } else if (event.key === "ArrowRight" && idx < length - 1) {
      event.preventDefault();
      focusIndex(idx + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (disabled) return;
    const paste = event.clipboardData.getData("text/plain").trim();
    const sanitized = type === "number" ? paste.replace(/\D/g, "") : paste;
    if (!sanitized) return;

    const nextVal = sanitized.slice(0, length);
    onChange(nextVal);

    const nextFocus = Math.min(nextVal.length, length - 1);
    focusIndex(nextFocus);

    if (nextVal.length === length) {
      onComplete?.(nextVal);
    }
  };

  const invalid = field?.invalid;

  return (
    <div
      ref={ref}
      id={id ?? field?.id}
      aria-describedby={field?.describedBy}
      aria-invalid={invalid || undefined}
      className={cn("flex items-center gap-2", className)}
    >
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { inputsRef.current[idx] = el; }}
          type={mask ? "password" : type === "number" ? "tel" : "text"}
          inputMode={type === "number" ? "numeric" : "text"}
          pattern={type === "number" ? "[0-9]*" : undefined}
          autoComplete={idx === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && idx === 0}
          disabled={disabled}
          value={chars[idx]}
          maxLength={1}
          aria-label={t.otpDigit(idx + 1, length)}
          aria-invalid={invalid || undefined}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            "control-md w-10 sm:w-11 rounded-xl border border-line bg-fill text-center font-mono text-lg font-bold text-fg",
            "transition-[border-color,background-color] motion-instant",
            "hover:border-line-2 focus:border-accent focus:bg-fill-2 focus:outline-none focus:ring-1 focus:ring-accent/35",
            "disabled:cursor-not-allowed disabled:opacity-40",
            invalid && "border-danger/60 focus:border-danger focus:ring-danger/30",
          )}
        />
      ))}
    </div>
  );
});

OtpInput.displayName = "OtpInput";
