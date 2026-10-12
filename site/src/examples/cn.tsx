import { useState } from "react";
import { Button, cn } from "@lettuceai/crisp";

export default function CnExample() {
  const [active, setActive] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <Button onClick={() => setActive(!active)} className={cn("transition-colors", active && "border-accent text-accent", "px-4 px-6")}>
        {active ? "Active" : "Inactive"}
      </Button>
      <code className="text-xs text-fg-3">{cn("px-4 px-6", active && "text-accent", { "font-bold": active })}</code>
    </div>
  );
}
