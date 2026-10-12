import { useState } from "react";
import { TagInput } from "@lettuceai/crisp";

export default function TagInputExample() {
  const [tags, setTags] = useState(["sci-fi", "mystery"]);
  return (
    <div className="w-full max-w-sm">
      <TagInput value={tags} onChange={setTags} max={6} placeholder="Add a tag and press Enter" aria-label="Tags" />
    </div>
  );
}
