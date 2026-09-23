import { useMemo, useState, type ReactNode } from "react";
import { Check, ChevronDown, Cpu, Globe } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { useCompactLayout } from "../lib/useMediaQuery";
import { Badge } from "./Badge";
import { ListGroup, ListRowButton } from "./List";
import { SelectMenu } from "./SelectMenu";
import { Sheet } from "./Sheet";

export interface ModelOption {
  id: string;
  name: string;
  /** Who runs it — the group heading. */
  provider: string;
  /** Runs on this device. */
  local?: boolean;
  vision?: boolean;
  audio?: boolean;
  /** Small text after the name — a size, a price. */
  meta?: string;
}

export interface ModelSelectProps {
  models: readonly ModelOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  /** Shown when nothing is picked. Default "Choose a model". */
  placeholder?: string;
  /** Which one the app falls back to; drawn as "Default" in the list. */
  defaultId?: string | null;
  /** A row at the end — "Add a model…". */
  footer?: ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

const badges = (mo: ModelOption) => (
  <span className="flex items-center gap-1">
    {mo.vision && <Badge tone="info">Vision</Badge>}
    {mo.audio && <Badge tone="secondary">Audio</Badge>}
  </span>
);

/**
 * Picking a model, grouped by who runs it, with what it can do on the row. A menu on
 * the desktop; the bottom menu on the phone, where a dropdown would be a thumb's
 * width. The chat header, a character's settings and the default-model setting all
 * ask the same question.
 */
export function ModelSelect({ models, value, onChange, placeholder = "Choose a model", defaultId, footer, disabled, id, className, ...aria }: ModelSelectProps) {
  const compact = useCompactLayout();
  const [open, setOpen] = useState(false);
  const chosen = models.find((mo) => mo.id === value) ?? null;

  const options = useMemo(
    () =>
      models.map((mo) => ({
        value: mo.id,
        label: mo.name,
        description: mo.meta,
        group: mo.provider,
        icon: mo.local ? <Cpu size={icon.md} /> : <Globe size={icon.md} />,
        meta: <span className="flex items-center gap-1">{badges(mo)}{mo.id === defaultId && <Badge tone="accent" dot>Default</Badge>}</span>,
      })),
    [models, defaultId],
  );

  if (!compact) {
    return <SelectMenu id={id} options={options} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className={className} aria-label={aria["aria-label"]} />;
  }

  const groups = [...new Set(models.map((mo) => mo.provider))];
  return (
    <>
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-label={aria["aria-label"]}
        onClick={() => setOpen(true)}
        className={cn("control-md flex w-full items-center gap-2.5 rounded-xl border border-line bg-fill px-3.5 text-left text-base text-fg disabled:opacity-40", className)}
      >
        <span className="shrink-0 text-fg-3">{chosen?.local ? <Cpu size={icon.md} /> : <Globe size={icon.md} />}</span>
        <span className={cn("min-w-0 flex-1 truncate", !chosen && "text-fg-4")}>{chosen?.name ?? placeholder}</span>
        {chosen && <span className="hidden @sm:flex">{badges(chosen)}</span>}
        <ChevronDown size={icon.md} className="shrink-0 text-fg-3" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={aria["aria-label"] ?? "Model"} detents={[0.6, 0.92]}>
        <div className="space-y-5">
          {groups.map((g) => (
            <ListGroup key={g} label={g}>
              {models.filter((mo) => mo.provider === g).map((mo) => (
                <ListRowButton
                  key={mo.id}
                  icon={mo.local ? <Cpu size={icon.lg} /> : <Globe size={icon.lg} />}
                  tone={mo.local ? "accent" : "info"}
                  title={mo.name}
                  description={<span className="flex flex-wrap items-center gap-1.5">{mo.meta}{badges(mo)}{mo.id === defaultId && <Badge tone="accent" dot>Default</Badge>}</span>}
                  chevron={false}
                  trailing={mo.id === value ? <Check size={icon.md} className="text-accent" /> : undefined}
                  onClick={() => { onChange(mo.id); setOpen(false); }}
                />
              ))}
            </ListGroup>
          ))}
          {footer}
        </div>
      </Sheet>
    </>
  );
}
