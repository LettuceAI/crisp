import { Button, Flex, toast } from "@lettuceai/crisp";

export default function ToastExample() {
  const download = () => {
    let progress = 0;
    const tick = () => {
      progress += 0.2;
      toast.progress({ id: "download", title: "Downloading model", description: "gemma-3.gguf", progress, duration: progress >= 1 ? 1500 : Infinity });
      if (progress < 1) window.setTimeout(tick, 500);
    };
    tick();
  };
  return (
    <Flex gap={2} wrap className="justify-center">
      <Button onClick={() => toast.info("Heads up", "Something you should know.")}>Info</Button>
      <Button onClick={() => toast.success("Saved")}>Success</Button>
      <Button onClick={() => toast.warning("Low battery")}>Warning</Button>
      <Button onClick={() => toast.error("Could not connect", "Check your key.", { action: { label: "Retry", onClick: () => {} } })}>Error</Button>
      <Button onClick={download}>Progress</Button>
    </Flex>
  );
}
