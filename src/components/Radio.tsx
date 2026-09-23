import { createContext, useContext, useId, type ReactNode } from "react";
import { cn } from "../lib/cn";

interface RadioGroupContextValue<T extends string = string> {
  name: string;
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  "aria-label"?: string;
  className?: string;
  children: ReactNode;
}

export function RadioGroup<T extends string>({ value, onChange, disabled, orientation = "vertical", className, children, ...aria }: RadioGroupProps<T>) {
  const name = useId();
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange: onChange as (v: string) => void, disabled }}>
      <div role="radiogroup" aria-label={aria["aria-label"]} className={cn("flex", orientation === "vertical" ? "flex-col gap-2.5" : "flex-row flex-wrap gap-4", className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

/** Uses a real <input type="radio"> so arrow-key group navigation comes from the browser. */
export function Radio({ value, label, description, disabled }: RadioProps) {
  const group = useContext(RadioGroupContext);
  if (!group) throw new Error("Radio must be used inside <RadioGroup>");
  const checked = group.value === value;
  const inert = disabled || group.disabled;
  return (
    <label className={cn("flex cursor-pointer items-start gap-2.5", inert && "cursor-not-allowed opacity-40")}>
      <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          type="radio"
          name={group.name}
          value={value}
          checked={checked}
          disabled={inert}
          onChange={() => group.onChange(value)}
          className="peer absolute inset-0 cursor-pointer opacity-0"
        />
        <span
          aria-hidden="true"
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border transition-colors motion-instant",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
            checked ? "border-accent" : "border-line-3 bg-fill peer-hover:border-fg-3",
          )}
        >
          <span className={cn("h-2.5 w-2.5 rounded-full bg-accent transition-transform motion-instant", checked ? "scale-100" : "scale-0")} />
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-base text-fg">{label}</span>
        {description && <span className="block text-sm text-fg-3">{description}</span>}
      </span>
    </label>
  );
}
