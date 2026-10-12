import { DownloadItem, Stack } from "@lettuceai/crisp";

export default function DownloadItemExample() {
  return (
    <Stack gap={3} className="w-full max-w-md">
      <DownloadItem name="gemma-3-4b.gguf" detail="Q4_K_M" status="downloading" progress={0.42} speed={12_500_000} eta={95} size={2_800_000_000} onPause={() => {}} onCancel={() => {}} />
      <DownloadItem name="llama-3.2-3b.gguf" status="paused" progress={0.1} size={2_000_000_000} onResume={() => {}} onCancel={() => {}} />
      <DownloadItem name="tokenizer.json" status="failed" error="Connection reset" onRetry={() => {}} />
      <DownloadItem name="config.json" status="done" />
    </Stack>
  );
}
