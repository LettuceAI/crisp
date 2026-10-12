import { MultiItemDownloadCard } from "@lettuceai/crisp";

export default function MultiItemDownloadCardExample() {
  return (
    <div className="w-full max-w-md">
      <MultiItemDownloadCard
        title="Gemma 3 4B"
        detail="Model and tokenizer"
        defaultExpanded
        onPauseAll={() => {}}
        onCancelAll={() => {}}
        items={[
          { id: "a", name: "model-00001.gguf", status: "downloading", progress: 0.6, size: 2_000_000_000, speed: 9_000_000, eta: 80 },
          { id: "b", name: "tokenizer.json", status: "done", progress: 1, size: 4_000_000 },
          { id: "c", name: "config.json", status: "queued", size: 2_000 },
        ]}
      />
    </div>
  );
}
