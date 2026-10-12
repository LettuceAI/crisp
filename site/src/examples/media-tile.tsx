import { useState } from "react";
import { Grid, MediaTile, MediaTileSkeleton } from "@lettuceai/crisp";

const art = (hue: number) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 70% 55%)"/><stop offset="1" stop-color="hsl(${hue + 60} 70% 35%)"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/></svg>`)}`;

export default function MediaTileExample() {
  const [selected, setSelected] = useState(0);
  return (
    <Grid columns={4} gap={2} className="w-full max-w-md">
      {[20, 140, 220].map((hue, i) => (
        <MediaTile key={hue} src={art(hue)} alt={`Image ${i + 1}`} kind={i === 0 ? "Avatar" : undefined} variantCount={i === 1 ? 3 : undefined} selected={selected === i} onClick={() => setSelected(i)} />
      ))}
      <MediaTileSkeleton />
    </Grid>
  );
}
