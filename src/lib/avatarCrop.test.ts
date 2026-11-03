import { describe, expect, it } from "bun:test";
import { clampView, cropRegion, luminanceAt, panView, startView, zoomView } from "./avatarCrop";

const wide = { width: 800, height: 600 };

describe("avatar crop framing", () => {
  it("opens slightly past a cover fit, centred", () => {
    expect(startView(wide)).toEqual({ zoom: 1.3, x: 0, y: 0 });
    expect(cropRegion(startView(wide), wide)).toEqual({ x: 169, y: 69, size: 462 });
  });

  it("covers the whole short side at zoom 1 and never leaves an empty edge", () => {
    expect(cropRegion({ zoom: 1, x: 0, y: 0 }, wide)).toEqual({ x: 100, y: 0, size: 600 });
    expect(panView({ zoom: 1, x: 0, y: 0 }, { x: 5, y: 5 }, wide)).toEqual({ zoom: 1, x: (800 / 600 - 1) / 2, y: 0 });
    expect(cropRegion(panView({ zoom: 1, x: 0, y: 0 }, { x: 5, y: 0 }, wide), wide)).toEqual({ x: 0, y: 0, size: 600 });
    expect(cropRegion(panView({ zoom: 1, x: 0, y: 0 }, { x: -5, y: 0 }, wide), wide)).toEqual({ x: 200, y: 0, size: 600 });
  });

  it("keeps the zoom between cover fit and four times it", () => {
    expect(clampView({ zoom: 0.2, x: 0, y: 0 }, wide).zoom).toBe(1);
    expect(zoomView(startView(wide), 9, wide).zoom).toBe(4);
  });

  it("keeps the subject at the anchor while zooming", () => {
    const view = { zoom: 2, x: 0.3, y: -0.2 };
    const centred = zoomView(view, 3, wide);
    expect(centred.x).toBeCloseTo(0.45);
    expect(centred.y).toBeCloseTo(-0.3);
    const pointer = { x: 0.25, y: 0.25 };
    const before = { x: (pointer.x - view.x) / view.zoom, y: (pointer.y - view.y) / view.zoom };
    const zoomed = zoomView(view, 2.5, wide, pointer);
    expect((pointer.x - zoomed.x) / zoomed.zoom).toBeCloseTo(before.x);
    expect((pointer.y - zoomed.y) / zoomed.zoom).toBeCloseTo(before.y);
  });

  it("works on tall pictures", () => {
    const tall = { width: 600, height: 900 };
    expect(cropRegion({ zoom: 1, x: 0, y: 10 }, tall)).toEqual({ x: 0, y: 0, size: 600 });
    expect(cropRegion({ zoom: 2, x: 0, y: 0 }, tall)).toEqual({ x: 150, y: 300, size: 300 });
  });
});

describe("guide contrast", () => {
  const size = { width: 400, height: 200 };
  const grid = { width: 4, height: 2, values: [0, 0, 1, 1, 0, 0, 1, 1] };

  it("reads the brightness under the centre of the crop", () => {
    expect(luminanceAt(grid, size, { zoom: 1, x: 0, y: 0 }, 1)).toBe(0.5);
    expect(luminanceAt(grid, size, { zoom: 1, x: 0.5, y: 0 }, 0.2)).toBe(0);
    expect(luminanceAt(grid, size, { zoom: 1, x: -0.5, y: 0 }, 0.2)).toBe(1);
  });
});


describe("banner crop framing", () => {
  it("uses the full width in a 2:1 cover fit and clamps vertical panning", () => {
    const view = startView(wide, 2);
    expect(view).toEqual({ zoom: 1, x: 0, y: 0 });
    expect(cropRegion(view, wide, 2)).toEqual({ x: 0, y: 100, size: 800, height: 400 });
    expect(cropRegion(panView(view, { x: 20, y: 20 }, wide, 2), wide, 2)).toEqual({ x: 0, y: 0, size: 800, height: 400 });
    expect(cropRegion(panView(view, { x: -20, y: -20 }, wide, 2), wide, 2)).toEqual({ x: 0, y: 200, size: 800, height: 400 });
  });

  it("restores the original source framing instead of cropping the previous result", () => {
    const saved = { zoom: 2, x: 0.1, y: -0.05 };
    expect(startView(wide, 2, saved)).toEqual(saved);
    expect(cropRegion(saved, wide, 2)).toEqual({ x: 160, y: 220, size: 400, height: 200 });
    expect(cropRegion(zoomView(saved, 1, wide, undefined, 2), wide, 2)).toEqual({ x: 0, y: 120, size: 800, height: 400 });
  });

  it("keeps wide cover bounds valid for portrait sources and zoom limits", () => {
    const tall = { width: 600, height: 900 };
    expect(cropRegion(startView(tall, 2), tall, 2)).toEqual({ x: 0, y: 300, size: 600, height: 300 });
    for (const size of [wide, tall]) for (const zoom of [0.5, 1, 2, 4, 10]) {
      const region = cropRegion(panView({ zoom, x: 0, y: 0 }, { x: 10, y: -10 }, size, 2), size, 2);
      expect(region.x).toBeGreaterThanOrEqual(0);
      expect(region.y).toBeGreaterThanOrEqual(0);
      expect(region.x + region.size).toBeLessThanOrEqual(size.width);
      expect(region.y + region.height!).toBeLessThanOrEqual(size.height);
    }
  });
});
