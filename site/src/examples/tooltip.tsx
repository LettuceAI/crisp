import { Settings, Trash2 } from "lucide-react";
import { Flex, IconButton, Tooltip } from "@lettuceai/crisp";

export default function TooltipExample() {
  return (
    <Flex gap={3}>
      <Tooltip content="Settings"><IconButton label="Settings"><Settings size={18} /></IconButton></Tooltip>
      <Tooltip content="Delete forever" placement="bottom"><IconButton label="Delete"><Trash2 size={18} /></IconButton></Tooltip>
    </Flex>
  );
}
