import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { useFieldContext } from "./Field";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

export function Switch({ checked, onChange, disabled, id, className, ...aria }: SwitchProps) {
  const field = useFieldContext();
  return (
    <button
      type="button"
      role="switch"
      id={id ?? field?.id}
      aria-checked={checked}
      aria-describedby={field?.describedBy}
      aria-label={aria["aria-label"]}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5",
        "transition-colors motion-quick",
        checked ? "bg-accent" : "bg-fill-3 hover:bg-line-3",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
    >
      <motion.span
        aria-hidden="true"
        layout
        transition={m.snap}
        className={cn("block h-5 w-5 rounded-full bg-knob shadow-sm ring-1 ring-inset ring-black/5", checked && "ml-auto")}
      />
    </button>
  );
}
