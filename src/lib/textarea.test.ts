import { describe, expect, it } from "bun:test";
import { textareaHeight } from "./textarea";

describe("textareaHeight", () => {
  const measure = { line: 24, pad: 22, rows: 4, maxRows: 12 };

  it("keeps the rows as the minimum while the text is short", () => {
    expect(textareaHeight({ ...measure, content: 46 })).toEqual({ height: 24 * 4 + 22, scrolls: false });
  });

  it("grows with the text up to the maximum, then scrolls", () => {
    expect(textareaHeight({ ...measure, content: 24 * 7 + 22 })).toEqual({ height: 24 * 7 + 22, scrolls: false });
    expect(textareaHeight({ ...measure, content: 24 * 20 + 22 })).toEqual({ height: 24 * 12 + 22, scrolls: true });
  });

  it("never caps below the minimum when maxRows is smaller than rows", () => {
    expect(textareaHeight({ ...measure, rows: 8, maxRows: 6, content: 10 })).toEqual({ height: 24 * 8 + 22, scrolls: false });
  });
});
