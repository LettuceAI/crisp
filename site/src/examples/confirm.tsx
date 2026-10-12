import { useState } from "react";
import { Button, Text, confirm } from "@lettuceai/crisp";

export default function ConfirmExample() {
  const [result, setResult] = useState<string>("");
  const ask = async () => {
    const ok = await confirm({
      title: "Delete this chat?",
      message: "The messages are removed from this device and cannot be recovered.",
      confirmLabel: "Delete chat",
      destructive: true,
    });
    setResult(ok ? "Confirmed" : "Cancelled");
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="danger" onClick={ask}>Delete chat</Button>
      {result && <Text variant="hint">{result}</Text>}
    </div>
  );
}
