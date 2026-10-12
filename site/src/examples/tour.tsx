import { useState } from "react";
import { Button, Tour } from "@lettuceai/crisp";

export default function TourExample() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <Button id="tour-target" variant="tonal">The highlighted control</Button>
      <Button variant="primary" onClick={() => setOpen(true)}>Start tour</Button>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={[
          { title: "Welcome", body: "A step without a target is centred." },
          { target: "#tour-target", title: "A real element", body: "The spotlight cuts out around any selector." },
        ]}
      />
    </div>
  );
}
