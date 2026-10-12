import { HStack, Spacer, Text, Button } from "@lettuceai/crisp";

export default function SpacerExample() {
  return (
    <HStack className="w-full max-w-md rounded-xl border border-line p-3">
      <Text variant="title">Title</Text>
      <Spacer />
      <Button size="sm">Action</Button>
    </HStack>
  );
}
