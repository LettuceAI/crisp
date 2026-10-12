import { useState } from "react";
import { Radio, RadioGroup } from "@lettuceai/crisp";

export default function RadioExample() {
  const [value, setValue] = useState("auto");
  return (
    <RadioGroup aria-label="Memory mode" value={value} onChange={setValue}>
      <Radio value="auto" label="Automatic" description="Remember what matters." />
      <Radio value="manual" label="Manual" description="Only what you save." />
      <Radio value="off" label="Off" />
    </RadioGroup>
  );
}
