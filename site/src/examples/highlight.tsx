import { useState } from "react";
import { Highlight, SearchField } from "@lettuceai/crisp";

export default function HighlightExample() {
  const [query, setQuery] = useState("crisp");
  return (
    <div className="w-full max-w-sm space-y-3">
      <SearchField value={query} onChange={setQuery} aria-label="Search" />
      <p className="text-sm text-fg-2"><Highlight query={query}>Crisp is a component library that keeps interfaces crisp.</Highlight></p>
    </div>
  );
}
