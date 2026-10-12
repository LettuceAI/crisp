import { useState } from "react";
import { Message, MessageDivider, Stack, TypingDots } from "@lettuceai/crisp";

export default function MessageExample() {
  const [variant, setVariant] = useState(0);
  return (
    <Stack gap={2} className="w-full max-w-md">
      <MessageDivider>Today</MessageDivider>
      <Message role="user" timestamp="09:41">Can you explain tokens?</Message>
      <Message
        role="assistant"
        author={{ name: "Ada" }}
        timestamp="09:41"
        reasoning={{ text: "The person wants a short, plain explanation." }}
        variants={{ index: variant, total: 3, onPrev: () => setVariant((v) => Math.max(0, v - 1)), onNext: () => setVariant((v) => Math.min(2, v + 1)) }}
      >
        Tokens are the small pieces of text a model reads and writes. Variant {variant + 1} of 3.
      </Message>
      <Message role="assistant" author={{ name: "Ada" }} state="typing" />
      <Message role="assistant" author={{ name: "Ada" }} state="streaming">Streaming a reply</Message>
      <div className="px-3 text-fg-3"><TypingDots /></div>
    </Stack>
  );
}
