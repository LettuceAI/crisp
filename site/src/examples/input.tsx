import { Mail, Search } from "lucide-react";
import { Input, Stack, Textarea } from "@lettuceai/crisp";

export default function InputExample() {
  return (
    <Stack gap={3} className="w-full max-w-sm">
      <Input placeholder="Plain input" aria-label="Plain input" />
      <Input placeholder="Search" aria-label="Search" leading={<Search size={16} />} />
      <Input placeholder="you@example.com" aria-label="Email" leading={<Mail size={16} />} trailing={<span className="text-xs text-fg-3">required</span>} />
      <Textarea autoGrow rows={2} placeholder="A textarea that grows with its text" aria-label="Notes" />
    </Stack>
  );
}
