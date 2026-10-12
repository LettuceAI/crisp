import { useState } from "react";
import { FeedbackAction } from "@lettuceai/crisp";

export default function FeedbackActionExample() {
  const [sentiment, setSentiment] = useState<"like" | "dislike" | null>(null);
  return (
    <FeedbackAction
      sentiment={sentiment}
      copyText="Tokens are the small pieces of text a model reads and writes."
      onLike={() => setSentiment(sentiment === "like" ? null : "like")}
      onDislike={() => setSentiment(sentiment === "dislike" ? null : "dislike")}
      onRetry={() => {}}
    />
  );
}
