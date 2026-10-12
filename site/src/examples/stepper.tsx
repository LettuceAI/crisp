import { useState } from "react";
import { Stack, Stepper } from "@lettuceai/crisp";

const steps = [
  { id: "basics", label: "Basics" },
  { id: "persona", label: "Persona" },
  { id: "memory", label: "Memory" },
  { id: "review", label: "Review" },
];

export default function StepperExample() {
  const [current, setCurrent] = useState(2);
  return (
    <Stack gap={6} className="w-full max-w-lg">
      <Stepper steps={steps} current={current} onStepClick={setCurrent} />
      <Stepper steps={steps} current={current} variant="dots" onStepClick={setCurrent} />
    </Stack>
  );
}
