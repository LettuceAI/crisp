import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-line-2 bg-fill px-1.5 font-sans text-2xs font-medium text-fg-2", className)}>
      {children}
    </kbd>
  );
}
