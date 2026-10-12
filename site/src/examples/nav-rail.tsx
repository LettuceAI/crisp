import { useState } from "react";
import { Home, Library, MessageSquare, Settings } from "lucide-react";
import { NavRail } from "@lettuceai/crisp";

const items = [
  { id: "home", icon: <Home size={18} />, label: "Home" },
  { id: "library", icon: <Library size={18} />, label: "Library" },
  { id: "chats", icon: <MessageSquare size={18} />, label: "Chats" },
] as const;

export default function NavRailExample() {
  const [value, setValue] = useState<string>("home");
  const [open, setOpen] = useState(true);
  return (
    <div className="h-80 overflow-hidden rounded-xl border border-line">
      <NavRail
        items={items}
        value={value}
        onChange={setValue}
        onCreate={() => {}}
        createLabel="New chat"
        footerItems={[{ id: "settings", icon: <Settings size={18} />, label: "Settings" }]}
        variant={open ? "sidebar" : "rail"}
        onToggle={() => setOpen(!open)}
      />
    </div>
  );
}
