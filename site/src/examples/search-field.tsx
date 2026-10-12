import { useState } from "react";
import { SearchField } from "@lettuceai/crisp";

export default function SearchFieldExample() {
  const [value, setValue] = useState("");
  return (
    <div className="w-full max-w-sm">
      <SearchField value={value} onChange={setValue} shortcut="/" placeholder="Search characters" aria-label="Search characters" />
    </div>
  );
}
