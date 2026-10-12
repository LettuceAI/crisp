import { Check, RefreshCw, Upload } from "lucide-react";
import { Timeline } from "@lettuceai/crisp";

export default function TimelineExample() {
  return (
    <div className="w-full max-w-sm">
      <Timeline
        items={[
          { id: "1", title: "Memory updated", description: "3 facts added", time: "2 min ago", icon: <Check size={12} />, tone: "accent" },
          { id: "2", title: "Syncing", description: "Uploading changes", time: "now", icon: <RefreshCw size={12} />, tone: "info", active: true },
          { id: "3", title: "Backup queued", time: "later", icon: <Upload size={12} /> },
        ]}
      />
    </div>
  );
}
