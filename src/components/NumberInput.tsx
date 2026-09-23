import { useRef, type KeyboardEvent } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../lib/cn";
import { useFieldContext } from "./Field";
import { inputSurface } from "./Input";

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Decimal places to display. Inferred from `step` when omitted. */
  precision?: number;
  /** Shown after the number — "tokens", "×", "s". */
  suffix?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * A number field with real steppers. Arrow keys step, Shift+Arrow steps by ten,
 * and the value is clamped on commit rather than silently accepting nonsense.
 */
export function NumberInput({
  value, onChange, min = -Infinity, max = Infinity, step = 1, precision, suffix, disabled, id, className,
}: NumberInputProps) {
  const field = useFieldContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const decimals = precision ?? (String(step).split(".")[1]?.length ?? 0);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const commit = (n: number) => {
    if (Number.isNaN(n)) return;
    onChange(Number(clamp(n).toFixed(decimals)));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const delta = event.key === "ArrowUp" ? 1 : event.key === "ArrowDown" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    commit(value + delta * step * (event.shiftKey ? 10 : 1));
  };

  return (
    <div className={cn(inputSurface, "control-md flex items-center gap-1 px-1", disabled && "opacity-40", className)}>
      <button
        type="button"
        onClick={() => commit(value - step)}
        disabled={disabled || value <= min}
        aria-label="Decrease"
        className="touch-target flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
      >
        <Minus size={16} />
      </button>
      <input
        ref={inputRef}
        id={id ?? field?.id}
        type="text"
        inputMode="decimal"
        value={value.toFixed(decimals)}
        disabled={disabled}
        aria-describedby={field?.describedBy}
        onChange={(event) => commit(Number(event.target.value.replace(",", ".")))}
        onKeyDown={onKeyDown}
        className="min-w-0 flex-1 bg-transparent text-center text-base tabular-nums text-fg outline-none"
      />
      {suffix && <span className="shrink-0 pr-1 text-sm text-fg-3">{suffix}</span>}
      <button
        type="button"
        onClick={() => commit(value + step)}
        disabled={disabled || value >= max}
        aria-label="Increase"
        className="touch-target flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
