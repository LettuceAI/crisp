import { useState } from "react";
import { Plus } from "lucide-react";
import { AppBar, IconButton } from "@lettuceai/crisp";

export default function AppBarExample() {
  const [query, setQuery] = useState("");
  return (
    <div className="w-full overflow-hidden rounded-xl border border-line">
      <AppBar
        title="Library"
        meta="128 items"
        onBack={() => {}}
        searchValue={query}
        onSearchChange={setQuery}
        actions={<IconButton label="New" variant="tonal"><Plus size={18} /></IconButton>}
        className="static"
      />
    </div>
  );
}
