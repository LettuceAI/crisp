import { Masonry } from "@lettuceai/crisp";

const heights = [96, 140, 70, 120, 90, 150, 80, 110];

export default function MasonryExample() {
  return (
    <div className="w-full">
      <Masonry minColumnWidth={110} gap={8}>
        {heights.map((h, i) => (
          <div key={i} style={{ height: h }} className="flex items-center justify-center rounded-lg bg-fill-3 text-sm text-fg-2">{i + 1}</div>
        ))}
      </Masonry>
    </div>
  );
}
