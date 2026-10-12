import { useState } from "react";
import { Slider } from "@lettuceai/crisp";

export default function SliderExample() {
  const [value, setValue] = useState(0.7);
  return (
    <div className="w-full max-w-sm">
      <Slider aria-label="Temperature" min={0} max={2} step={0.1} value={value} onChange={setValue} showValue={(v) => v.toFixed(1)} />
    </div>
  );
}
