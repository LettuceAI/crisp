import { Avatar, Flex } from "@lettuceai/crisp";

export default function AvatarExample() {
  return (
    <Flex gap={3} align="center" wrap className="justify-center">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => <Avatar key={size} name="Ada Lovelace" size={size} />)}
      <Avatar name="Alan Turing" ring />
    </Flex>
  );
}
