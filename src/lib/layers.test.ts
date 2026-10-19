import { describe, expect, it } from "bun:test";
import { dismissTopLayer, pushLayer } from "./layers";

describe("dismiss layers", () => {
  it("closes only the topmost overlay", () => {
    const closed: string[] = [];
    const removeSheet = pushLayer(() => closed.push("sheet"));
    const removeDialog = pushLayer(() => closed.push("dialog"));

    expect(dismissTopLayer()).toBe(true);
    expect(closed).toEqual(["dialog"]);

    removeDialog();
    expect(dismissTopLayer()).toBe(true);
    expect(closed).toEqual(["dialog", "sheet"]);

    removeSheet();
    expect(dismissTopLayer()).toBe(false);
  });

  it("keeps the order when a lower overlay closes first", () => {
    const closed: string[] = [];
    const removeSheet = pushLayer(() => closed.push("sheet"));
    const removeMenu = pushLayer(() => closed.push("menu"));
    removeSheet();

    expect(dismissTopLayer()).toBe(true);
    expect(closed).toEqual(["menu"]);
    removeMenu();
    expect(dismissTopLayer()).toBe(false);
  });
});
