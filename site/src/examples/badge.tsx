import { Badge, Flex } from "@lettuceai/crisp";

export default function BadgeExample() {
  return (
    <Flex gap={2} wrap className="justify-center">
      <Badge>Neutral</Badge>
      <Badge tone="accent" dot>Online</Badge>
      <Badge tone="info">Info</Badge>
      <Badge tone="warning">Beta</Badge>
      <Badge tone="danger">Error</Badge>
      <Badge tone="secondary">New</Badge>
    </Flex>
  );
}
