import { useState } from "react";
import { Cloud, Cpu } from "lucide-react";
import { Badge, ChoiceCard, Grid } from "@lettuceai/crisp";

export default function ChoiceCardExample() {
  const [choice, setChoice] = useState("local");
  return (
    <Grid columns={{ base: 1, sm: 2 }} gap={3} className="w-full max-w-xl">
      <ChoiceCard layout="stack" selected={choice === "local"} onClick={() => setChoice("local")} icon={<Cpu size={18} />} title="On this device" description="Private and offline." meta={<Badge tone="accent">Free</Badge>} />
      <ChoiceCard layout="stack" selected={choice === "cloud"} onClick={() => setChoice("cloud")} icon={<Cloud size={18} />} title="In the cloud" description="Larger models, needs a key." />
    </Grid>
  );
}
