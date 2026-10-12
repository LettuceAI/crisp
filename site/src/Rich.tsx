import { Fragment } from "react";
import { Box } from "@lettuceai/crisp";

const pattern = /(`[^`]+`|(?:<\/?[A-Za-z][\w.]*\s*\/?>…?)+)/g;

/** Doc comment text with `inline code` and JSX snippets set as code. */
export function Rich({ children }: { children: string }) {
  return (
    <>
      {children.split(pattern).map((part, i) =>
        i % 2 === 1 ? (
          <Box key={i} as="code" className="rounded-md bg-fill-2 px-1 py-0.5 font-mono text-[0.85em] text-fg">
            {part.startsWith("`") ? part.slice(1, -1) : part}
          </Box>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
