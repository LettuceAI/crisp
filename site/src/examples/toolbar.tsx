import { Bold, Italic, Link, Underline } from "lucide-react";
import { IconButton, Toolbar, ToolbarGroup, ToolbarSeparator } from "@lettuceai/crisp";

export default function ToolbarExample() {
  return (
    <Toolbar aria-label="Formatting" variant="floating">
      <ToolbarGroup>
        <IconButton label="Bold"><Bold size={16} /></IconButton>
        <IconButton label="Italic"><Italic size={16} /></IconButton>
        <IconButton label="Underline"><Underline size={16} /></IconButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <IconButton label="Link"><Link size={16} /></IconButton>
    </Toolbar>
  );
}
