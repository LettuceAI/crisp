import { ScrollArea, Text } from "@lettuceai/crisp";

export default function ScrollAreaExample() {
  return (
    <ScrollArea bar className="h-40 w-full max-w-sm rounded-xl border border-line p-3">
      {Array.from({ length: 14 }, (_, i) => (
        <Text key={i} variant="secondary" className="py-1">Line {i + 1}. The edge fades while there is more below.</Text>
      ))}
    </ScrollArea>
  );
}
