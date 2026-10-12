import { useState } from "react";
import { AvatarPicker } from "@lettuceai/crisp";

export default function AvatarPickerExample() {
  const [value, setValue] = useState<string | null>(null);
  return <AvatarPicker value={value} onChange={setValue} name="Ada" size="xl" output={256} />;
}
