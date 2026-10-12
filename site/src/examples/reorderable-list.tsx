import { useState } from "react";
import { ReorderableList } from "@lettuceai/crisp";

export default function ReorderableListExample() {
  const [items, setItems] = useState(["Opening scene", "The market", "The harbor", "Epilogue"]);
  return (
    <div className="w-full max-w-sm">
      <ReorderableList aria-label="Scenes" items={items} onReorder={setItems} keyOf={(item) => item} className="space-y-2">
        {(item, handle, index) => (
          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface-1 px-2 py-2">
            {handle}
            <span className="flex-1 text-sm text-fg">{item}</span>
            <span className="text-xs text-fg-3">{index + 1}</span>
          </div>
        )}
      </ReorderableList>
    </div>
  );
}
