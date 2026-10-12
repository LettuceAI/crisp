import { TitleBar } from "@lettuceai/crisp";

export default function TitleBarExample() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-line">
      <TitleBar title="LettuceAI" platform="windows" onMinimize={() => {}} onMaximize={() => {}} onClose={() => {}} />
    </div>
  );
}
