import { Container, Stack } from "@lettuceai/crisp";

export default function ContainerExample() {
  return (
    <Stack gap={3} className="w-full">
      {(["sm", "md", "prose"] as const).map((size) => (
        <Container key={size} size={size} className="rounded-lg bg-fill-2 py-2 text-center text-sm text-fg-2">
          size="{size}"
        </Container>
      ))}
    </Stack>
  );
}
