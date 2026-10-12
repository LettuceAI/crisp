import { useState } from "react";
import { InfiniteScroll } from "@lettuceai/crisp";

export default function InfiniteScrollExample() {
  const [count, setCount] = useState(12);
  const [loading, setLoading] = useState(false);
  const more = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setCount((n) => n + 8);
      setLoading(false);
    }, 600);
  };
  return (
    <div className="h-56 w-full max-w-sm overflow-y-auto rounded-xl border border-line p-3">
      {Array.from({ length: count }, (_, i) => <div key={i} className="border-b border-line py-2 text-sm text-fg-2">Result {i + 1}</div>)}
      <InfiniteScroll onLoadMore={more} loading={loading} disabled={count >= 36} endMessage="That is everything" rootMargin="60px" />
    </div>
  );
}
