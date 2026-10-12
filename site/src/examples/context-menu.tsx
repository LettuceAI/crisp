import { Copy, Pin, Trash2 } from "lucide-react";
import { ContextMenu, MenuItem, MenuSeparator } from "@lettuceai/crisp";

export default function ContextMenuExample() {
  return (
    <ContextMenu
      menu={
        <>
          <MenuItem icon={<Pin size={16} />} onSelect={() => {}}>Pin</MenuItem>
          <MenuItem icon={<Copy size={16} />} onSelect={() => {}}>Copy</MenuItem>
          <MenuSeparator />
          <MenuItem icon={<Trash2 size={16} />} danger onSelect={() => {}}>Delete</MenuItem>
        </>
      }
    >
      <div className="flex h-28 w-64 items-center justify-center rounded-xl border border-dashed border-line-3 text-sm text-fg-2">
        Right-click or long-press here
      </div>
    </ContextMenu>
  );
}
