import { useMemo } from "react";
import { AlertTriangle, Check, RotateCcw } from "lucide-react";
import { cn } from "../lib/cn";
import { contrastRatio } from "../lib/color";
import { useTheme, type ThemeColors, type ThemeDensity, type ThemeRadius } from "../theme";
import { Button } from "./Button";
import { ColorPicker } from "./ColorPicker";
import { Segmented } from "./Segmented";
import { Tooltip } from "./Tooltip";

const SOURCES: { key: keyof ThemeColors; label: string; hint: string }[] = [
  { key: "surface", label: "Surface", hint: "The page. Decides light or dark on its own." },
  { key: "fg", label: "Foreground", hint: "Text, and every fill and line tinted from it." },
  { key: "accent", label: "Accent", hint: "Actions and selection." },
  { key: "danger", label: "Danger", hint: "Destructive actions and errors." },
  { key: "warning", label: "Warning", hint: "Needs attention." },
  { key: "info", label: "Info", hint: "Neutral notices." },
  { key: "secondary", label: "Secondary", hint: "Generated and AI-authored things." },
];

const DERIVED = [
  { var: "--color-surface-1", label: "surface-1" },
  { var: "--color-surface-2", label: "surface-2" },
  { var: "--color-fg-2", label: "fg-2" },
  { var: "--color-fg-3", label: "fg-3" },
  { var: "--color-fg-4", label: "fg-4" },
  { var: "--color-fill", label: "fill" },
  { var: "--color-fill-2", label: "fill-2" },
  { var: "--color-fill-3", label: "fill-3" },
  { var: "--color-line", label: "line" },
  { var: "--color-line-2", label: "line-2" },
  { var: "--color-line-3", label: "line-3" },
  { var: "--color-on-accent", label: "on-accent" },
];

/** WCAG 4.5 is the floor for body text; 3 is the floor for large text and UI edges. */
function ContrastBadge({ ratio, need = 4.5, label }: { ratio: number; need?: number; label: string }) {
  const pass = ratio >= need;
  return (
    <Tooltip content={`${label}: ${ratio.toFixed(2)}:1 — needs ${need}:1`}>
      <span
        className={cn(
          "inline-flex h-6 items-center gap-1 rounded-full border px-2 text-2xs font-medium tabular-nums",
          pass ? "border-accent/25 bg-accent/12 text-accent" : "border-danger/25 bg-danger/12 text-danger",
        )}
      >
        {pass ? <Check size={12} /> : <AlertTriangle size={12} />}
        {label} {ratio.toFixed(1)}
      </span>
    </Tooltip>
  );
}

/**
 * Live theme editing. Every change writes straight to the document, so the editor and
 * everything behind it repaint together — there is no preview mode, because the preview
 * is the app.
 */
export function ThemeEditor({ className }: { className?: string }) {
  const { theme, presets, setTheme, setColor, setRadius, setDensity, reset, isCustom } = useTheme();
  const { surface, fg, accent } = theme.colors;

  /* Contrast is checked against the tier that carries meaning, not the brightest one:
     fg-3 is the last readable tier, so if it passes, everything above it does too. */
  const checks = useMemo(() => {
    const fgOnSurface = contrastRatio(fg, surface);
    return {
      body: fgOnSurface,
      /* fg-3 is fg at 50% over the surface, which halves the effective contrast. */
      muted: (fgOnSurface + 1) / 2,
      accent: contrastRatio(accent, surface),
    };
  }, [fg, surface, accent]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          aria-label="Theme preset"
          size="sm"
          value={isCustom ? "custom" : theme.id}
          onChange={(id) => {
            const preset = presets.find((p) => p.id === id);
            if (preset) setTheme(preset);
          }}
          options={[
            ...presets.map((p) => ({ value: p.id, label: p.name })),
            ...(isCustom ? [{ value: "custom", label: "Custom" }] : []),
          ]}
        />
        <span className="flex-1" />
        <Segmented
          aria-label="Density"
          size="sm"
          value={theme.density ?? "default"}
          onChange={(d) => setDensity(d as ThemeDensity)}
          options={[{ value: "default", label: "Default" }, { value: "compact", label: "Compact" }]}
        />
        <Segmented
          aria-label="Corner radius"
          size="sm"
          value={theme.radius ?? "default"}
          onChange={(r) => setRadius(r as ThemeRadius)}
          options={[{ value: "sharp", label: "Sharp" }, { value: "default", label: "Default" }, { value: "round", label: "Round" }]}
        />
        <Button size="sm" variant="ghost" leading={<RotateCcw size={16} />} onClick={reset}>
          Reset
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SOURCES.map((source) => (
          <div key={source.key} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <label className="text-sm font-medium text-fg-2">{source.label}</label>
              <span className="font-mono text-2xs uppercase text-fg-3">{theme.colors[source.key]}</span>
            </div>
            <ColorPicker
              value={theme.colors[source.key] ?? "#000000"}
              onChange={(value) => setColor(source.key, value)}
              className="w-full"
            />
            <p className="text-sm text-fg-3">{source.hint}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ContrastBadge ratio={checks.body} label="Body" />
        <ContrastBadge ratio={checks.muted} need={4.5} label="Muted" />
        <ContrastBadge ratio={checks.accent} need={3} label="Accent" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-fg-2">Derived</p>
        <p className="text-sm text-fg-3">
          Computed from the values above. Change the foreground and all eleven move with it.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {DERIVED.map((token) => (
            <div key={token.var} className="flex items-center gap-2 rounded-lg border border-line bg-fill px-2 py-1.5">
              <span
                className="h-5 w-5 shrink-0 rounded-md ring-1 ring-inset ring-line-2"
                style={{ background: `var(${token.var})` }}
              />
              <span className="font-mono text-2xs text-fg-3">{token.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
