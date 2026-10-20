import { useRef, useState, type KeyboardEvent } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../lib/cn";
import { useFieldContext } from "./Field";
import { inputSurface } from "./Input";
import { useCrispStrings } from "../lib/strings";

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
 * typing keeps the text as typed (only an in-range number reaches onChange) and the
 * value is clamped on blur or Enter, so a half-typed number never snaps to the minimum.
 */
export function NumberInput({
  value, onChange, min = -Infinity, max = Infinity, step = 1, precision, suffix, disabled, id, className,
}: NumberInputProps) {
  const { strings: t } = useCrispStrings();
  const field = useFieldContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const decimals = precision ?? (String(step).split(".")[1]?.length ?? 0);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const commit = (n: number) => {
    if (Number.isNaN(n)) return;
    onChange(Number(clamp(n).toFixed(decimals)));
  };

  const parse = (text: string) => Number(text.replace(",", "."));
  const type = (text: string) => {
    setDraft(text);
    const n = parse(text);
    if (text.trim() !== "" && !Number.isNaN(n) && n >= min && n <= max) onChange(Number(n.toFixed(decimals)));
  };
  const settle = () => {
    if (draft === null) return;
    const n = parse(draft);
    setDraft(null);
    if (draft.trim() !== "" && !Number.isNaN(n)) commit(n);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      settle();
      return;
    }
    const delta = event.key === "ArrowUp" ? 1 : event.key === "ArrowDown" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    setDraft(null);
    commit(value + delta * step * (event.shiftKey ? 10 : 1));
  };

  return (
    <div className={cn(inputSurface, "control-md flex items-center gap-1 px-1", disabled && "opacity-40", className)}>
      <button
        type="button"
        onClick={() => { setDraft(null); commit(value - step); }}
        disabled={disabled || value <= min}
        aria-label={t.numberInputDecrease}
        className="touch-target flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
      >
        <Minus size={16} />
      </button>
      <input
        ref={inputRef}
        id={id ?? field?.id}
        type="text"
        inputMode="decimal"
        value={draft ?? value.toFixed(decimals)}
        disabled={disabled}
        aria-describedby={field?.describedBy}
        onChange={(event) => type(event.target.value)}
        onBlur={settle}
        onKeyDown={onKeyDown}
        className="min-w-0 flex-1 bg-transparent text-center text-base tabular-nums text-fg outline-none"
      />
      {suffix && <span className="shrink-0 pr-1 text-sm text-fg-3">{suffix}</span>}
      <button
        type="button"
        onClick={() => { setDraft(null); commit(value + step); }}
        disabled={disabled || value >= max}
        aria-label={t.numberInputIncrease}
        className="touch-target flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
