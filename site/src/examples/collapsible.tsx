import { Badge, Collapsible, Stack, Text } from "@lettuceai/crisp";

export default function CollapsibleExample() {
  return (
    <Stack gap={3} className="w-full max-w-md">
      <Collapsible title="Advanced settings" description="Sampling and limits" trailing={<Badge>3</Badge>}>
        <Text variant="secondary">Temperature, top-p and max tokens live here.</Text>
      </Collapsible>
      <Collapsible title="Plain variant" variant="plain" defaultOpen>
        <Text variant="secondary">Just the toggle and its content.</Text>
      </Collapsible>
    </Stack>
  );
}
