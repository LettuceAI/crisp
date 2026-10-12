import { Resizable, Text } from "@lettuceai/crisp";

export default function ResizableExample() {
  return (
    <div className="h-48 w-full overflow-hidden rounded-xl border border-line">
      <Resizable defaultSize={180} minSize={120} maxSize={320} panel={<div className="p-3"><Text variant="title">List</Text><Text variant="hint">Drag the handle or use the arrow keys.</Text></div>}>
        <div className="p-3"><Text variant="title">Inspector</Text></div>
      </Resizable>
    </div>
  );
}
