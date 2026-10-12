import { Inbox } from "lucide-react";
import { Button, EmptyState, ErrorState, Flex } from "@lettuceai/crisp";

export default function EmptyStateExample() {
  return (
    <Flex gap={8} wrap className="w-full justify-center">
      <EmptyState size="sm" icon={<Inbox size={20} />} title="No chats yet" description="Start one from a character." action={<Button variant="primary">New chat</Button>} />
      <ErrorState size="sm" title="Could not load models" description="The provider did not answer." onRetry={() => {}} />
    </Flex>
  );
}
