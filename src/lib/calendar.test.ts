import { describe, expect, it } from "bun:test";
import { calendarDate, daysInMonth } from "./calendar";

describe("calendarDate", () => {
  it("keeps years before 1970 and before 100", () => {
    const old = calendarDate(1890, 2, 14);
    expect([old.getFullYear(), old.getMonth(), old.getDate()]).toEqual([1890, 2, 14]);
    expect(old.getTime()).toBeLessThan(0);
    const ancient = calendarDate(45, 0, 1);
    expect(ancient.getFullYear()).toBe(45);
  });

  it("rolls over months and counts leap days", () => {
    expect(calendarDate(1899, 12, 1).getFullYear()).toBe(1900);
    expect(daysInMonth(1900, 1)).toBe(28);
    expect(daysInMonth(1896, 1)).toBe(29);
    expect(daysInMonth(2000, 1)).toBe(29);
  });
});
