import { describe, expect, it } from "bun:test";
import { diffLines } from "./Diff";

describe("diffLines", () => {
  it("identifies identical lines as same", () => {
    const text = "alpha\nbeta\ngamma";
    const result = diffLines(text, text);
    expect(result.length).toBe(3);
    expect(result.every((line) => line.op === "same")).toBe(true);
    expect(result[0].text).toBe("alpha");
    expect(result[1].text).toBe("beta");
    expect(result[2].text).toBe("gamma");
  });

  it("identifies additions", () => {
    const before = "alpha\ngamma";
    const after = "alpha\nbeta\ngamma";
    const result = diffLines(before, after);
    const added = result.filter((l) => l.op === "add");
    expect(added.length).toBe(1);
    expect(added[0].text).toBe("beta");
  });

  it("identifies removals", () => {
    const before = "alpha\nbeta\ngamma";
    const after = "alpha\ngamma";
    const result = diffLines(before, after);
    const removed = result.filter((l) => l.op === "remove");
    expect(removed.length).toBe(1);
    expect(removed[0].text).toBe("beta");
  });

  it("handles completely different texts", () => {
    const before = "foo";
    const after = "bar";
    const result = diffLines(before, after);
    expect(result.some((l) => l.op === "remove" && l.text === "foo")).toBe(true);
    expect(result.some((l) => l.op === "add" && l.text === "bar")).toBe(true);
  });
});
