import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { applyTheme, DEFAULT_THEME, PRESETS, type Theme, type ThemeColors, type ThemeDensity, type ThemeRadius } from "./theme";

const STORAGE_KEY = "crisp.theme";

interface ThemeContextValue {
  theme: Theme;
  presets: readonly Theme[];
  setTheme: (theme: Theme) => void;
  /** Change one colour and repaint immediately — this is the live-editing path. */
  setColor: (key: keyof ThemeColors, value: string) => void;
  setRadius: (radius: ThemeRadius) => void;
  setDensity: (density: ThemeDensity) => void;
  reset: () => void;
  isCustom: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

function load(): Theme {
  if (typeof localStorage === "undefined") return DEFAULT_THEME;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THEME;
    const parsed = JSON.parse(raw) as Theme;
    if (!parsed?.colors?.surface || !parsed.colors.fg) return DEFAULT_THEME;
    return parsed;
  } catch {
    return DEFAULT_THEME;
  }
}

export function ThemeProvider({ children, initial }: { children: ReactNode; initial?: Theme }) {
  const [theme, setThemeState] = useState<Theme>(() => initial ?? load());

  /* Paint before first render so there is no flash of the default palette. */
  useState(() => {
    if (typeof document !== "undefined") applyTheme(initial ?? load());
    return null;
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {
      /* private mode — the theme still applies, it just won't persist */
    }
  }, [theme]);

  const setColor = useCallback((key: keyof ThemeColors, value: string) => {
    setThemeState((current) => ({
      ...current,
      id: "custom",
      name: current.id === "custom" ? current.name : `${current.name} (edited)`,
      colors: { ...current.colors, [key]: value },
    }));
  }, []);

  const setRadius = useCallback((radius: ThemeRadius) => {
    setThemeState((current) => ({ ...current, radius }));
  }, []);

  const setDensity = useCallback((density: ThemeDensity) => {
    setThemeState((current) => ({ ...current, density }));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      presets: PRESETS,
      setTheme: setThemeState,
      setColor,
      setRadius,
      setDensity,
      reset: () => setThemeState(DEFAULT_THEME),
      isCustom: theme.id === "custom",
    }),
    [theme, setColor, setRadius, setDensity],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
