import { useState } from "react";
import { GitBranch, MessageSquare } from "lucide-react";
import { Badge, ConnectedTree, icon } from "@lettuceai/crisp";

export default function ConnectedTreeExample() {
  const [current, setCurrent] = useState("fight");
  const leaf = (id: string, title: string, description: string) => ({
    id,
    title,
    description,
    icon: <GitBranch size={icon.md} />,
    current: current === id,
    badge: current === id ? <Badge tone="accent">Current</Badge> : undefined,
    onSelect: () => setCurrent(id),
  });
  return (
    <div className="w-full max-w-md">
      <ConnectedTree
        aria-label="Branches"
        nodes={[
          {
            id: "harbour",
            title: "Harbour",
            description: "42 messages",
            icon: <MessageSquare size={icon.md} />,
            onSelect: () => undefined,
            children: [
              {
                id: "original",
                title: "Original",
                description: "16 messages",
                icon: <GitBranch size={icon.md} />,
                children: [leaf("fight", "Dock fight", "3 messages"), leaf("storm", "Storm", "2 messages")],
              },
              { id: "lighthouse", title: "Lighthouse", description: "9 messages", icon: <MessageSquare size={icon.md} />, onSelect: () => undefined },
            ],
          },
        ]}
      />
    </div>
  );
}
