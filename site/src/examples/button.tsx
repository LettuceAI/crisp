import { ArrowRight, Download } from "lucide-react";
import { Button, Flex, Stack } from "@lettuceai/crisp";

export default function ButtonExample() {
  return (
    <Stack gap={4} className="items-center">
      <Flex gap={3} wrap className="justify-center">
        <Button variant="primary">Primary</Button>
        <Button variant="tonal">Tonal</Button>
        <Button>Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </Flex>
      <Flex gap={3} wrap align="center" className="justify-center">
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button variant="primary" leading={<Download size={16} />}>With icon</Button>
        <Button variant="primary" trailing={<ArrowRight size={16} />}>Next</Button>
        <Button loading>Saving</Button>
        <Button disabled>Disabled</Button>
      </Flex>
    </Stack>
  );
}
