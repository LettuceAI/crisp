import { useState } from "react";
import { Home, Library, MessageSquare, Settings } from "lucide-react";
import { TabBar } from "@lettuceai/crisp";

const items = [
  { id: "home", icon: <Home size={20} />, label: "Home" },
  { id: "library", icon: <Library size={20} />, label: "Library" },
  { id: "chats", icon: <MessageSquare size={20} />, label: "Chats", badge: 3 },
  { id: "settings", icon: <Settings size={20} />, label: "Settings", badge: true },
] as const;

export default function TabBarExample() {
  const [value, setValue] = useState<string>("home");
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-line">
      <TabBar items={items} value={value} onChange={setValue} showLabels className="static" />
    </div>
  );
}
