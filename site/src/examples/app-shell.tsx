import { useState } from "react";
import { Home, Library, MessageSquare, Settings } from "lucide-react";
import { AppShell, Text } from "@lettuceai/crisp";

const items = [
  { id: "home", icon: <Home size={18} />, label: "Home" },
  { id: "library", icon: <Library size={18} />, label: "Library" },
  { id: "chats", icon: <MessageSquare size={18} />, label: "Chats", badge: 2 },
  { id: "settings", icon: <Settings size={18} />, label: "Settings" },
] as const;

export default function AppShellExample() {
  const [value, setValue] = useState<(typeof items)[number]["id"]>("home");
  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border border-line">
      <AppShell items={items} value={value} onChange={setValue} onCreate={() => setValue("chats")} createLabel="New chat">
        <div className="p-4">
          <Text variant="section">{items.find((item) => item.id === value)?.label}</Text>
          <Text variant="hint">Resize the window: a rail on desktop, a tab bar on a phone.</Text>
        </div>
      </AppShell>
    </div>
  );
}
