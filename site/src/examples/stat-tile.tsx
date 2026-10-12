import { Zap } from "lucide-react";
import { Grid, KeyValue, Sparkline, StatTile, Stack } from "@lettuceai/crisp";

export default function StatTileExample() {
  return (
    <Stack gap={4} className="w-full max-w-lg">
      <Grid columns={2} gap={3}>
        <StatTile label="Tokens today" value="12.4k" trend={{ value: 18, direction: "up" }} icon={<Zap size={16} />} sub={<Sparkline data={[3, 5, 4, 8, 7, 11, 12]} />} />
        <StatTile label="Error rate" value="0.4%" trend={{ value: 8, direction: "down" }} goodDirection="down" highlight />
      </Grid>
      <KeyValue items={[{ label: "Model", value: "Gemma 3 4B" }, { label: "Context", value: "128k" }, { label: "Quantization", value: "Q4_K_M" }]} />
    </Stack>
  );
}
