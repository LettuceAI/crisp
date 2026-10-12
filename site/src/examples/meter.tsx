import { Meter, Stack } from "@lettuceai/crisp";

export default function MeterExample() {
  return (
    <Stack gap={4} className="w-full max-w-sm">
      <Meter label="Context" valueLabel="40k / 128k" value={40} max={128} />
      <Meter label="Context" valueLabel="100k / 128k" value={100} max={128} />
      <Meter label="Context" valueLabel="123k / 128k" value={123} max={128} />
    </Stack>
  );
}
