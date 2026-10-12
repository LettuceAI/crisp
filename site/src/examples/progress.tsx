import { Progress, Stack } from "@lettuceai/crisp";

export default function ProgressExample() {
  return (
    <Stack gap={4} className="w-full max-w-sm">
      <Progress value={64} label="Downloading" />
      <Progress label="Indexing" />
      <Progress value={30} tone="warning" size="sm" label="Low" />
    </Stack>
  );
}
