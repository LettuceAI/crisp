import { Scale, Stack } from "@lettuceai/crisp";

export default function ScaleExample() {
  return (
    <Stack gap={4} className="w-full max-w-sm">
      <Scale label="Closeness" value={0.46} min={-1} max={1} reference={0.1} referenceLabel="Default" />
      <Scale label="Affection" value={-0.3} min={-1} max={1} reference={0.05} referenceLabel="Default" />
      <Scale label="Tension" value={0.22} tone="warning" reference={0} referenceLabel="Default" />
      <Scale label="Warmth" value={0.72} size="md" />
    </Stack>
  );
}
