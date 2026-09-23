import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/cn";
import { Button, type ButtonProps } from "./Button";
import { IconButton } from "./IconButton";

export interface CopyButtonProps extends Omit<ButtonProps, "children" | "onClick"> {
  value: string;
  /** Omit for an icon-only button. */
  children?: React.ReactNode;
  label?: string;
  copiedLabel?: string;
}

/**
 * Copy with a confirmation that lives on the button itself, so the action doesn't need
 * a toast. The app writes this by hand wherever it copies a prompt, an error or an id.
 */
export function CopyButton({ value, children, label = "Copy", copiedLabel = "Copied", className, ...rest }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* Clipboard can be blocked; the state below still tells the user nothing happened. */
      return;
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  if (!children) {
    return (
      <IconButton label={copied ? copiedLabel : label} onClick={copy} className={className}>
        {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
      </IconButton>
    );
  }

  return (
    <Button
      onClick={copy}
      leading={copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
      className={cn(className)}
      {...rest}
    >
      {copied ? copiedLabel : children}
    </Button>
  );
}
