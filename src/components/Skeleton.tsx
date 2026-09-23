import { cn } from "../lib/cn";

export interface SkeletonProps {
  /** Text lines get a line-height-sized bar; circle for avatars; block for images/cards. */
  shape?: "text" | "circle" | "block";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ shape = "text", width, height, className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "skeleton",
        shape === "text" && "h-3.5 rounded-md",
        shape === "circle" && "rounded-full",
        shape === "block" && "rounded-xl",
        className,
      )}
      style={{ width, height }}
    />
  );
}

/** Skeleton for a list row: avatar + two lines. */
export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 px-4 py-3", className)}>
      <Skeleton shape="circle" width={36} height={36} />
      <div className="flex-1 space-y-2">
        <Skeleton width="45%" />
        <Skeleton width="70%" className="h-3" />
      </div>
    </div>
  );
}
