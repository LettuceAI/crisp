import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";
import { useFieldContext } from "./Field";
import { inputSurface } from "./Input";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: readonly SelectOption[];
  placeholder?: string;
}

/**
 * Native select with our surface. On phones this opens the OS picker, which beats any
 * custom listbox for reach and accessibility. Use Menu for command-style lists.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder, className, id, value, defaultValue, ...rest },
  ref,
) {
  const field = useFieldContext();
  const empty = (value ?? defaultValue ?? "") === "";
  return (
    <div className="relative">
      <select
        ref={ref}
        id={id ?? field?.id}
        value={value}
        defaultValue={placeholder && value === undefined && defaultValue === undefined ? "" : defaultValue}
        aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
        aria-invalid={rest["aria-invalid"] ?? (field?.invalid || undefined)}
        className={cn(inputSurface, "control-md appearance-none pl-3.5 pr-10", empty && placeholder && "text-fg-4", className)}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled} className="bg-surface-el text-fg">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-3" />
    </div>
  );
});
