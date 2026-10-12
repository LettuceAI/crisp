import { useMounted } from "../mounted";
import {
  Alert, Badge, Box, Button, Card, Chart, Chip, Grid, Stack, StatTile, Switch, Text, ThemeEditor, useTheme,
} from "@lettuceai/crisp";
import { useState } from "react";
import { Band, Reveal } from "./Band";

const usage = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({ day, tokens: [18, 26, 22, 38, 34, 52, 47][i], images: [4, 6, 3, 9, 7, 12, 10][i] }));

function Presets() {
  const { theme, presets, setTheme, reset } = useTheme();
  const mounted = useMounted();
  return (
    <Box className="flex flex-wrap items-center gap-2" role="group" aria-label="Theme presets">
      {presets.map((preset) => (
        <Chip key={preset.id} selected={mounted && theme.id === preset.id} onClick={() => setTheme(preset)}>
          {preset.name}
        </Chip>
      ))}
      <Button variant="ghost" size="sm" onClick={reset}>Reset</Button>
    </Box>
  );
}

function Preview() {
  const [notify, setNotify] = useState(true);
  return (
    <Card className="border border-line">
      <Stack gap={4}>
        <Box className="flex flex-wrap items-center justify-between gap-2">
          <Text variant="title">This page, live</Text>
          <Box className="flex gap-2"><Badge tone="accent" dot>Accent</Badge><Badge tone="info">Info</Badge><Badge tone="warning">Warning</Badge></Box>
        </Box>
        <Grid columns={2} gap={3}>
          <StatTile label="Requests" value="3,482" trend={{ value: 12, direction: "up" }} highlight />
          <StatTile label="Errors" value="0.4%" trend={{ value: 8, direction: "down" }} goodDirection="down" />
        </Grid>
        <Chart data={usage} x="day" series={[{ key: "tokens", label: "Tokens (k)" }, { key: "images", label: "Images" }]} height={170} />
        <Alert tone="success" title="Everything follows the palette" description="Fills, lines, focus rings and charts are derived from the colors you pick." />
        <Box className="flex flex-wrap items-center justify-between gap-3">
          <Box className="flex items-center gap-2"><Switch checked={notify} onChange={setNotify} aria-label="Notifications" /><Text variant="label">Notifications</Text></Box>
          <Box className="flex gap-2"><Button variant="primary">Save</Button><Button>Cancel</Button></Box>
        </Box>
      </Stack>
    </Card>
  );
}

export function ThemeSection() {
  return (
    <Band
      id="theme"
      eyebrow="Theming"
      title="Change one color. The page follows."
      lead="Crisp derives text tiers, fills, lines and chart colors from a handful of palette values. The editor below writes straight to this document, so everything you are looking at repaints with it."
    >
      <Reveal>
        <Stack gap={4}>
          <Presets />
          <Box className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <ThemeEditor />
            <Preview />
          </Box>
        </Stack>
      </Reveal>
    </Band>
  );
}
