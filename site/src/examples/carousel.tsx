import { Carousel } from "@lettuceai/crisp";

export default function CarouselExample() {
  return (
    <Carousel aria-label="Feature tour" className="w-full max-w-md">
      {["Chat with characters", "Keep memory across chats", "Sync between devices"].map((text, i) => (
        <div key={text} className="flex h-40 flex-col items-center justify-center gap-1 rounded-xl bg-surface-1 text-center">
          <span className="text-xs text-fg-3">Step {i + 1}</span>
          <span className="text-lg font-semibold text-fg">{text}</span>
        </div>
      ))}
    </Carousel>
  );
}
