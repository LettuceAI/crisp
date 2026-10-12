import { Grid, Stack, Text } from "@lettuceai/crisp";

const cell = "rounded-lg bg-fill-3 p-3 text-center text-sm text-fg-2";

export default function GridExample() {
  return (
    <Stack gap={5} className="w-full">
      <Stack gap={2}>
        <Text variant="label">columns responsive: 1, then 2, then 4</Text>
        <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={3}>
          {[1, 2, 3, 4].map((n) => <div key={n} className={cell}>{n}</div>)}
        </Grid>
      </Stack>
      <Stack gap={2}>
        <Text variant="label">minChildWidth flows on its own</Text>
        <Grid minChildWidth="8rem" gap={3}>
          {[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className={cell}>{n}</div>)}
        </Grid>
      </Stack>
    </Stack>
  );
}
