import { Shelf } from "@lettuceai/crisp";

export default function ShelfExample() {
  return (
    <div className="w-full">
      <Shelf aria-label="Recently added" bleed={false} itemClassName="w-32">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex aspect-3/4 items-center justify-center rounded-xl bg-fill-3 text-sm text-fg-2">Card {i + 1}</div>
        ))}
      </Shelf>
    </div>
  );
}
