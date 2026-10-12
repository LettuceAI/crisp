import { IconButton, VisuallyHidden } from "@lettuceai/crisp";
import { Heart } from "lucide-react";

export default function VisuallyHiddenExample() {
  return (
    <div className="flex items-center gap-3">
      <IconButton label="Like" variant="secondary">
        <Heart size={16} />
      </IconButton>
      <span className="text-sm text-fg-2">
        12
        <VisuallyHidden> people liked this</VisuallyHidden>
      </span>
    </div>
  );
}
