import { useState } from "react";
import { Button, Field, Input, Sheet } from "@lettuceai/crisp";

export default function SheetExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Edit profile</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Edit profile"
        description="Drag the handle down, press Escape or tap the scrim to close."
        footer={<Button variant="primary" block onClick={() => setOpen(false)}>Save</Button>}
      >
        <Field label="Display name"><Input name="displayName" autoComplete="nickname" defaultValue="Ada" /></Field>
      </Sheet>
    </>
  );
}
