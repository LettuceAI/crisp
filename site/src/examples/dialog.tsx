import { useState } from "react";
import { Button, Dialog, Text } from "@lettuceai/crisp";

export default function DialogExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Rename chat"
        description="Names help you find a chat later."
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => setOpen(false)}>Rename</Button></>}
      >
        <Text variant="secondary">A dialog is centred and short. Anything longer belongs in a sheet.</Text>
      </Dialog>
    </>
  );
}
