/** "Just now", "4 min ago", "Yesterday", "3 wk ago" — how a list says when. */
export function relativeTime(when: Date | number, now: Date | number = Date.now()): string {
  const ms = +now - +when;
  const min = Math.round(ms / 60_000);
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

/** 950 → "950", 1 240 → "1.2k", 18 300 → "18k", 2 140 000 → "2.1M". */
export function compactNumber(n: number): string {
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

/** 1 536 000 → "1.5 MB". */
export function fileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${i === 0 ? v : v.toFixed(v >= 10 ? 0 : 1)} ${units[i]}`;
}
