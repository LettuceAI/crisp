import { describe, expect, it } from "bun:test";
import { tintFromName } from "./tint";

describe("tintFromName", () => {
  it("produces deterministic hues and backgrounds for the same name", () => {
    const res1 = tintFromName("Alice");
    const res2 = tintFromName("Alice");
    expect(res1.hue).toBe(res2.hue);
    expect(res1.background).toBe(res2.background);
  });

  it("produces different hues for different names", () => {
    const resAlice = tintFromName("Alice");
    const resBob = tintFromName("Bob");
    expect(resAlice.hue).not.toBe(resBob.hue);
  });

  it("returns hue in range 0-359", () => {
    const names = ["Test", "Lettuce", "Crisp", "Agent", "123"];
    for (const name of names) {
      const { hue } = tintFromName(name);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
    }
  });
});
