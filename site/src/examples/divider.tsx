import { Divider, Flex, Stack, Text } from "@lettuceai/crisp";

export default function DividerExample() {
  return (
    <Stack gap={4} className="w-full max-w-sm">
      <Text variant="secondary">Above</Text>
      <Divider />
      <Text variant="secondary">Below</Text>
      <Divider label="or" spacing="md" />
      <Flex align="center" gap={3} className="h-8">
        <Text variant="hint">Left</Text>
        <Divider orientation="vertical" />
        <Text variant="hint">Right</Text>
      </Flex>
    </Stack>
  );
}
