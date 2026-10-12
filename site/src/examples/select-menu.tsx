import { useState } from "react";
import { Cloud, Cpu } from "lucide-react";
import { SelectMenu, Stack } from "@lettuceai/crisp";

const options = [
  { value: "gemma", label: "Gemma 3", description: "Runs on this device", icon: <Cpu size={16} />, meta: "4.1 GB", group: "Local" },
  { value: "llama", label: "Llama 3.2", description: "Runs on this device", icon: <Cpu size={16} />, meta: "2.0 GB", group: "Local" },
  { value: "gpt", label: "GPT", description: "Hosted", icon: <Cloud size={16} />, group: "Cloud" },
];

export default function SelectMenuExample() {
  const [one, setOne] = useState<string | null>("gemma");
  const [many, setMany] = useState<string[]>(["llama", "gpt"]);
  return (
    <Stack gap={3} className="w-full max-w-xs">
      <SelectMenu options={options} value={one} onChange={(v) => setOne(v)} placeholder="Choose a model" />
      <SelectMenu multiple options={options} value={many} onChange={(v) => setMany(v)} placeholder="Choose models" />
    </Stack>
  );
}
