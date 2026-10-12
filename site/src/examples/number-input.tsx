import { useState } from "react";
import { NumberInput } from "@lettuceai/crisp";

export default function NumberInputExample() {
  const [value, setValue] = useState(2048);
  return <NumberInput aria-label="Max tokens" value={value} onChange={setValue} min={64} max={8192} step={64} suffix="tokens" />;
}
