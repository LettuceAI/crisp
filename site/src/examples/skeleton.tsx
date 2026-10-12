import { Skeleton, SkeletonRow, Stack } from "@lettuceai/crisp";

export default function SkeletonExample() {
  return (
    <Stack gap={4} className="w-full max-w-sm">
      <SkeletonRow />
      <SkeletonRow />
      <Skeleton shape="block" height={96} />
      <Skeleton width="60%" />
    </Stack>
  );
}
