export interface TextareaMeasure {
  /** The content's natural height, padding included. */
  content: number;
  line: number;
  /** Padding and border around the text. */
  pad: number;
  rows: number;
  maxRows: number;
}

/** An auto-growing textarea's height: at least `rows` lines, at most `maxRows`, scrolling past that. */
export function textareaHeight({ content, line, pad, rows, maxRows }: TextareaMeasure): { height: number; scrolls: boolean } {
  const min = line * rows + pad;
  const max = line * Math.max(rows, maxRows) + pad;
  return { height: Math.min(Math.max(content, min), max), scrolls: content > max };
}
