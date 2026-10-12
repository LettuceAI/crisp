import { useState } from "react";
import { Panel, Stack, Switch, Text } from "@lettuceai/crisp";

export default function PanelExample() {
  const [on, setOn] = useState(true);
  return (
    <Stack gap={3} className="w-full max-w-md">
      <Panel title="Memory" description="Keep what matters from each chat." action={<Switch checked={on} onChange={setOn} aria-label="Memory" />}>
        <Text variant="hint">Controls and content live inside the region.</Text>
      </Panel>
      <Panel tone="accent" title="Accent tone"><Text variant="hint">Tones tint the border and fill.</Text></Panel>
      <Panel tone="warning" title="Warning tone"><Text variant="hint">For things to watch.</Text></Panel>
    </Stack>
  );
}
