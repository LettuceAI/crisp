import { AudioItem, Stack } from "@lettuceai/crisp";

async function tone() {
  const rate = 8000;
  const samples = rate * 2;
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  const text = (offset: number, value: string) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, "RIFF"); view.setUint32(4, 36 + samples * 2, true); text(8, "WAVEfmt ");
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  text(36, "data"); view.setUint32(40, samples * 2, true);
  for (let i = 0; i < samples; i++) view.setInt16(44 + i * 2, Math.sin((i / rate) * 2 * Math.PI * 440) * 3000, true);
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

export default function AudioItemExample() {
  return (
    <Stack gap={3} className="w-full max-w-md">
      <AudioItem title="Greeting" description="A two second test tone" onLoadSrc={tone} badge={{ label: "Voice", tone: "accent" }} />
      <AudioItem title="Not downloaded yet" description="Fetched when you press play" onLoadSrc={tone} />
    </Stack>
  );
}
