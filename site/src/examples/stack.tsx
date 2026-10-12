import { HStack, Stack, VStack } from "@lettuceai/crisp";

const cell = "rounded-lg bg-fill-3 px-3 py-2 text-sm text-fg-2";

export default function StackExample() {
  return (
    <HStack gap={6} align="start" className="w-full max-w-md justify-center">
      <Stack gap={2} className="w-32">
        <div className={cell}>Stack</div>
        <div className={cell}>gap 2</div>
      </Stack>
      <VStack gap={2} className="w-32">
        <div className={cell}>VStack</div>
        <div className={cell}>same</div>
      </VStack>
      <HStack gap={2}>
        <div className={cell}>HStack</div>
        <div className={cell}>row</div>
      </HStack>
    </HStack>
  );
}
