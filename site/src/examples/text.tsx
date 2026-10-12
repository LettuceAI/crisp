import { Stack, Text } from "@lettuceai/crisp";

export default function TextExample() {
  return (
    <Stack gap={2} className="w-full max-w-lg">
      <Text variant="display" as="div">Display</Text>
      <Text variant="page" as="div">Page title</Text>
      <Text variant="section">Section heading</Text>
      <Text variant="title">Card or row title</Text>
      <Text variant="body">Body text, the default.</Text>
      <Text variant="secondary">Secondary supporting copy.</Text>
      <Text variant="label">Label</Text>
      <Text variant="hint">Hint and meta text.</Text>
      <Text variant="caption">Caption: timestamps and counts</Text>
    </Stack>
  );
}
