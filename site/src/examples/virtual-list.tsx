import { VirtualList } from "@lettuceai/crisp";

const items = Array.from({ length: 5000 }, (_, i) => `Memory ${i + 1}`);

export default function VirtualListExample() {
  return (
    <div className="w-full max-w-sm">
      <p className="mb-2 text-sm text-fg-3">5,000 rows, only the visible ones are mounted.</p>
      <VirtualList items={items} estimateSize={40} itemKey={(_, index) => index} className="h-56 rounded-xl border border-line">
        {(item) => <div className="flex h-10 items-center border-b border-line px-3 text-sm text-fg-2">{item}</div>}
      </VirtualList>
    </div>
  );
}
