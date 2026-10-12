import { Flex } from "@lettuceai/crisp";

const cell = "rounded-lg bg-fill-3 px-3 py-2 text-sm text-fg-2";

export default function FlexExample() {
  return (
    <Flex direction="column" gap={3} className="w-full max-w-md">
      <Flex gap={2} justify="between" align="center" className="rounded-xl border border-line p-3">
        <Flex className={cell}>Start</Flex>
        <Flex className={cell}>Middle</Flex>
        <Flex className={cell}>End</Flex>
      </Flex>
      <Flex gap={2} wrap className="rounded-xl border border-line p-3">
        {["wraps", "when", "there", "is", "no", "more", "room", "on", "the", "row"].map((word) => (
          <Flex key={word} className={cell}>{word}</Flex>
        ))}
      </Flex>
    </Flex>
  );
}
