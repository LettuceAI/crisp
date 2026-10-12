import { Button, Stack, Alert } from "@lettuceai/crisp";

export default function AlertExample() {
  return (
    <Stack gap={3} className="w-full max-w-lg">
      <Alert tone="info" title="Sync is paused" description="Reconnect to Wi-Fi to continue." />
      <Alert tone="success" title="Backup finished" onDismiss={() => {}} />
      <Alert tone="warning" title="Low disk space" description="Models may fail to load." action={<Button size="sm">Manage storage</Button>} />
      <Alert tone="danger" title="Request failed" meta="HTTP 429" description="The provider is rate limiting you." details={'{ "error": "rate_limit_exceeded" }'} />
    </Stack>
  );
}
