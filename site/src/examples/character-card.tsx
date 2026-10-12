import { Badge, CharacterCard, CharacterCardSkeleton, Stack } from "@lettuceai/crisp";

export default function CharacterCardExample() {
  return (
    <Stack gap={3} className="w-full max-w-md">
      <CharacterCard name="Ada Lovelace" description="Analytical engine enthusiast" trailing={<Badge tone="accent">New</Badge>} />
      <CharacterCard variant="banner" name="Grace Hopper" description="Compiler pioneer" gradient="linear-gradient(135deg, #1d4ed8, #7c3aed)" fg="#ffffff" fgMuted="rgba(255,255,255,0.72)" />
      <CharacterCardSkeleton />
    </Stack>
  );
}
