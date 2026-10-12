import { Button, ButtonGroup, MenuItem, SplitButton, Stack } from "@lettuceai/crisp";

export default function ButtonGroupExample() {
  return (
    <Stack gap={4} className="items-center">
      <ButtonGroup>
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </ButtonGroup>
      <SplitButton menu={<><MenuItem onSelect={() => {}}>Send as system</MenuItem><MenuItem onSelect={() => {}}>Save as draft</MenuItem></>}>
        Send
      </SplitButton>
    </Stack>
  );
}
