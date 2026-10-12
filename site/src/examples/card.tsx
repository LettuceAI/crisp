import { useState } from "react";
import { Card, CardButton, Flex, Text } from "@lettuceai/crisp";

export default function CardExample() {
  const [selected, setSelected] = useState(false);
  return (
    <Flex gap={4} wrap className="w-full items-stretch justify-center">
      <Card className="w-52"><Text variant="title">Flat</Text><Text variant="hint">The default surface.</Text></Card>
      <Card level="raised" bordered className="w-52"><Text variant="title">Raised</Text><Text variant="hint">Lifted with a shadow.</Text></Card>
      <CardButton selected={selected} onClick={() => setSelected(!selected)} className="w-52 text-left">
        <Text variant="title">CardButton</Text>
        <Text variant="hint">{selected ? "Selected" : "Click to select"}</Text>
      </CardButton>
    </Flex>
  );
}
