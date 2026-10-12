import { useState } from "react";
import { Home, Library, MessageSquare } from "lucide-react";
import { Dock } from "@lettuceai/crisp";

const items = [
  { id: "home", icon: <Home size={18} />, label: "Home" },
  { id: "library", icon: <Library size={18} />, label: "Library" },
  { id: "chats", icon: <MessageSquare size={18} />, label: "Chats" },
] as const;

export default function DockExample() {
  const [value, setValue] = useState<string>("home");
  return <Dock items={items} value={value} onChange={setValue} onCreate={() => {}} createLabel="New" />;
}
