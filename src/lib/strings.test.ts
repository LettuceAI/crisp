import { describe, expect, it } from "bun:test";
import { englishStrings } from "./strings";

describe("englishStrings", () => {
  it("provides fallback strings for all mandatory UI keys", () => {
    expect(englishStrings.actionBarBack).toBe("Back");
    expect(englishStrings.alertDismiss).toBe("Dismiss");
    expect(englishStrings.composerSend).toBe("Send message");
    expect(englishStrings.confirmCancel).toBe("Cancel");
    expect(englishStrings.confirmConfirm).toBe("Confirm");
    expect(englishStrings.tableEmpty).toBe("Nothing to show");
  });

  it("evaluates functional strings with count or parameters correctly", () => {
    expect(englishStrings.avatarGroupPeople(3)).toBe("3 people");
    expect(englishStrings.breadcrumbMore(2)).toBe("2 more levels");
    expect(englishStrings.carouselPosition(2, 5)).toBe("2 of 5");
    expect(englishStrings.downloadLeftSeconds(15)).toBe("15s left");
    expect(englishStrings.downloadLeftMinutes(4)).toBe("4 min left");
    expect(englishStrings.paginationPage(3)).toBe("Page 3");
  });
});
