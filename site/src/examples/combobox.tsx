import { useState } from "react";
import { Combobox } from "@lettuceai/crisp";

const options = ["Ada Lovelace", "Alan Turing", "Grace Hopper", "Katherine Johnson", "Linus Torvalds"].map((name) => ({ value: name, label: name }));

export default function ComboboxExample() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="w-full max-w-xs">
      <Combobox options={options} value={value} onChange={setValue} placeholder="Pick a person" searchPlaceholder="Search" clearable />
    </div>
  );
}
