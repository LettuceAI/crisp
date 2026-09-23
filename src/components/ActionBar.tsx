import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { useCompactLayout } from "../lib/useMediaQuery";
import { Button } from "./Button";

export interface ActionBarProps {
  /** The one thing to do next. */
  primary?: ReactNode;
  /** Beside it — Skip, Save draft. */
  secondary?: ReactNode;
  /** A Back button on the left; pass the handler. */
  onBack?: () => void;
  backLabel?: string;
  /** Anything else on the left — a count, a hint. */
  leading?: ReactNode;
  /**
   * Pin to the bottom of the screen with the home indicator kept clear. Default: on
   * compact layouts. Off, it is an ordinary row at the end of the content.
   */
  pinned?: boolean;
  className?: string;
}

/**
 * The row that moves a flow forward: Back on the left, the main action on the right,
 * a secondary beside it if the screen offers one. On the phone it stays put above the
 * home indicator; on the desktop it sits under the content. Every wizard, every
 * multi-step form uses this, so the buttons are in the same place on every screen.
 */
export function ActionBar({ primary, secondary, onBack, backLabel = "Back", leading, pinned, className }: ActionBarProps) {
  const compact = useCompactLayout();
  const pin = pinned ?? compact;
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        pin
          ? "sticky bottom-0 z-20 border-t border-line bg-surface/90 px-4 pt-3 pb-[calc(var(--safe-bottom,0px)+0.75rem)] backdrop-blur-md"
          : "pt-8",
        className,
      )}
    >
      {onBack && !pin && (
        <Button variant="ghost" leading={<ArrowLeft size={icon.md} />} onClick={onBack}>{backLabel}</Button>
      )}
      {leading}
      <span className="flex-1" />
      {secondary}
      {primary}
    </div>
  );
}
