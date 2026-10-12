import { compactNumber, fileSize, relativeTime } from "@lettuceai/crisp";

const now = Date.now();
const rows: [string, string][] = [
  ["relativeTime(now - 4 min)", relativeTime(now - 4 * 60_000, now)],
  ["relativeTime(now - 3 days)", relativeTime(now - 3 * 86_400_000, now)],
  ["relativeTime(..., de)", relativeTime(now - 4 * 60_000, now, "de")],
  ["compactNumber(12400)", compactNumber(12400)],
  ["fileSize(1572864)", fileSize(1572864)],
  ["fileSize(1572864, de)", fileSize(1572864, "de")],
];

export default function FormatHelpersExample() {
  return (
    <dl className="grid w-full max-w-md grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-sm">
      {rows.map(([call, result]) => (
        <div key={call} className="contents">
          <dt className="font-mono text-xs text-fg-3">{call}</dt>
          <dd className="text-right text-fg">{result}</dd>
        </div>
      ))}
    </dl>
  );
}
