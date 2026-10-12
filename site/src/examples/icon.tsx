import { Bell, Heart, Search, Star } from "lucide-react";
import { Flex, Icon } from "@lettuceai/crisp";

export default function IconExample() {
  return (
    <Flex gap={5} align="center" className="text-fg-2">
      <Icon as={Search} size="sm" />
      <Icon as={Heart} size="md" />
      <Icon as={Bell} size="lg" label="Notifications" />
      <Icon as={Star} size="xl" strokeWidth={1.5} className="text-warning" />
    </Flex>
  );
}
