import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Segmented, Stack } from "@lettuceai/crisp";

export default function SegmentedExample() {
  const [view, setView] = useState("grid");
  const [size, setSize] = useState("md");
  return (
    <Stack gap={3} className="items-center">
      <Segmented aria-label="View" value={view} onChange={setView} options={[{ value: "grid", label: "Grid", icon: <LayoutGrid size={14} /> }, { value: "list", label: "List", icon: <List size={14} /> }]} />
      <Segmented aria-label="Size" size="sm" value={size} onChange={setSize} options={[{ value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" }]} />
    </Stack>
  );
}
