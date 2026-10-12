import { Button, Flex, Text, useTheme } from "@lettuceai/crisp";
import { useMounted } from "../mounted";

export default function ThemeProviderExample() {
  const { theme, presets, setTheme, setColor, setRadius, setDensity, reset } = useTheme();
  const mounted = useMounted();
  return (
    <Flex direction="column" gap={4} className="w-full max-w-md">
      <Text variant="hint">Current theme: {mounted ? theme.name : "Midnight"}</Text>
      <Flex gap={2} wrap>
        {presets.map((preset) => <Button key={preset.id} size="sm" variant={mounted && theme.id === preset.id ? "tonal" : "secondary"} onClick={() => setTheme(preset)}>{preset.name}</Button>)}
      </Flex>
      <Flex gap={2} wrap>
        <Button size="sm" onClick={() => setColor("accent", "#38bdf8")}>Blue accent</Button>
        <Button size="sm" onClick={() => setRadius("round")}>Round</Button>
        <Button size="sm" onClick={() => setRadius("sharp")}>Sharp</Button>
        <Button size="sm" onClick={() => setDensity("compact")}>Compact</Button>
        <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
      </Flex>
    </Flex>
  );
}
