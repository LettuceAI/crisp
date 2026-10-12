import { PartitionBar } from "@lettuceai/crisp";

export default function PartitionBarExample() {
  return (
    <div className="w-full max-w-lg">
      <PartitionBar
        aria-label="Storage"
        total={256}
        showRemainder
        format={(value) => `${value} GB`}
        segments={[
          { id: "models", label: "Models", value: 96, tone: "accent" },
          { id: "images", label: "Images", value: 48, tone: "info" },
          { id: "chats", label: "Chats", value: 12, tone: "secondary" },
        ]}
      />
    </div>
  );
}
