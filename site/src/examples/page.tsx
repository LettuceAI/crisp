import { useState } from "react";
import { ActionBar, Button, Page, Text } from "@lettuceai/crisp";

export default function PageExample() {
  const [query, setQuery] = useState("");
  return (
    <div className="h-96 w-full overflow-hidden rounded-xl border border-line">
      <Page
        title="Characters"
        meta="48"
        onBack={() => {}}
        searchValue={query}
        onSearchChange={setQuery}
        footer={<ActionBar onBack={() => {}} primary={<Button variant="primary">Save</Button>} pinned={false} />}
      >
        <div className="space-y-2">
          {Array.from({ length: 8 }, (_, i) => (
            <Text key={i} variant="secondary">Row {i + 1}{query && ` matching "${query}"`}</Text>
          ))}
        </div>
      </Page>
    </div>
  );
}
