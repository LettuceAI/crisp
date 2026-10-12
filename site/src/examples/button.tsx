import { Button, Stack } from "@lettuceai/crisp";

export default function ButtonExample() {
  return (
    <Stack gap={3} className="items-center">
      <Button variant="primary">Primary</Button>
      <Button>Secondary</Button>
    </Stack>
  );
}
