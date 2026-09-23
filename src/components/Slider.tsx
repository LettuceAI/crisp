import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { useFieldContext } from "./Field";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Show the current value at the right. Pass a formatter to add units. */
  showValue?: boolean | ((value: number) => string);
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { value, onChange, min = 0, max = 100, step = 1, showValue, className, id, style, ...rest },
  ref,
) {
  const field = useFieldContext();
  const fill = ((value - min) / (max - min)) * 100;
  const label = typeof showValue === "function" ? showValue(value) : showValue ? String(value) : null;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <input
        ref={ref}
        type="range"
        id={id ?? field?.id}
        aria-describedby={field?.describedBy}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="slider min-w-0 flex-1"
        style={{ ["--slider-fill" as string]: `${fill}%`, ...style }}
        {...rest}
      />
      {label !== null && <span className="w-10 shrink-0 text-right text-sm tabular-nums text-fg-2">{label}</span>}
    </div>
  );
});
