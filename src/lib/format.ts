const isEnglish = (locale: string) => /^en(-|$)/i.test(locale);

/** "Just now", "4 min ago", "Yesterday", "3 wk ago" — how a list says when. Other locales follow `Intl.RelativeTimeFormat`. */
export function relativeTime(when: Date | number, now: Date | number = Date.now(), locale = "en"): string {
  const ms = +now - +when;
  const min = Math.round(ms / 60_000);
  if (isEnglish(locale)) {
    if (min < 1) return "Just now";
    if (min < 60) return `${min} min ago`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} h ago`;
    const d = Math.floor(h / 24);
    if (d === 1) return "Yesterday";
    if (d < 7) return `${d} days ago`;
    if (d < 30) return `${Math.floor(d / 7)} wk ago`;
    if (d < 365) return `${Math.floor(d / 30)} mo ago`;
    return `${Math.floor(d / 365)} yr ago`;
  }
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" });
  if (min < 1) return rtf.format(0, "second");
  if (min < 60) return rtf.format(-min, "minute");
  const h = Math.floor(min / 60);
  if (h < 24) return rtf.format(-h, "hour");
  const d = Math.floor(h / 24);
  if (d < 7) return rtf.format(-d, "day");
  if (d < 30) return rtf.format(-Math.floor(d / 7), "week");
  if (d < 365) return rtf.format(-Math.floor(d / 30), "month");
  return rtf.format(-Math.floor(d / 365), "year");
}

/** 950 → "950", 1 240 → "1.2k", 18 300 → "18k", 2 140 000 → "2.1M". Other locales follow compact `Intl.NumberFormat`. */
export function compactNumber(n: number, locale = "en"): string {
  if (!isEnglish(locale)) return new Intl.NumberFormat(locale, { notation: "compact" }).format(n);
  const abs = Math.abs(n);
  if (abs < 1000) return String(n);
  const units: [number, string][] = [[1e9, "B"], [1e6, "M"], [1e3, "k"]];
  for (const [size, suffix] of units) {
    if (abs >= size) {
      const v = n / size;
      return `${v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")}${suffix}`;
    }
  }
  return String(n);
}

const byteUnits = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"] as const;

/** 1 536 000 → "1.5 MB". Other locales use `Intl.NumberFormat` with byte units. */
export function fileSize(bytes: number, locale = "en"): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  if (i === 0) v = Math.round(v);
  if (isEnglish(locale)) return `${i === 0 ? v : v.toFixed(v >= 10 ? 0 : 1)} ${units[i]}`;
  const fraction = i === 0 || v >= 10 ? 0 : 1;
  try {
    return new Intl.NumberFormat(locale, {
      style: "unit",
      unit: byteUnits[i],
      unitDisplay: "short",
      maximumFractionDigits: fraction,
    }).format(v);
  } catch {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: fraction }).format(v)} ${units[i]}`;
  }
}
