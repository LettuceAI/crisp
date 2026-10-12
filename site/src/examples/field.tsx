import { Field, Input, Stack, Switch } from "@lettuceai/crisp";
import { useState } from "react";

export default function FieldExample() {
  const [on, setOn] = useState(true);
  return (
    <Stack gap={4} className="w-full max-w-sm">
      <Field label="Display name" hint="Shown to other people.">
        <Input defaultValue="Ada" />
      </Field>
      <Field label="Email" error="Enter a valid address." required>
        <Input defaultValue="ada@" />
      </Field>
      <Field label="Public profile" inline>
        <Switch checked={on} onChange={setOn} />
      </Field>
    </Stack>
  );
}
