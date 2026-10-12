import { useState } from "react";
import { Checkbox, Stack } from "@lettuceai/crisp";

export default function CheckboxExample() {
  const [items, setItems] = useState({ a: true, b: false });
  const all = items.a && items.b;
  const some = items.a || items.b;
  return (
    <Stack gap={2}>
      <Checkbox label="Select all" checked={all} indeterminate={some && !all} onChange={(on) => setItems({ a: on, b: on })} />
      <div className="ml-6 space-y-2">
        <Checkbox label="Characters" checked={items.a} onChange={(a) => setItems({ ...items, a })} />
        <Checkbox label="Personas" checked={items.b} onChange={(b) => setItems({ ...items, b })} />
      </div>
    </Stack>
  );
}
