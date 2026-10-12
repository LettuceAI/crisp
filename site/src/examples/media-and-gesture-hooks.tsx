import { useState } from "react";
import { useCompactLayout, useLongPress, useMediaQuery } from "@lettuceai/crisp";

export default function MediaAndGestureHooksExample() {
  const compact = useCompactLayout();
  const dark = useMediaQuery("(prefers-color-scheme: dark)");
  const [held, setHeld] = useState(false);
  const { handlers } = useLongPress(() => setHeld(true), { delay: 500 });
  return (
    <div className="flex w-full max-w-sm flex-col gap-3 text-sm text-fg-2">
      <p>useCompactLayout: <strong className="text-fg">{String(compact)}</strong></p>
      <p>useMediaQuery(prefers-color-scheme: dark): <strong className="text-fg">{String(dark)}</strong></p>
      <button type="button" {...handlers} onClick={() => setHeld(false)} className="touch-target rounded-xl border border-line bg-fill-2 px-4 py-3 text-fg">
        {held ? "Held. Tap to reset" : "Press and hold"}
      </button>
    </div>
  );
}
