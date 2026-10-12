import { Home, Settings, Sun } from "lucide-react";
import { Button, CommandPalette, Kbd, useCommandPalette } from "@lettuceai/crisp";

export default function CommandPaletteExample() {
  const { open, setOpen } = useCommandPalette();
  return (
    <>
      <Button onClick={() => setOpen(true)} trailing={<span className="flex gap-1"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></span>}>Open palette</Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        commands={[
          { id: "home", label: "Go home", group: "Navigate", icon: <Home size={16} />, onRun: () => {} },
          { id: "settings", label: "Open settings", description: "Appearance, models, sync", group: "Navigate", icon: <Settings size={16} />, keywords: "preferences", onRun: () => {} },
          { id: "theme", label: "Toggle theme", group: "Actions", icon: <Sun size={16} />, shortcut: "T", onRun: () => {} },
        ]}
      />
    </>
  );
}
