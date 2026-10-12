import { Button, Surface, Text } from "@lettuceai/crisp";

export default function SurfaceExample() {
  return (
    <Surface tint="linear-gradient(135deg, #f9d976, #f39f86)" fg="#2a1b0a" className="w-full max-w-sm rounded-2xl p-5">
      <Text variant="title" className="text-fg">Warm gradient</Text>
      <Text variant="secondary" className="text-fg-2">Every Crisp component inside re-colors itself from the surface.</Text>
      <div className="mt-3"><Button>Action</Button></div>
    </Surface>
  );
}
