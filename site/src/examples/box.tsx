import { Box } from "@lettuceai/crisp";

export default function BoxExample() {
  return (
    <Box className="w-full max-w-sm rounded-xl border border-line bg-surface-1 p-4">
      <Box as="h3" className="text-lg font-semibold text-fg">A div by default</Box>
      <Box as="p" className="mt-1 text-sm text-fg-3">Pass as to render any element, and className for styling.</Box>
      <Box as="a" href="#example" className="mt-3 inline-block text-sm text-accent underline underline-offset-2">I am an anchor</Box>
    </Box>
  );
}
