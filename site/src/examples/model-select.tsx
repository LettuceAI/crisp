import { useState } from "react";
import { ModelSelect } from "@lettuceai/crisp";

const models = [
  { id: "gemma", name: "Gemma 3 4B", provider: "On this device", local: true, vision: true, meta: "2.8 GB" },
  { id: "llama", name: "Llama 3.2 3B", provider: "On this device", local: true, meta: "2.0 GB" },
  { id: "gpt", name: "GPT", provider: "OpenAI", vision: true, audio: true },
  { id: "claude", name: "Claude", provider: "Anthropic", vision: true },
];

export default function ModelSelectExample() {
  const [value, setValue] = useState<string | null>("gemma");
  return (
    <div className="w-full max-w-sm">
      <ModelSelect aria-label="Model" models={models} value={value} onChange={setValue} defaultId="gemma" />
    </div>
  );
}
