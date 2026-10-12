import { useState } from "react";
import { Grid, MediaCard, MediaCardSkeleton } from "@lettuceai/crisp";

export default function MediaCardExample() {
  const [selected, setSelected] = useState("Ada");
  return (
    <Grid columns={3} gap={3} className="w-full max-w-lg">
      {[["Ada", "Mathematician", "accent"], ["Alan", "Codebreaker", "info"]].map(([name, description, tone]) => (
        <MediaCard key={name} title={name} description={description} kind="Character" tone={tone as "accent" | "info"} meta="12" selected={selected === name} onClick={() => setSelected(name)} />
      ))}
      <MediaCardSkeleton />
    </Grid>
  );
}
