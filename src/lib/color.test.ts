import { describe, expect, it } from "bun:test";
import { contrastRatio, hexToRgb, isLight, luminance, mixHex, normaliseHex, readableOn } from "./color";

describe("color utilities", () => {
  it("converts hex to rgb", () => {
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("invalid")).toBeNull();
  });

  it("normalises 3-digit and 6-digit hex", () => {
    expect(normaliseHex("#fff")).toBe("#ffffff");
    expect(normaliseHex("000")).toBe("#000000");
    expect(normaliseHex("#123456")).toBe("#123456");
    expect(normaliseHex("not-hex")).toBeNull();
  });

  it("calculates luminance", () => {
    expect(luminance("#ffffff")).toBeCloseTo(1, 2);
    expect(luminance("#000000")).toBeCloseTo(0, 2);
  });

  it("calculates contrast ratio according to WCAG", () => {
    const ratio = contrastRatio("#ffffff", "#000000");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("evaluates isLight accurately", () => {
    expect(isLight("#ffffff")).toBe(true);
    expect(isLight("#f7f6f3")).toBe(true);
    expect(isLight("#000000")).toBe(false);
    expect(isLight("#0b0c11")).toBe(false);
  });

  it("selects readable text foreground based on contrast", () => {
    expect(readableOn("#000000")).toBe("#ffffff");
    expect(readableOn("#ffffff")).toBe("#0a0a0a");
  });

  it("mixes hex colors with a ratio", () => {
    expect(mixHex("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(mixHex("#ff0000", "#0000ff", 0)).toBe("#ff0000");
    expect(mixHex("#ff0000", "#0000ff", 1)).toBe("#0000ff");
  });
});
