import { useState } from "react";
import { OtpInput, Text } from "@lettuceai/crisp";

export default function OtpInputExample() {
  const [value, setValue] = useState("");
  const [done, setDone] = useState("");
  return (
    <div className="flex flex-col items-center gap-3">
      <OtpInput length={6} value={value} onChange={setValue} onComplete={setDone} />
      <Text variant="hint">{done ? `Entered ${done}` : "Type or paste a code"}</Text>
    </div>
  );
}
