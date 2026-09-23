import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { useFieldContext } from "./Field";
import { inputSurface } from "./Input";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function sameDay(a: Date, b: Date) { return startOfDay(a).getTime() === startOfDay(b).getTime(); }

export interface CalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  min?: Date;
  max?: Date;
  /** 0 = Sunday, 1 = Monday. Defaults to the locale's own first day. */
  weekStartsOn?: 0 | 1;
  locale?: string;
  className?: string;
}

/** The month grid. Uses Intl for day and month names, so it follows the app's 20 locales. */
export function Calendar({ value, onChange, min, max, weekStartsOn = 1, locale, className }: CalendarProps) {
  const [cursor, setCursor] = useState(() => startOfDay(value ?? new Date()));
  const today = startOfDay(new Date());

  const { days, monthLabel, weekdays } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const lead = (first.getDay() - weekStartsOn + 7) % 7;
    const total = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= total; d++) cells.push(new Date(year, month, d));

    const dayFmt = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
    const names = Array.from({ length: 7 }, (_, i) => dayFmt.format(new Date(2024, 0, 7 + ((i + weekStartsOn) % 7))));

    return {
      days: cells,
      monthLabel: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(first),
      weekdays: names,
    };
  }, [cursor, weekStartsOn, locale]);

  const disabled = (date: Date) => (min && date < startOfDay(min)) || (max && date > startOfDay(max));

  /* The grid is seven columns wide, so a 44px minimum on the cells has to come from the
     calendar being wider — not from the cells overflowing it. */
  return (
    <div className={cn("w-64 select-none [@media(pointer:coarse)]:w-[21rem]", className)}>
      <div className="mb-2 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          aria-label="Previous month"
          className="touch-target flex h-7 w-7 items-center justify-center rounded-lg text-fg-3 hover:bg-fill-2 hover:text-fg"
        >
          <ChevronLeft size={16} />
        </button>
        <span aria-live="polite" className="flex-1 text-center text-sm font-medium text-fg">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          aria-label="Next month"
          className="touch-target flex h-7 w-7 items-center justify-center rounded-lg text-fg-3 hover:bg-fill-2 hover:text-fg"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {weekdays.map((name, i) => (
          <span key={i} className="flex h-7 items-center justify-center text-2xs font-medium text-fg-3">{name}</span>
        ))}
        {days.map((date, i) =>
          date ? (
            <button
              key={i}
              type="button"
              disabled={disabled(date)}
              onClick={() => onChange(date)}
              aria-current={sameDay(date, today) ? "date" : undefined}
              aria-pressed={value ? sameDay(date, value) : false}
              className={cn(
                "flex h-8 items-center justify-center rounded-lg text-sm tabular-nums transition-colors [@media(pointer:coarse)]:h-11",
                value && sameDay(date, value)
                  ? "bg-accent font-medium text-on-accent"
                  : sameDay(date, today)
                    ? "text-accent hover:bg-fill-2"
                    : "text-fg-2 hover:bg-fill-2 hover:text-fg",
                disabled(date) && "pointer-events-none opacity-25",
              )}
            >
              {date.getDate()}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
    </div>
  );
}

export interface DatePickerProps extends Omit<CalendarProps, "className"> {
  /** Shown when nothing is chosen. */
  placeholder?: string;
  /** Also offer a time field. */
  withTime?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/** A field that opens a Calendar. The app's DateTimePicker is 323 lines used in one place. */
export function DatePicker({
  value, onChange, placeholder = "Pick a date", withTime, disabled, id, className, ...calendar
}: DatePickerProps) {
  const field = useFieldContext();
  const [open, setOpen] = useState(false);
  const label = value
    ? new Intl.DateTimeFormat(calendar.locale, {
        dateStyle: "medium",
        ...(withTime ? { timeStyle: "short" as const } : {}),
      }).format(value)
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <button
          type="button"
          id={id ?? field?.id}
          disabled={disabled}
          aria-describedby={field?.describedBy}
          className={cn(inputSurface, "control-md flex items-center gap-2.5 px-3.5 text-left", className)}
        >
          <CalendarDays size={16} className="shrink-0 text-fg-3" />
          <span className={cn("min-w-0 flex-1 truncate", value ? "text-fg" : "text-fg-4")}>{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-3">
        <Calendar
          value={value}
          onChange={(date) => {
            if (withTime && value) date.setHours(value.getHours(), value.getMinutes());
            onChange(date);
            if (!withTime) setOpen(false);
          }}
          {...calendar}
        />
        {withTime && (
          <div className="mt-3 border-t border-line pt-3">
            <input
              type="time"
              value={value ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}` : ""}
              onChange={(event) => {
                const [h, m] = event.target.value.split(":").map(Number);
                const next = new Date(value ?? new Date());
                next.setHours(h || 0, m || 0, 0, 0);
                onChange(next);
              }}
              aria-label="Time"
              className="h-9 w-full rounded-lg border border-line bg-fill px-2.5 text-base tabular-nums text-fg outline-none focus:border-accent focus:ring-1 focus:ring-accent/35"
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
