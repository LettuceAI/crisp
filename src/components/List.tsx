import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";

export interface ListGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Small tracked heading above the group — the app's section-label style, kept to this one role. */
  label?: ReactNode;
}

export function ListGroup({ label, className, children, ...rest }: ListGroupProps) {
  return (
    <section className={cn("space-y-2", className)} {...rest}>
      {label && (
        <h3 className="px-1 text-2xs font-medium uppercase tracking-[0.18em] text-fg-3">{label}</h3>
      )}
      <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface-1">{children}</div>
    </section>
  );
}

type Tone = "neutral" | "accent" | "danger" | "warning" | "info" | "secondary";

/* One frame, one icon colour. The tint used to be carried by a filled square behind each
   icon, which read as decoration applied by rote rather than as meaning. */
const iconTone: Record<Tone, string> = {
  neutral: "border-line text-fg-3",
  accent: "border-line text-accent",
  danger: "border-line text-danger",
  warning: "border-line text-warning",
  info: "border-line text-info",
  secondary: "border-line text-secondary",
};

interface RowContentProps {
  icon?: ReactNode;
  tone?: Tone;
  title: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
  chevron?: boolean;
}

function RowContent({ icon, tone = "neutral", title, description, trailing, chevron }: RowContentProps) {
  return (
    <>
      {icon && (
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
            iconTone[tone],
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-medium text-fg">{title}</span>
        {description && <span className="mt-0.5 block text-sm text-fg-3">{description}</span>}
      </span>
      {trailing && <span className="shrink-0 text-sm text-fg-3">{trailing}</span>}
      {chevron && <ChevronRight size={16} className="shrink-0 text-fg-4 transition-colors group-hover:text-fg-2" />}
    </>
  );
}

const rowBase = "group row-py flex w-full items-center gap-3 px-4 text-left";

/** Static row (shows a value, hosts a switch, etc.). */
export interface ListRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "title">, RowContentProps {}

export function ListRow({ icon, tone, title, description, trailing, chevron, className, ...rest }: ListRowProps) {
  return (
    <div className={cn(rowBase, className)} {...rest}>
      <RowContent icon={icon} tone={tone} title={title} description={description} trailing={trailing} chevron={chevron} />
    </div>
  );
}

/** Navigational / action row. Chevron on by default. */
export interface ListRowButtonProps extends Omit<HTMLMotionProps<"button">, "title">, RowContentProps {}

export const ListRowButton = forwardRef<HTMLButtonElement, ListRowButtonProps>(function ListRowButton(
  { icon, tone, title, description, trailing, chevron = true, className, type = "button", ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale: 0.995 }}
      transition={m.instant}
      className={cn(
        rowBase,
        "touch-target transition-colors motion-instant hover:bg-fill-2 disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...rest}
    >
      <RowContent icon={icon} tone={tone} title={title} description={description} trailing={trailing} chevron={chevron} />
    </motion.button>
  );
});
