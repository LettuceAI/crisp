import { useEffect, useState } from "react";

/**
 * Mean relative luminance of an image, 0–1. Sampled at 12×12 — enough to tell a lit
 * room from a dark one, cheap enough to run on every background change.
 *
 * Returns `null` while loading, or if the canvas is tainted by a cross-origin image.
 * Callers must treat `null` as "unknown" and keep a safe default, never guess bright.
 */
export function useImageBrightness(src?: string | null) {
  const [brightness, setBrightness] = useState<number | null>(null);

  useEffect(() => {
    if (!src) {
      setBrightness(null);
      return;
    }
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (cancelled) return;
      try {
        const size = 12;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return setBrightness(null);
        ctx.drawImage(image, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let total = 0;
        let counted = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 8) continue;
          const channel = (c: number) => {
            const s = c / 255;
            return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
          };
          total += 0.2126 * channel(data[i]) + 0.7152 * channel(data[i + 1]) + 0.0722 * channel(data[i + 2]);
          counted++;
        }
        setBrightness(counted ? total / counted : null);
      } catch {
        /* Tainted canvas — a remote background without CORS headers. */
        setBrightness(null);
      }
    };
    image.onerror = () => !cancelled && setBrightness(null);
    image.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return brightness;
}
