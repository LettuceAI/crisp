import { Citation } from "@lettuceai/crisp";

export default function CitationExample() {
  return (
    <p className="max-w-md text-base leading-7 text-fg-2">
      The context window limits how much a model reads at once
      <Citation index={1} title="Attention Is All You Need" domain="arxiv.org" url="https://arxiv.org/abs/1706.03762" snippet="The Transformer relies entirely on self-attention to compute representations." />
      , and longer windows cost more memory
      <Citation index={2} title="KV cache explained" domain="example.org" snippet="Each token adds keys and values that must stay in memory." />
      .
    </p>
  );
}
