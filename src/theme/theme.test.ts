import { describe, expect, it } from "bun:test";
import { DEFAULT_THEME, PRESETS, themeToVars } from "./theme";

describe("theme system", () => {
  it("includes all six core presets", () => {
    const ids = PRESETS.map((p) => p.id);
    expect(ids).toContain("midnight");
    expect(ids).toContain("ink");
    expect(ids).toContain("vellum");
    expect(ids).toContain("paper");
    expect(ids).toContain("slate");
    expect(ids).toContain("ember");
  });

  it("converts DEFAULT_THEME to CSS variables", () => {
    const vars = themeToVars(DEFAULT_THEME);
    expect(vars["--color-surface"]).toBe(DEFAULT_THEME.colors.surface);
    expect(vars["--color-fg"]).toBe(DEFAULT_THEME.colors.fg);
    expect(vars["--color-accent"]).toBe(DEFAULT_THEME.colors.accent);
    expect(vars["--color-surface-1"]).toBeDefined();
    expect(vars["--color-surface-2"]).toBeDefined();
    expect(vars["--color-fg-2"]).toBeDefined();
    expect(vars["--color-fg-3"]).toBeDefined();
    expect(vars["--color-fg-4"]).toBeDefined();
    expect(vars["--color-fill"]).toBeDefined();
    expect(vars["--color-line"]).toBeDefined();
    expect(vars["--color-on-accent"]).toBeDefined();
    expect(vars["--radius-md"]).toBeDefined();
  });

  it("adjusts radius tokens according to theme radius", () => {
    const sharpVars = themeToVars({ ...DEFAULT_THEME, radius: "sharp" });
    const roundVars = themeToVars({ ...DEFAULT_THEME, radius: "round" });
    expect(sharpVars["--radius-sm"]).toBe("2px");
    expect(roundVars["--radius-sm"]).toBe("6px");
  });
});
