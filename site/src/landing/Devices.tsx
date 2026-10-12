import { useEffect, useRef, useState, type ReactNode } from "react";
import { Home, Library, MessageSquare, Settings } from "lucide-react";
import { AppShell, Box, FrameProvider, ListGroup, ListRow, Meter, StatTile, Switch, Text } from "@lettuceai/crisp";
import { Band, Reveal } from "./Band";

const items = [
  { id: "home", icon: <Home size={18} />, label: "Home" },
  { id: "library", icon: <Library size={18} />, label: "Library" },
  { id: "chats", icon: <MessageSquare size={18} />, label: "Chats", badge: 3 },
  { id: "settings", icon: <Settings size={18} />, label: "Settings" },
] as const;

type Id = (typeof items)[number]["id"];

function Screen({ id }: { id: Id }) {
  const [wifi, setWifi] = useState(true);
  const label = items.find((item) => item.id === id)!.label;
  return (
    <Box className="@container flex flex-col gap-3 p-4">
      <Text variant="section">{label}</Text>
      <Box className="grid grid-cols-1 gap-3 @lg:grid-cols-2">
        <StatTile label="Characters" value="48" sub="6 added this week" />
        <StatTile label="Memory" value="2.1 GB" sub="of 8 GB" />
      </Box>
      <Meter label="Context" valueLabel="96k / 128k" value={96} max={128} size="sm" />
      <ListGroup label="Recent">
        <ListRow title="Ada Lovelace" description="Pick up where you left off" />
        <ListRow title="Sync over Wi-Fi" trailing={<Switch checked={wifi} onChange={setWifi} aria-label="Sync over Wi-Fi" />} chevron={false} />
      </ListGroup>
    </Box>
  );
}

/** Lays a fixed-size device out at its natural size, then scales it to the column it sits in. */
function Scaled({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const read = () => setScale(Math.min(1, el.clientWidth / width));
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);
  return (
    <Box ref={wrap} className="relative w-full" style={{ aspectRatio: `${width} / ${height}`, maxWidth: width }}>
      <Box className="absolute left-0 top-0 origin-top-left" style={{ width, height, transform: `scale(${scale})` }}>
        {children}
      </Box>
    </Box>
  );
}

function Device({ kind, value, onChange }: { kind: "desktop" | "phone"; value: Id; onChange: (id: Id) => void }) {
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const phone = kind === "phone";
  return (
    <Box
      ref={setPortal}
      className={
        phone
          ? "relative h-full w-full overflow-hidden rounded-[2.75rem] border-[10px] border-surface-2 bg-surface shadow-raised ring-1 ring-line-2"
          : "relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line-2 bg-surface shadow-raised"
      }
    >
      {phone ? (
        <Box aria-hidden="true" className="absolute left-1/2 top-2 z-40 h-5 w-20 -translate-x-1/2 rounded-full bg-surface-2" />
      ) : (
        <Box aria-hidden="true" className="flex h-8 shrink-0 items-center gap-1.5 border-b border-line bg-nav px-3">
          <span className="size-2.5 rounded-full bg-danger/70" /><span className="size-2.5 rounded-full bg-warning/70" /><span className="size-2.5 rounded-full bg-accent/70" />
        </Box>
      )}
      <FrameProvider portal={portal} compact={phone}>
        <Box className={phone ? "h-full pt-8" : "min-h-0 flex-1"}>
          <AppShell items={items} value={value} onChange={onChange} className="h-full">
            <Screen id={value} />
          </AppShell>
        </Box>
      </FrameProvider>
    </Box>
  );
}

export function Devices() {
  const [value, setValue] = useState<Id>("home");
  return (
    <Band
      id="devices"
      eyebrow="One component set"
      title="Phone and desktop, same code."
      lead="This is one AppShell rendered twice. A rail and a wide layout on the desktop, a tab bar and stacked content on the phone. Tap a destination in either frame and the other follows."
    >
      <Reveal>
        <Box className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center">
          <Box className="w-full lg:flex-1">
            <Scaled width={720} height={460}><Device kind="desktop" value={value} onChange={setValue} /></Scaled>
          </Box>
          <Box className="w-full max-w-[17.5rem] shrink-0">
            <Scaled width={280} height={560}><Device kind="phone" value={value} onChange={setValue} /></Scaled>
          </Box>
        </Box>
      </Reveal>
    </Band>
  );
}
