import { useState } from "react";
import { Select } from "@lettuceai/crisp";

const options = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "tr", label: "Türkçe" },
];

export default function SelectExample() {
  const [value, setValue] = useState("");
  return (
    <div className="w-full max-w-xs">
      <Select aria-label="Language" options={options} value={value} onChange={(event) => setValue(event.target.value)} placeholder="Choose a language" />
    </div>
  );
}
