import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Scale } from "./Scale";

const spans = (html: string) => [...html.matchAll(/style="([^"]*)"/g)].map((match) => match[1]);

describe("Scale", () => {
  it("fills from the start on a one-sided scale", () => {
    const html = renderToStaticMarkup(<Scale label="Warmth" value={0.72} />);
    expect(spans(html)).toEqual(["left:0%;width:72%"]);
    expect(html).toContain('aria-valuenow="0.72"');
  });

  it("fills from the centre toward a positive or negative value and marks the zero", () => {
    expect(spans(renderToStaticMarkup(<Scale label="Closeness" value={0.5} min={-1} max={1} />))).toEqual(["left:50%", "left:50%;width:25%"]);
    const negative = renderToStaticMarkup(<Scale label="Affection" value={-0.5} min={-1} max={1} />);
    expect(spans(negative)).toEqual(["left:50%", "left:25%;width:25%"]);
    expect(negative).toContain("bg-danger");
  });

  it("places the reference mark on the scale and clamps values outside it", () => {
    const html = renderToStaticMarkup(<Scale label="Trust" value={2} min={-1} max={1} reference={0} referenceLabel="Default" />);
    expect(spans(html)).toEqual(["left:50%", "left:50%;width:50%", "left:50%"]);
    expect(html).toContain('aria-description="Default: 0"');
  });
});
