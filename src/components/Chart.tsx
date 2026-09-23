import { useId } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { cn } from "../lib/cn";

/* One categorical ramp, ordered so neighbouring series stay distinguishable.
   Accent first: a single-series chart is about the thing the app is about. */
export const CHART_SERIES = ["var(--color-accent)", "var(--color-info)", "var(--color-secondary)", "var(--color-warning)", "var(--color-danger)"] as const;

export interface ChartProps<Row extends Record<string, unknown>> {
  data: readonly Row[];
  /** Key holding the category or timestamp. */
  x: string;
  /** One entry per series. */
  series: readonly { key: string; label: string; color?: string }[];
  kind?: "line" | "area" | "bar";
  height?: number;
  /** Formats values in the axis and tooltip. */
  format?: (value: number) => string;
  /** Hide the y axis for a sparkline-sized chart. */
  minimal?: boolean;
  className?: string;
}

const axisProps = {
  stroke: "var(--color-fg-4)",
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 11, fill: "var(--color-fg-3)" },
} as const;

function ChartTooltip({ active, payload, label, format }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface-el px-2.5 py-2 shadow-raised">
      <p className="mb-1 text-2xs text-fg-3">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: entry.color }} />
          <span className="text-fg-2">{entry.name}</span>
          <span className="ml-auto font-medium tabular-nums text-fg">
            {format ? format(entry.value) : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

/**
 * Charts on the token palette, so they follow a custom accent and stay legible on the
 * app's near-black surface. The app pulls in recharts already but styles each chart
 * inline with hard-coded colours.
 */
export function Chart<Row extends Record<string, unknown>>({
  data, x, series, kind = "area", height = 200, format, minimal, className,
}: ChartProps<Row>) {
  const id = useId();
  const Root = kind === "bar" ? BarChart : kind === "line" ? LineChart : AreaChart;

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <Root data={data as Row[]} margin={{ top: 4, right: 4, bottom: 0, left: minimal ? 0 : -16 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color ?? CHART_SERIES[i % CHART_SERIES.length]} stopOpacity={0.35} />
                <stop offset="100%" stopColor={s.color ?? CHART_SERIES[i % CHART_SERIES.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          {!minimal && <CartesianGrid stroke="var(--color-line)" vertical={false} />}
          <XAxis dataKey={x} {...axisProps} hide={minimal} />
          {!minimal && <YAxis {...axisProps} width={48} tickFormatter={format} />}
          <Tooltip cursor={{ stroke: "var(--color-line-2)" }} content={<ChartTooltip format={format} />} />
          {series.map((s, i) => {
            const color = s.color ?? CHART_SERIES[i % CHART_SERIES.length];
            if (kind === "bar") return <Bar key={s.key} dataKey={s.key} name={s.label} fill={color} radius={[4, 4, 0, 0]} />;
            if (kind === "line") return <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={color} strokeWidth={2} dot={false} />;
            return <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={color} strokeWidth={2} fill={`url(#${id}-${s.key})`} />;
          })}
        </Root>
      </ResponsiveContainer>
    </div>
  );
}

export interface SparklineProps {
  data: readonly number[];
  color?: string;
  height?: number;
  className?: string;
}

/** A trend with no axes, sized to sit inside a StatTile. */
export function Sparkline({ data, color = "var(--color-accent)", height = 32, className }: SparklineProps) {
  const rows = data.map((value, index) => ({ index, value }));
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export { Cell as ChartCell };
