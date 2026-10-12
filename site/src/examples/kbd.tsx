import { Kbd } from "@lettuceai/crisp";

export default function KbdExample() {
  return (
    <p className="text-sm text-fg-2">
      Press <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> to open the palette, or <Kbd>Esc</Kbd> to close it.
    </p>
  );
}
