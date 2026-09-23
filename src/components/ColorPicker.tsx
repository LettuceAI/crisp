import { useState } from "react";
import { Check, Pipette } from "lucide-react";
import { cn } from "../lib/cn";
import { useFieldContext } from "./Field";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

export interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  /** Quick picks shown above the free-form field. */
  swatches?: readonly string[];
  disabled?: boolean;
  id?: string;
  className?: string;
}

const DEFAULT_SWATCHES = [
  "#65c789", "#22d3ee", "#3b82f6", "#a78bfa", "#f472b6",
  "#ef4444", "#f59e0b", "#84cc16", "#e5e7eb", "#71717a",
] as const;

function normalise(input: string) {
  const v = input.trim().replace(/^#?/, "");
  if (/^[0-9a-f]{3}$/i.test(v)) return `#${v[0]}${v[0]}${v[1]}${v[1]}${v[2]}${v[2]}`.toLowerCase();
  if (/^[0-9a-f]{6}$/i.test(v)) return `#${v.toLowerCase()}`;
  return null;
}

/**
 * A colour swatch that opens a picker. The custom-colour settings page rolls its own
 * inputs; this pairs the native colour input (so the OS picker is available) with a hex
 * field and a preset row, which is how people actually choose.
 */
export function ColorPicker({ value, onChange, swatches = DEFAULT_SWATCHES, disabled, id, className }: ColorPickerProps) {
  const field = useFieldContext();
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);

  const commit = (raw: string) => {
    const hex = normalise(raw);
    if (hex) onChange(hex);
    else setDraft(value);
  };

  return (
    <Popover open={open} onOpenChange={(next) => { setOpen(next); if (next) setDraft(value); }}>
      <PopoverTrigger>
        <button
          type="button"
          id={id ?? field?.id}
          disabled={disabled}
          aria-label={`Colour, currently ${value}`}
          className={cn(
            "control-md flex items-center gap-2.5 rounded-xl border border-line bg-fill px-2.5 transition-colors hover:border-line-2",
            disabled && "pointer-events-none opacity-40",
            className,
          )}
        >
          <span className="h-6 w-6 shrink-0 rounded-md ring-1 ring-inset ring-line-3" style={{ background: value }} />
          <span className="font-mono text-sm uppercase text-fg-2">{value}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-3">
        <div className="grid grid-cols-5 gap-2">
          {swatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => { onChange(swatch); setOpen(false); }}
              aria-label={swatch}
              className="flex h-8 w-full items-center justify-center rounded-lg ring-1 ring-inset ring-line-3 transition-transform hover:scale-105"
              style={{ background: swatch }}
            >
              {swatch.toLowerCase() === value.toLowerCase() && (
                <Check size={14} className="text-black mix-blend-difference invert" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <label className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line bg-fill text-fg-3 hover:text-fg">
            <Pipette size={16} />
            <input
              type="color"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              aria-label="Pick a colour"
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => commit(draft)}
            onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); commit(draft); } }}
            aria-label="Hex value"
            spellCheck={false}
            className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-fill px-2.5 font-mono text-sm uppercase text-fg outline-none focus:border-accent focus:ring-1 focus:ring-accent/35"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
