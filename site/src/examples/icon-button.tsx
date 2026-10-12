import { Heart, Settings, Share2, Trash2 } from "lucide-react";
import { Flex, IconButton } from "@lettuceai/crisp";

export default function IconButtonExample() {
  return (
    <Flex gap={3} align="center" wrap className="justify-center">
      <IconButton label="Settings"><Settings size={18} /></IconButton>
      <IconButton label="Like" variant="secondary"><Heart size={18} /></IconButton>
      <IconButton label="Share" variant="tonal" shape="round"><Share2 size={18} /></IconButton>
      <IconButton label="Delete" active><Trash2 size={18} /></IconButton>
      <IconButton label="Small" size="sm"><Settings size={14} /></IconButton>
    </Flex>
  );
}
