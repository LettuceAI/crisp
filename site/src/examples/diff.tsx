import { Diff } from "@lettuceai/crisp";

const before = "Name: Ada\nRole: Mathematician\nTone: formal\nLanguage: English";
const after = "Name: Ada Lovelace\nRole: Mathematician\nTone: warm\nLanguage: English\nMemory: on";

export default function DiffExample() {
  return (
    <div className="w-full max-w-lg">
      <Diff before={before} after={after} beforeLabel="This device" afterLabel="Synced" />
    </div>
  );
}
