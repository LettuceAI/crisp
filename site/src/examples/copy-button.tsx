import { CopyButton, Flex } from "@lettuceai/crisp";

export default function CopyButtonExample() {
  return (
    <Flex gap={3} align="center" className="justify-center">
      <CopyButton value="bun add @lettuceai/crisp" />
      <CopyButton value="bun add @lettuceai/crisp" variant="primary">Copy install command</CopyButton>
    </Flex>
  );
}
