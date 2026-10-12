import { describe, expect, it } from "bun:test";
import { compactNumber, fileSize, relativeTime } from "./format";

describe("relativeTime", () => {
  const now = new Date("2026-10-12T12:00:00Z").getTime();

  it("formats recent times in English", () => {
    expect(relativeTime(now - 10_000, now, "en")).toBe("Just now");
    expect(relativeTime(now - 4 * 60_000, now, "en")).toBe("4 min ago");
    expect(relativeTime(now - 3 * 3600_000, now, "en")).toBe("3 h ago");
    expect(relativeTime(now - 24 * 3600_000, now, "en")).toBe("Yesterday");
    expect(relativeTime(now - 4 * 86400_000, now, "en")).toBe("4 days ago");
    expect(relativeTime(now - 21 * 86400_000, now, "en")).toBe("3 wk ago");
    expect(relativeTime(now - 60 * 86400_000, now, "en")).toBe("2 mo ago");
    expect(relativeTime(now - 400 * 86400_000, now, "en")).toBe("1 yr ago");
  });

  it("supports non-English locales via Intl", () => {
    const formatted = relativeTime(now - 10 * 60_000, now, "de");
    expect(formatted).toContain("10");
  });
});

describe("compactNumber", () => {
  it("formats numbers in English", () => {
    expect(compactNumber(0)).toBe("0");
    expect(compactNumber(950)).toBe("950");
    expect(compactNumber(1240)).toBe("1.2k");
    expect(compactNumber(18300)).toBe("18k");
    expect(compactNumber(2140000)).toBe("2.1M");
    expect(compactNumber(5000000000)).toBe("5B");
  });

  it("handles negative numbers", () => {
    expect(compactNumber(-1240)).toBe("-1.2k");
  });
});

describe("fileSize", () => {
  it("formats bytes in English", () => {
    expect(fileSize(500)).toBe("500 B");
    expect(fileSize(1024)).toBe("1.0 KB");
    expect(fileSize(1536)).toBe("1.5 KB");
    expect(fileSize(1024 * 1024)).toBe("1.0 MB");
    expect(fileSize(1.5 * 1024 * 1024)).toBe("1.5 MB");
    expect(fileSize(10 * 1024 * 1024)).toBe("10 MB");
    expect(fileSize(2 * 1024 * 1024 * 1024)).toBe("2.0 GB");
  });
});
