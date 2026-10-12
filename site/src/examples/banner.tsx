import { Banner, Button, Stack } from "@lettuceai/crisp";

export default function BannerExample() {
  return (
    <Stack gap={2} className="w-full overflow-hidden rounded-xl">
      <Banner tone="offline">You are offline. Changes will sync later.</Banner>
      <Banner tone="info" action={<Button size="sm">Restart</Button>} onDismiss={() => {}}>An update is ready to install.</Banner>
    </Stack>
  );
}
