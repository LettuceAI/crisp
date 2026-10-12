import { Copy, Pencil, Trash2 } from "lucide-react";
import { Button, Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "@lettuceai/crisp";

export default function MenuExample() {
  return (
    <Menu>
      <MenuTrigger><Button>Actions</Button></MenuTrigger>
      <MenuContent>
        <MenuLabel>Message</MenuLabel>
        <MenuItem icon={<Pencil size={16} />} shortcut="E" onSelect={() => {}}>Edit</MenuItem>
        <MenuItem icon={<Copy size={16} />} shortcut="C" onSelect={() => {}}>Copy</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash2 size={16} />} danger onSelect={() => {}}>Delete</MenuItem>
      </MenuContent>
    </Menu>
  );
}
