import { useState, type ReactNode } from "react";
import { Check, Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { IconButton } from "./IconButton";
import { useCrispStrings } from "../lib/strings";

export type FeedbackSentiment = "like" | "dislike" | null;

export interface FeedbackActionProps {
  /** Active feedback state. */
  sentiment?: FeedbackSentiment;
  /** Triggered when the like/thumbs-up button is tapped. */
  onLike?: () => void;
  /** Triggered when the dislike/thumbs-down button is tapped. */
  onDislike?: () => void;
  /** Custom handler for copying message text. */
  onCopy?: () => void;
  /** Text to copy to clipboard if onCopy is not provided. */
  copyText?: string;
  /** Triggered when asking the model to regenerate the response. */
  onRetry?: () => void;
  /** Additional action items to display inline (e.g. share or edit). */
  children?: ReactNode;
  className?: string;
}

/**
 * An action bar for AI responses: like, dislike, copy, and regenerate.
 * Placed at the bottom of messages to collect evaluation feedback.
 */
export function FeedbackAction({
  sentiment = null,
  onLike,
  onDislike,
  onCopy,
  copyText,
  onRetry,
  children,
  className,
}: FeedbackActionProps) {
  const { strings: t } = useCrispStrings();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (onCopy) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    if (copyText && typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(copyText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard access denied or unpermitted
      }
    }
  };

  return (
    <div className={cn("inline-flex items-center gap-1 text-fg-3", className)}>
      {onLike && (
        <IconButton
          size="sm"
          variant="ghost"
          label={t.feedbackGood}
          active={sentiment === "like"}
          onClick={onLike}
          className={cn(sentiment === "like" && "text-accent bg-accent/15 hover:bg-accent/20")}
        >
          <ThumbsUp size={icon.xs} className={sentiment === "like" ? "fill-current" : undefined} />
        </IconButton>
      )}

      {onDislike && (
        <IconButton
          size="sm"
          variant="ghost"
          label={t.feedbackBad}
          active={sentiment === "dislike"}
          onClick={onDislike}
          className={cn(sentiment === "dislike" && "text-danger bg-danger/15 hover:bg-danger/20")}
        >
          <ThumbsDown size={icon.xs} className={sentiment === "dislike" ? "fill-current" : undefined} />
        </IconButton>
      )}

      {(onCopy || copyText) && (
        <IconButton
          size="sm"
          variant="ghost"
          label={copied ? t.feedbackCopied : t.feedbackCopy}
          onClick={handleCopy}
          className={cn(copied && "text-accent")}
        >
          {copied ? <Check size={icon.xs} /> : <Copy size={icon.xs} />}
        </IconButton>
      )}

      {onRetry && (
        <IconButton
          size="sm"
          variant="ghost"
          label={t.feedbackRetry}
          onClick={onRetry}
        >
          <RotateCcw size={icon.xs} />
        </IconButton>
      )}

      {children}
    </div>
  );
}

FeedbackAction.displayName = "FeedbackAction";
