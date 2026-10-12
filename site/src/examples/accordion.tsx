import { Accordion, AccordionItem, Text } from "@lettuceai/crisp";

export default function AccordionExample() {
  return (
    <Accordion defaultOpen={["a"]} className="w-full max-w-md">
      <AccordionItem value="a" title="What is Crisp?"><Text variant="secondary">A React component library with tokens, motion and themes.</Text></AccordionItem>
      <AccordionItem value="b" title="Does it work on a phone?" description="Every component has a touch layout"><Text variant="secondary">Yes. Navigation and overlays adapt.</Text></AccordionItem>
      <AccordionItem value="c" title="Is it free?"><Text variant="secondary">MIT licensed.</Text></AccordionItem>
    </Accordion>
  );
}
