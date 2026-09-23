/** Colour helpers. Deriving is left to CSS `color-mix`; this is only the maths CSS can't do. */

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const v = hex.trim().replace(/^#/, "");
  const full = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function normaliseHex(input: string): string | null {
  const rgb = hexToRgb(input);
  if (!rgb) return null;
  return `#${[rgb.r, rgb.g, rgb.b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** WCAG relative luminance. */
export function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/** WCAG contrast ratio, 1–21. Body text wants 4.5, large text and UI edges 3. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function isLight(hex: string): boolean {
  return luminance(hex) > 0.4;
}

/** Black or white, whichever is readable on the given background. */
export function readableOn(background: string): string {
  return contrastRatio(background, "#ffffff") >= contrastRatio(background, "#000000") ? "#ffffff" : "#0a0a0a";
}

/** Blend two hex colours in sRGB. Used where a literal value is needed, not a var. */
export function mixHex(a: string, b: string, amount: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  if (!ca || !cb) return a;
  const t = Math.min(1, Math.max(0, amount));
  const channel = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `#${[channel(ca.r, cb.r), channel(ca.g, cb.g), channel(ca.b, cb.b)]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
}
