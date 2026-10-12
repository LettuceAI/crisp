import { useState } from "react";
import { ColorPicker } from "@lettuceai/crisp";

export default function ColorPickerExample() {
  const [color, setColor] = useState("#65c789");
  return <ColorPicker value={color} onChange={setColor} />;
}
