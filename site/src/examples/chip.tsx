import { useState } from "react";
import { Chip, Flex } from "@lettuceai/crisp";

export default function ChipExample() {
  const [on, setOn] = useState(["sci-fi"]);
  const [tags, setTags] = useState(["draft", "shared"]);
  const toggle = (id: string) => setOn((all) => (all.includes(id) ? all.filter((x) => x !== id) : [...all, id]));
  return (
    <Flex gap={2} wrap className="justify-center">
      {["sci-fi", "fantasy", "slice of life"].map((id) => (
        <Chip key={id} selected={on.includes(id)} onClick={() => toggle(id)}>{id}</Chip>
      ))}
      {tags.map((tag) => (
        <Chip key={tag} onRemove={() => setTags((all) => all.filter((x) => x !== tag))}>{tag}</Chip>
      ))}
    </Flex>
  );
}
