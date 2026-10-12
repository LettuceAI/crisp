import { useState, type ReactNode } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import {
  AvatarGroup, Badge, Box, Card, Checkbox, Chip, ColorPicker, Grid, Kbd, Meter, NumberInput, OtpInput, Pagination, Progress, Segmented,
  Skeleton, Slider, Spinner, Stepper, Switch, Tabs, TabList, Tab, TabPanel, TagInput, Text, ToggleGroup,
} from "@lettuceai/crisp";
import { Band, Reveal } from "./Band";

function Tile({ label, children, delay }: { label: string; children: ReactNode; delay: number }) {
  return (
    <Reveal delay={delay}>
      <Card className="h-full border border-line">
        <Box className="flex h-full flex-col gap-3">
          <Text variant="caption" className="font-medium uppercase tracking-[0.14em]">{label}</Text>
          <Box className="flex flex-1 flex-col justify-center gap-3">{children}</Box>
        </Box>
      </Card>
    </Reveal>
  );
}

export function Wall() {
  const [on, setOn] = useState(true);
  const [level, setLevel] = useState(40);
  const [view, setView] = useState("grid");
  const [checked, setChecked] = useState(true);
  const [fmt, setFmt] = useState<string[]>(["bold"]);
  const [tags, setTags] = useState(["react", "tailwind"]);
  const [n, setN] = useState(4);
  const [otp, setOtp] = useState("");
  const [page, setPage] = useState(3);
  const [color, setColor] = useState("#65c789");
  const [tab, setTab] = useState("one");
  const [chips, setChips] = useState(["a"]);
  const toggle = (id: string) => setChips((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const tiles: [string, ReactNode][] = [
    ["Switch and checkbox", <><Switch checked={on} onChange={setOn} aria-label="Enabled" /><Checkbox checked={checked} onChange={setChecked} label="Remember me" /></>],
    ["Slider", <Slider value={level} onChange={setLevel} showValue={(v) => `${v}%`} />],
    ["Segmented", <Segmented aria-label="View" value={view} onChange={setView} options={[{ value: "grid", label: "Grid" }, { value: "list", label: "List" }, { value: "table", label: "Table" }]} />],
    ["Toggle group", <ToggleGroup aria-label="Text style" value={fmt} onChange={setFmt} options={[{ value: "bold", label: <Bold size={16} /> }, { value: "italic", label: <Italic size={16} /> }, { value: "underline", label: <Underline size={16} /> }]} />],
    ["Tag input", <TagInput value={tags} onChange={setTags} placeholder="Add a tag" />],
    ["Number input", <NumberInput value={n} onChange={setN} min={0} max={20} suffix="runs" />],
    ["One-time code", <OtpInput length={4} value={otp} onChange={setOtp} />],
    ["Pagination", <Pagination page={page} pageCount={9} onChange={setPage} />],
    ["Color", <ColorPicker value={color} onChange={setColor} />],
    ["Tabs", <Tabs value={tab} onChange={setTab}><TabList aria-label="Demo tabs"><Tab value="one">Overview</Tab><Tab value="two">Usage</Tab></TabList><TabPanel value="one" className="pt-3 text-sm text-fg-2">One tab stop, arrow keys between tabs.</TabPanel><TabPanel value="two" className="pt-3 text-sm text-fg-2">Panels mount only when shown.</TabPanel></Tabs>],
    ["Chips", <Box className="flex flex-wrap gap-2">{["a", "b", "c"].map((id) => <Chip key={id} selected={chips.includes(id)} onClick={() => toggle(id)}>Filter {id.toUpperCase()}</Chip>)}</Box>],
    ["Progress and meter", <><Progress value={64} label="Download" /><Meter label="Context" valueLabel="9 / 10" value={9} max={10} /></>],
    ["Stepper", <Stepper current={1} steps={[{ id: "a", label: "Account" }, { id: "b", label: "Model" }, { id: "c", label: "Done" }]} />],
    ["Badges and people", <><Box className="flex flex-wrap gap-2"><Badge tone="accent" dot>Live</Badge><Badge tone="warning">Beta</Badge><Badge tone="danger">Error</Badge></Box><AvatarGroup people={[{ name: "Mina" }, { name: "Joe" }, { name: "Ayo" }, { name: "Sol" }, { name: "Kai" }]} /></>],
    ["Loading", <><Box className="flex items-center gap-2"><Spinner /><Text variant="hint">Thinking</Text></Box><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></>],
    ["Shortcuts", <Box className="flex flex-wrap items-center gap-1.5"><Kbd>Ctrl</Kbd><Kbd>K</Kbd><Text variant="hint">opens the palette</Text></Box>],
  ];

  return (
    <Band
      id="wall"
      eyebrow="Everything is real"
      title="A wall of live components."
      lead="None of these are screenshots. Tap, type and drag them. Each one is keyboard reachable and ships with a phone layout."
    >
      <Grid minChildWidth="15rem" gap={4}>
        {tiles.map(([label, node], i) => (
          <Tile key={label} label={label} delay={(i % 4) * 0.05}>{node}</Tile>
        ))}
      </Grid>
    </Band>
  );
}
