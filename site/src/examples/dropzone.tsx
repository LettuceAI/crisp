import { useState } from "react";
import { Dropzone, Text } from "@lettuceai/crisp";

export default function DropzoneExample() {
  const [names, setNames] = useState<string[]>([]);
  return (
    <div className="w-full max-w-sm space-y-2">
      <Dropzone accept="image/*" multiple maxSize={5_000_000} onFiles={(files) => setNames(files.map((file) => file.name))} hint="PNG or JPG, up to 5 MB" />
      {names.length > 0 && <Text variant="hint">Received: {names.join(", ")}</Text>}
    </div>
  );
}
