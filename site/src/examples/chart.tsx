import { Chart, Stack, Sparkline } from "@lettuceai/crisp";

const data = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({ day, tokens: [18, 26, 22, 38, 34, 52, 47][i], images: [4, 6, 3, 9, 7, 12, 10][i] }));

export default function ChartExample() {
  return (
    <Stack gap={5} className="w-full max-w-lg">
      <Chart data={data} x="day" series={[{ key: "tokens", label: "Tokens (k)" }, { key: "images", label: "Images" }]} format={(v) => `${v}`} />
      <Chart data={data} x="day" kind="bar" height={160} series={[{ key: "tokens", label: "Tokens (k)" }]} />
      <Sparkline data={[3, 5, 4, 8, 7, 11, 12, 9, 14]} height={40} />
    </Stack>
  );
}
