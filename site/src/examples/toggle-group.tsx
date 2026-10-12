import { useState } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { ToggleGroup } from "@lettuceai/crisp";

export default function ToggleGroupExample() {
  const [value, setValue] = useState<string[]>(["bold"]);
  return (
    <ToggleGroup
      aria-label="Text style"
      value={value}
      onChange={setValue}
      options={[{ value: "bold", label: <Bold size={16} /> }, { value: "italic", label: <Italic size={16} /> }, { value: "underline", label: <Underline size={16} /> }]}
    />
  );
}
