import { useState } from "react";
import { Composer, Text } from "@lettuceai/crisp";

export default function ComposerExample() {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  return (
    <div className="w-full max-w-lg space-y-3">
      {sent.map((text, i) => <Text key={i} variant="hint">Sent: {text}</Text>)}
      <Composer
        value={value}
        onChange={setValue}
        onSend={() => { if (value.trim()) { setSent((all) => [...all.slice(-2), value]); setValue(""); } }}
        onAttach={() => {}}
        placeholder="Write a message"
      />
    </div>
  );
}
