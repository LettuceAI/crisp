import { CodeBlock, Stack } from "@lettuceai/crisp";

export default function CodeBlockExample() {
  return (
    <Stack gap={3} className="w-full max-w-lg">
      <CodeBlock label="Terminal" code="bun add @lettuceai/crisp" />
      <CodeBlock label="prompt.txt" lineNumbers wrap code={"You are a helpful assistant.\nAnswer in one short paragraph.\nNever invent a source."} />
    </Stack>
  );
}
