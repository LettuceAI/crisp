import { Button, Popover, PopoverContent, PopoverTrigger, Text } from "@lettuceai/crisp";

export default function PopoverExample() {
  return (
    <Popover>
      <PopoverTrigger><Button>Open popover</Button></PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-3">
        <Text variant="title">Context window</Text>
        <Text variant="hint">Anchored to the trigger and portalled to the body, so no ancestor can clip it.</Text>
      </PopoverContent>
    </Popover>
  );
}
