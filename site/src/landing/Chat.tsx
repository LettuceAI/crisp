import { useEffect, useRef, useState } from "react";
import { Palette, Smartphone, Zap } from "lucide-react";
import { Box, Card, Composer, Message, PromptSuggestions, type PromptSuggestionItem } from "@lettuceai/crisp";
import { Band, Reveal } from "./Band";

interface Turn {
  id: number;
  role: "user" | "assistant";
  text: string;
  state?: "typing" | "streaming";
}

const replies: { match: RegExp; text: string }[] = [
  { match: /theme|colou?r|accent|dark|light/i, text: "Themes are a handful of colors plus a radius and a density. Change the accent in the editor further down and this whole page follows, including this bubble." },
  { match: /phone|mobile|touch|desktop|responsive/i, text: "Every component has a phone layout and a desktop layout. Navigation moves from a rail to a tab bar, and overlays become bottom sheets. The frames below show both at once." },
  { match: /install|start|begin|setup/i, text: "Add the package, import the stylesheet after Tailwind, and point @source at the package. The getting started page walks through it in four steps." },
  { match: /motion|animat|fast|spring/i, text: "Motion comes from a few presets named for what moves: settle, surface, sheetIn and friends. They all respect prefers-reduced-motion." },
];
const fallback = "I am a scripted demo, but the pieces are real: this is Message, Composer and the typing indicator from Crisp. Ask about themes, phones, motion or installing.";

const prompts: PromptSuggestionItem[] = [
  { id: "theme", title: "Can I change the theme?", prompt: "Can I change the theme?", icon: <Palette size={16} />, badge: "Theming" },
  { id: "phone", title: "Does it work on a phone?", prompt: "Does it work on a phone?", icon: <Smartphone size={16} />, badge: "Layout" },
  { id: "motion", title: "How does motion work?", prompt: "How does motion work?", icon: <Zap size={16} />, badge: "Motion" },
];

export function Chat() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const timers = useRef<number[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const next = useRef(1);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [turns]);

  const stop = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setBusy(false);
    setTurns((all) => all.map((t) => (t.state ? { ...t, state: undefined } : t)));
  };

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    const answer = (replies.find((r) => r.match.test(value)) ?? { text: fallback }).text;
    const id = next.current++;
    const replyId = next.current++;
    setDraft("");
    setBusy(true);
    setTurns((all) => [...all, { id, role: "user", text: value }, { id: replyId, role: "assistant", text: "", state: "typing" }]);
    const words = answer.split(" ");
    const at = (ms: number, run: () => void) => timers.current.push(window.setTimeout(run, ms));
    words.forEach((_, i) =>
      at(700 + i * 45, () =>
        setTurns((all) => all.map((t) => (t.id === replyId ? { ...t, text: words.slice(0, i + 1).join(" "), state: "streaming" } : t))),
      ),
    );
    at(700 + words.length * 45 + 80, () => {
      setTurns((all) => all.map((t) => (t.id === replyId ? { ...t, state: undefined } : t)));
      setBusy(false);
    });
  };

  return (
    <Band
      id="chat"
      eyebrow="Try it"
      title="A conversation you can type into."
      lead="Message, Composer, PromptSuggestions and the typing indicator, the same parts LettuceAI chats are made of. The replies are scripted; the components are not."
    >
      <Reveal>
        <Card padding="none" className="mx-auto flex h-136 w-full max-w-2xl flex-col overflow-hidden border border-line">
          <Box ref={scroller} aria-live="polite" className="scrollbar-thin flex-1 overflow-y-auto p-4">
            <Box className="flex flex-col gap-3">
              <Message role="assistant" author={{ name: "Crisp" }} timestamp="Now">
                Hi, I am a chat built from Crisp. Ask me something, or pick a question.
              </Message>
              {turns.map((turn) => (
                <Message
                  key={turn.id}
                  role={turn.role}
                  author={turn.role === "assistant" ? { name: "Crisp" } : undefined}
                  state={turn.state}
                >
                  {turn.text}
                </Message>
              ))}
              {turns.length === 0 && <PromptSuggestions prompts={prompts} columns={1} onSelect={(prompt) => send(prompt)} />}
            </Box>
          </Box>
          <Box className="border-t border-line p-3">
            <Composer
              value={draft}
              onChange={setDraft}
              onSend={() => send(draft)}
              onStop={stop}
              sending={busy}
              placeholder="Ask about themes, phones or motion"
            />
          </Box>
        </Card>
      </Reveal>
    </Band>
  );
}

