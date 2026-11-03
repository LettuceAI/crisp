export interface CropView { zoom: number; x: number; y: number }
export interface CropSize { width: number; height: number }
export interface CropPoint { x: number; y: number }

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 4;
export const START_ZOOM = 1.3;
export const BANNER_ASPECT_RATIO = 2;

export function drawnSize(size: CropSize, zoom: number, aspect = 1) {
  const short = Math.min(size.width, size.height * aspect);
  return { width: size.width / short * zoom, height: size.height / short * zoom };
}

export function clampView(view: CropView, size: CropSize, aspect = 1): CropView {
  const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, view.zoom));
  const drawn = drawnSize(size, zoom, aspect);
  const spanX = (drawn.width - 1) / 2;
  const spanY = (drawn.height - 1 / aspect) / 2;
  return { zoom, x: Math.max(-spanX, Math.min(spanX, view.x)), y: Math.max(-spanY, Math.min(spanY, view.y)) };
}

export function startView(size: CropSize, aspect = 1, initial?: CropView): CropView {
  return clampView(initial ?? { zoom: aspect === 1 ? START_ZOOM : MIN_ZOOM, x: 0, y: 0 }, size, aspect);
}

export function zoomView(view: CropView, zoom: number, size: CropSize, anchor: CropPoint = { x: 0, y: 0 }, aspect = 1): CropView {
  const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
  const ratio = next / view.zoom;
  return clampView({ zoom: next, x: anchor.x - (anchor.x - view.x) * ratio, y: anchor.y - (anchor.y - view.y) * ratio }, size, aspect);
}

export function panView(view: CropView, delta: CropPoint, size: CropSize, aspect = 1): CropView {
  return clampView({ zoom: view.zoom, x: view.x + delta.x, y: view.y + delta.y }, size, aspect);
}

export function cropRegion(view: CropView, size: CropSize, aspect = 1) {
  const shown = clampView(view, size, aspect);
  const short = Math.min(size.width, size.height * aspect);
  const drawn = drawnSize(size, shown.zoom, aspect);
  const side = Math.max(1, Math.min(size.width, Math.round(short / shown.zoom)));
  const height = Math.max(1, Math.min(size.height, Math.round(side / aspect)));
  const perUnit = short / shown.zoom;
  const x = Math.round((drawn.width / 2 - shown.x - 0.5) * perUnit);
  const y = Math.round((drawn.height / 2 - shown.y - 0.5 / aspect) * perUnit);
  return {
    x: Math.max(0, Math.min(size.width - side, x)),
    y: Math.max(0, Math.min(size.height - height, y)),
    size: side,
    ...(aspect === 1 ? {} : { height }),
  };
}

export interface LuminanceGrid { width: number; height: number; values: ArrayLike<number> }

export const DARK_BELOW = 0.08;

export function luminanceAt(grid: LuminanceGrid, size: CropSize, view: CropView, fraction: number, aspect = 1) {
  const region = cropRegion(view, size, aspect);
  const span = region.size * fraction;
  const cx = region.x + region.size / 2;
  const height = region.height ?? region.size;
  const spanY = height * fraction;
  const cy = region.y + height / 2;
  const sx = grid.width / size.width;
  const sy = grid.height / size.height;
  const left = Math.max(0, Math.floor((cx - span / 2) * sx));
  const right = Math.min(grid.width - 1, Math.max(left, Math.ceil((cx + span / 2) * sx) - 1));
  const top = Math.max(0, Math.floor((cy - spanY / 2) * sy));
  const bottom = Math.min(grid.height - 1, Math.max(top, Math.ceil((cy + spanY / 2) * sy) - 1));
  let total = 0;
  for (let row = top; row <= bottom; row++) for (let column = left; column <= right; column++) total += grid.values[row * grid.width + column] ?? 0;
  return total / ((right - left + 1) * (bottom - top + 1));
}
