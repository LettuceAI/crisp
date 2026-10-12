import { useState } from "react";
import { Code2, PenLine, Search } from "lucide-react";
import { PromptSuggestions, Text } from "@lettuceai/crisp";

export default function PromptSuggestionsExample() {
  const [picked, setPicked] = useState("");
  return (
    <div className="w-full max-w-lg space-y-3">
      <PromptSuggestions
        title="Try asking"
        onSelect={(prompt) => setPicked(prompt)}
        prompts={[
          { id: "write", title: "Draft a reply", prompt: "Draft a friendly reply to this email.", description: "Tone and length on request", icon: <PenLine size={16} />, badge: "Writing" },
          { id: "code", title: "Explain this code", prompt: "Explain what this function does.", icon: <Code2 size={16} />, badge: "Code" },
          { id: "search", title: "Summarize an article", prompt: "Summarize this article in five bullets.", icon: <Search size={16} />, badge: "Analysis" },
          { id: "idea", title: "Brainstorm names", prompt: "Brainstorm ten names for a weather app.", badge: "Creative" },
        ]}
      />
      {picked && <Text variant="hint">Selected: {picked}</Text>}
    </div>
  );
}
