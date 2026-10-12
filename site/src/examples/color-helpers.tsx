import { contrastRatio, isLight, mixHex, readableOn, tintFromName } from "@lettuceai/crisp";

const colors = ["#65c789", "#3b82f6", "#f59e0b", "#1e1e1e"];

export default function ColorHelpersExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <div key={color} className="flex w-24 flex-col items-center gap-1 rounded-xl p-3 text-center text-xs" style={{ background: color, color: readableOn(color) }}>
            <span>{color}</span>
            <span>{isLight(color) ? "light" : "dark"}</span>
            <span>{contrastRatio(color, readableOn(color)).toFixed(1)}:1</span>
          </div>
        ))}
      </div>
      <div className="h-8 rounded-lg" style={{ background: mixHex("#65c789", "#3b82f6", 0.5) }} title="mixHex 50%" />
      <div className="flex h-8 items-center rounded-lg px-3 text-xs font-medium text-white" style={{ background: tintFromName("Ada Lovelace").background }}>tintFromName("Ada Lovelace")</div>
    </div>
  );
}
