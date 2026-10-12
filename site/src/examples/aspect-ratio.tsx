import { AspectRatio, Flex } from "@lettuceai/crisp";

export default function AspectRatioExample() {
  return (
    <Flex gap={4} wrap className="w-full items-end justify-center">
      {[{ ratio: 1, label: "1" }, { ratio: 16 / 9, label: "16 / 9" }, { ratio: 3 / 4, label: "3 / 4" }].map((item) => (
        <div key={item.label} className="w-32">
          <AspectRatio ratio={item.ratio} className="flex items-center justify-center rounded-xl bg-fill-3 text-sm text-fg-2">
            {item.label}
          </AspectRatio>
        </div>
      ))}
    </Flex>
  );
}
