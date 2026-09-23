import { cn } from "../lib/cn";

/** Fills the free space in a Flex/HStack so siblings push to the edges. */
export function Spacer({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("flex-1", className)} />;
}
