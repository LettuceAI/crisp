import { useState } from "react";
import { File, Folder } from "lucide-react";
import { Tree } from "@lettuceai/crisp";

export default function TreeExample() {
  const [selected, setSelected] = useState("readme");
  return (
    <div className="w-full max-w-xs">
      <Tree
        selectedId={selected}
        onSelect={setSelected}
        defaultExpanded={["src"]}
        nodes={[
          { id: "src", label: "src", icon: <Folder size={14} />, children: [{ id: "app", label: "App.tsx", icon: <File size={14} /> }, { id: "main", label: "main.tsx", icon: <File size={14} /> }] },
          { id: "readme", label: "README.md", icon: <File size={14} />, trailing: <span className="text-xs text-fg-3">2 KB</span> },
        ]}
      />
    </div>
  );
}
