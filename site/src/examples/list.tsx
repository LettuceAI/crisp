import { useState } from "react";
import { Bell, Palette, Shield } from "lucide-react";
import { ListGroup, ListRow, ListRowButton, Switch } from "@lettuceai/crisp";

export default function ListExample() {
  const [on, setOn] = useState(true);
  return (
    <ListGroup label="Settings" className="w-full max-w-md">
      <ListRowButton icon={<Palette size={16} />} tone="accent" title="Appearance" description="Theme, density and radius" />
      <ListRowButton icon={<Shield size={16} />} tone="info" title="Privacy" trailing="On" />
      <ListRow icon={<Bell size={16} />} title="Notifications" chevron={false} trailing={<Switch checked={on} onChange={setOn} aria-label="Notifications" />} />
    </ListGroup>
  );
}
