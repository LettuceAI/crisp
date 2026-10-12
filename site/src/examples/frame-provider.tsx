import { useState } from "react";
import { Button, FrameProvider, Sheet } from "@lettuceai/crisp";

export default function FrameProviderExample() {
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <div ref={setPortal} className="relative h-72 w-64 overflow-hidden rounded-3xl border-8 border-surface-2 bg-surface transform-[translateZ(0)]">
      <FrameProvider portal={portal} compact>
        <div className="flex h-full items-center justify-center">
          <Button onClick={() => setOpen(true)}>Open sheet in frame</Button>
        </div>
        <Sheet open={open} onClose={() => setOpen(false)} title="Inside the frame">
          <p className="text-sm text-fg-2">The sheet portals to the frame, not the page.</p>
        </Sheet>
      </FrameProvider>
    </div>
  );
}
