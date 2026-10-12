import { Avatar, HoverCard, Text } from "@lettuceai/crisp";

export default function HoverCardExample() {
  return (
    <HoverCard
      side="bottom"
      content={
        <div className="flex w-64 items-center gap-3 p-1">
          <Avatar name="Ada Lovelace" />
          <div><Text variant="title">Ada Lovelace</Text><Text variant="hint">Mathematician and first programmer</Text></div>
        </div>
      }
    >
      <a href="#example" className="text-sm text-accent underline underline-offset-2">@ada</a>
    </HoverCard>
  );
}
