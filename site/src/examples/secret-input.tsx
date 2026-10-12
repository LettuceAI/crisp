import { useState } from "react";
import { SecretInput } from "@lettuceai/crisp";

export default function SecretInputExample() {
  const [value, setValue] = useState("sk-demo-1234567890");
  return (
    <div className="w-full max-w-sm">
      <SecretInput aria-label="API key" value={value} onChange={setValue} status={value ? { state: "ok", message: "Connected" } : { state: "idle" }} />
    </div>
  );
}
