import { useState } from "react";
import { FilterBar } from "@lettuceai/crisp";

const options = [
  { value: "all", label: "All", count: 128 },
  { value: "characters", label: "Characters", count: 48 },
  { value: "personas", label: "Personas", count: 12 },
  { value: "lorebooks", label: "Lorebooks", count: 9 },
  { value: "scenes", label: "Scenes", count: 59 },
];

export default function FilterBarExample() {
  const [value, setValue] = useState("all");
  return <FilterBar aria-label="Library filter" options={options} value={value} onChange={setValue} className="w-full" />;
}
