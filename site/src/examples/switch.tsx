import { useState } from "react";
import { Field, Switch } from "@lettuceai/crisp";

export default function SwitchExample() {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center gap-6">
      <Field label="Sync" inline><Switch checked={on} onChange={setOn} /></Field>
      <Switch checked={false} onChange={() => {}} disabled aria-label="Disabled" />
    </div>
  );
}
