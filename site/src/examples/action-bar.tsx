import { Button, ActionBar, Text } from "@lettuceai/crisp";

export default function ActionBarExample() {
  return (
    <div className="w-full max-w-lg">
      <ActionBar
        pinned={false}
        leading={<Text variant="hint">3 changes</Text>}
        onBack={() => {}}
        secondary={<Button variant="ghost">Save draft</Button>}
        primary={<Button variant="primary">Publish</Button>}
      />
    </div>
  );
}
