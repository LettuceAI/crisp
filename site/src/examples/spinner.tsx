import { Flex, LoadingState, Spinner } from "@lettuceai/crisp";

export default function SpinnerExample() {
  return (
    <Flex gap={8} align="center" wrap className="justify-center">
      <Flex gap={3} align="center"><Spinner size="sm" label="Loading" /><Spinner /><Spinner size="lg" label="Loading" /></Flex>
      <LoadingState label="Loading characters" />
    </Flex>
  );
}
