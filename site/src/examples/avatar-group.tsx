import { AvatarGroup } from "@lettuceai/crisp";

const people = ["Ada", "Alan", "Grace", "Linus", "Margaret", "Katherine"].map((name) => ({ name }));

export default function AvatarGroupExample() {
  return <AvatarGroup people={people} max={4} interactive />;
}
