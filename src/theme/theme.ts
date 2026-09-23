import { isLight, mixHex, readableOn } from "../lib/color";

/**
 * A theme is a handful of source colours. Everything else — the four text tiers, the
 * three fills, the three lines, the elevated and nav surfaces — is derived, so changing
 * one value re-colours the whole app consistently instead of leaving half of it behind.
 */
export interface ThemeColors {
  /** The page. Decides light vs dark on its own. */
  surface: string;
  /** Text and everything tinted from it: fills, lines, the muted tiers. */
  fg: string;
  accent: string;
  danger: string;
  warning: string;
  info: string;
  secondary: string;
  /** Navigation and title bars. Defaults to the elevated surface. */
  nav?: string;
}

export type ThemeRadius = "sharp" | "default" | "round";
export type ThemeDensity = "default" | "compact";

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  radius?: ThemeRadius;
  density?: ThemeDensity;
}

const RADIUS: Record<ThemeRadius, { sm: string; md: string; lg: string; xl: string; "2xl": string }> = {
  sharp: { sm: "2px", md: "3px", lg: "4px", xl: "6px", "2xl": "8px" },
  default: { sm: "4px", md: "6px", lg: "8px", xl: "12px", "2xl": "16px" },
  round: { sm: "6px", md: "10px", lg: "14px", xl: "18px", "2xl": "24px" },
};

/** Text tier strengths, as a percentage of `fg` mixed toward transparent. */
const TIERS = { fg2: 72, fg3: 50, fg4: 34 };
const FILLS = { fill: 5, fill2: 8, fill3: 12 };
const LINES = { line: 10, line2: 16, line3: 26 };

/**
 * Turns a theme into the CSS custom properties the components read.
 * Tiers mix toward `transparent` rather than the surface colour, so the same formula
 * works on a flat background, over a photo, and inside a gradient card.
 */
export function themeToVars(theme: Theme): Record<string, string> {
  const { surface, fg, accent, danger, warning, info, secondary, nav } = theme.colors;
  const light = isLight(surface);

  /* Elevation is two visible steps away from the page, both toward the light: lighter on
     a dark theme, white on a light one. The old single step sat 4.5% off the page, which
     is why every container needed a border to be seen at all. */
  const raised = light ? mixHex(surface, "#ffffff", 0.6) : mixHex(surface, "#ffffff", 0.075);
  const overlay = light ? "#ffffff" : mixHex(surface, "#ffffff", 0.13);
  const shadowAlpha = light ? 0.12 : 0.45;

  const mix = (color: string, pct: number) => `color-mix(in oklab, ${color} ${pct}%, transparent)`;

  return {
    "--color-surface": surface,
    /* Cards, list groups, panels — anything sitting on the page. */
    "--color-surface-1": raised,
    /* Sheets, dialogs, menus, popovers — anything sitting on top of everything. */
    "--color-surface-2": overlay,
    /* Kept as an alias of surface-1 so existing call sites keep working. */
    "--color-surface-el": raised,
    "--color-nav": nav ?? raised,
    "--color-fg": fg,
    "--color-fg-2": mix(fg, TIERS.fg2),
    "--color-fg-3": mix(fg, TIERS.fg3),
    "--color-fg-4": mix(fg, TIERS.fg4),
    "--color-fill": mix(fg, FILLS.fill),
    "--color-fill-2": mix(fg, FILLS.fill2),
    "--color-fill-3": mix(fg, FILLS.fill3),
    "--color-line": mix(fg, LINES.line),
    "--color-line-2": mix(fg, LINES.line2),
    "--color-line-3": mix(fg, LINES.line3),
    "--color-accent": accent,
    "--color-danger": danger,
    "--color-warning": warning,
    "--color-info": info,
    "--color-secondary": secondary,
    /* Solid accent buttons put text on the accent, so it has to be readable on it —
       a pale accent needs dark text, and that is not a decision a call site should make. */
    "--color-on-accent": readableOn(accent),
    /* Switch and slider knobs. Always the light end of the palette: a knob is a
       physical thing above its track, and `fg` would turn it black on a light theme. */
    "--color-knob": light ? "#ffffff" : fg,
    /* Depth for controls. A 1px lip and a hairline of light along the top edge — the
       whole effect is two hard-edged shadows, so it costs nothing to paint. */
    "--edge-light": light ? "rgb(255 255 255 / 0.9)" : "rgb(255 255 255 / 0.08)",
    "--edge-dark": light ? "rgb(0 0 0 / 0.16)" : "rgb(0 0 0 / 0.55)",
    "--edge-ambient": light ? "rgb(0 0 0 / 0.08)" : "rgb(0 0 0 / 0.35)",
    "--shadow-raised": `0 8px 24px rgb(0 0 0 / ${shadowAlpha})`,
    "--shadow-sheet": `0 -12px 40px rgb(0 0 0 / ${shadowAlpha + 0.1})`,
    ...Object.fromEntries(
      Object.entries(RADIUS[theme.radius ?? "default"]).map(([k, v]) => [`--radius-${k}`, v]),
    ),
  };
}

export function applyTheme(theme: Theme, target: HTMLElement = document.documentElement) {
  const vars = themeToVars(theme);
  for (const [key, value] of Object.entries(vars)) target.style.setProperty(key, value);
  target.style.colorScheme = isLight(theme.colors.surface) ? "light" : "dark";
  target.dataset.theme = isLight(theme.colors.surface) ? "light" : "dark";
  target.dataset.density = theme.density ?? "default";
}

export const PRESETS: readonly Theme[] = [
  {
    id: "midnight",
    name: "Midnight",
    colors: {
      surface: "#050505", fg: "#ffffff", accent: "#65c789",
      danger: "#ef4444", warning: "#f59e0b", info: "#3b82f6", secondary: "#a78bfa",
    },
  },
  {
    /* BRIEF.md — a cool ink rather than a void, and a white that is not a glare source.
       surface-1, surface-2, the fills and the lines are all derived from these two, so
       the whole ladder picks up the same cast from one value. */
    id: "ink",
    name: "Ink",
    colors: {
      surface: "#0b0c11", fg: "#eceef4", accent: "#65c789",
      danger: "#ef4444", warning: "#f59e0b", info: "#3b82f6", secondary: "#a78bfa",
    },
  },
  {
    /* The same decision in reverse: paper with a trace of warmth, not grey. */
    id: "vellum",
    name: "Vellum",
    colors: {
      surface: "#f7f6f3", fg: "#141312", accent: "#19874d",
      danger: "#dc2626", warning: "#b45309", info: "#2563eb", secondary: "#7c3aed",
    },
  },
  {
    id: "paper",
    name: "Paper",
    colors: {
      surface: "#f6f6f5", fg: "#111112", accent: "#19874d",
      danger: "#dc2626", warning: "#b45309", info: "#2563eb", secondary: "#7c3aed",
    },
  },
  {
    id: "slate",
    name: "Slate",
    colors: {
      surface: "#0d1117", fg: "#e6edf3", accent: "#2dd4bf",
      danger: "#f87171", warning: "#fbbf24", info: "#60a5fa", secondary: "#c084fc",
    },
  },
  {
    id: "ember",
    name: "Ember",
    colors: {
      surface: "#100a08", fg: "#fdf3ec", accent: "#fb923c",
      danger: "#f43f5e", warning: "#eab308", info: "#38bdf8", secondary: "#e879f9",
    },
  },
];

export const DEFAULT_THEME = PRESETS[0];
