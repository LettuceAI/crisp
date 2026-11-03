import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Crosshair, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { useCrispStrings } from "../lib/strings";
import { BANNER_ASPECT_RATIO, cropRegion, DARK_BELOW, drawnSize, luminanceAt, MAX_ZOOM, MIN_ZOOM, panView, startView, zoomView, type CropPoint, type CropSize, type CropView, type LuminanceGrid } from "../lib/avatarCrop";
import { Button } from "./Button";
import { ErrorState } from "./EmptyState";
import { IconButton } from "./IconButton";
import { Sheet } from "./Sheet";
import { Slider } from "./Slider";
import { Spinner } from "./Spinner";

export interface AvatarCropRegion { x: number; y: number; size: number; height?: number }
export type AvatarCropView = CropView;
export { BANNER_ASPECT_RATIO } from "../lib/avatarCrop";

export interface AvatarCropSheetProps {
  src: string | null;
  onClose: () => void;
  onConfirm: (region: AvatarCropRegion, image: HTMLImageElement, view: AvatarCropView) => void;
  shape?: "circle" | "banner";
  initialView?: AvatarCropView;
  busy?: boolean;
  error?: ReactNode;
}

const STEP = 1.25;
const PAN = 0.02;
const FAST_PAN = 0.1;
const SNAP = 0.015;
const FIT = "min(100%, 52dvh)";
const CROSS = "M46.5 50H53.5M50 46.5V53.5";
const OUTSIDE = "M0 0H100V100H0Z M50 0A50 50 0 1 0 50 100A50 50 0 1 0 50 0Z";

const GRID = 64;

function linear(channel: number) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

function useLuminanceGrid(src: string | null) {
  const [grid, setGrid] = useState<LuminanceGrid | null>(null);
  useEffect(() => {
    if (!src) return;
    let active = true;
    const sample = new Image();
    sample.crossOrigin = "anonymous";
    sample.onload = () => {
      if (!active || !sample.naturalWidth || !sample.naturalHeight) return;
      const scale = GRID / Math.max(sample.naturalWidth, sample.naturalHeight);
      const width = Math.max(1, Math.round(sample.naturalWidth * scale));
      const height = Math.max(1, Math.round(sample.naturalHeight * scale));
      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;
        context.drawImage(sample, 0, 0, width, height);
        const { data } = context.getImageData(0, 0, width, height);
        const values = new Float32Array(width * height);
        for (let index = 0; index < values.length; index++) {
          const offset = index * 4;
          values[index] = 0.2126 * linear(data[offset]!) + 0.7152 * linear(data[offset + 1]!) + 0.0722 * linear(data[offset + 2]!);
        }
        setGrid({ width, height, values });
      } catch {
        setGrid(null);
      }
    };
    sample.src = src;
    return () => { active = false; };
  }, [src]);
  return grid;
}

export function AvatarCropSheet(props: AvatarCropSheetProps) {
  const open = props.src !== null;
  const [session, setSession] = useState({ id: 0, src: props.src, open });
  if (open && (!session.open || props.src !== session.src)) setSession({ id: session.id + 1, src: props.src, open: true });
  else if (!open && session.open) setSession({ ...session, open: false });
  return <CropSheet key={session.id} {...props} src={session.src} open={open} />;
}

function CropSheet({ src, open, onClose, onConfirm, busy = false, error, shape = "circle", initialView }: AvatarCropSheetProps & { open: boolean }) {
  const { strings: t } = useCrispStrings();
  const hint = useId();
  const banner = shape === "banner";
  const aspect = banner ? BANNER_ASPECT_RATIO : 1;
  const fit = banner ? "100%" : FIT;
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [view, setView] = useState<CropView>({ zoom: MIN_ZOOM, x: 0, y: 0 });
  const viewport = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, CropPoint>());
  const drag = useRef<{ from: CropPoint; view: CropView } | null>(null);
  const latest = useRef(view);
  latest.current = view;
  const [dragging, setDragging] = useState(false);
  const size: CropSize | null = image ? { width: image.naturalWidth, height: image.naturalHeight } : null;
  const ready = size !== null && !busy;
  const grid = useLuminanceGrid(src);
  const darkCentre = grid && size ? luminanceAt(grid, size, view, 0.12, aspect) < DARK_BELOW : false;
  const darkAxes = grid && size ? luminanceAt(grid, size, view, 0.6, aspect) < DARK_BELOW : false;

  useEffect(() => {
    if (!src) return;
    let active = true;
    const loaded = new Image();
    loaded.onload = () => {
      if (!active || !loaded.naturalWidth || !loaded.naturalHeight) return;
      setView(startView({ width: loaded.naturalWidth, height: loaded.naturalHeight }, aspect, initialView));
      setImage(loaded);
      setFailed(false);
    };
    loaded.onerror = () => { if (active) setFailed(true); };
    loaded.src = src;
    return () => { active = false; };
  }, [src, attempt]);

  const zoomTo = (zoom: number) => { if (size) setView((current) => zoomView(current, zoom, size, undefined, aspect)); };
  const zoomBy = (factor: number, anchor?: CropPoint) => { if (size) setView((current) => zoomView(current, current.zoom * factor, size, anchor, aspect)); };
  const panBy = (delta: CropPoint) => { if (size) setView((current) => panView(current, delta, size, aspect)); };
  const reset = () => { if (size) setView({ zoom: MIN_ZOOM, x: 0, y: 0 }); };
  const center = () => { if (size) setView((current) => panView(current, { x: -current.x, y: -current.y }, size, aspect)); };
  const framed = view.zoom === MIN_ZOOM && view.x === 0 && view.y === 0;
  const centredX = Math.abs(view.x) < 1e-6;
  const centredY = Math.abs(view.y) < 1e-6;
  const anchorDrag = () => {
    const [only] = [...pointers.current.values()];
    drag.current = pointers.current.size === 1 && only ? { from: only, view: latest.current } : null;
  };

  const pair = () => {
    const [a, b] = [...pointers.current.values()];
    return a && b ? { distance: Math.hypot(a.x - b.x, a.y - b.y), middle: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } } : null;
  };

  const down = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!ready || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
    anchorDrag();
    setDragging(true);
  };
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous || !ready) return;
    const before = pair();
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const after = pair();
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    if (before && after) {
      panBy({ x: (after.middle.x - before.middle.x) / rect.width, y: (after.middle.y - before.middle.y) / rect.width });
      if (before.distance > 0) zoomBy(after.distance / before.distance, { x: (after.middle.x - rect.left) / rect.width - 0.5, y: (after.middle.y - rect.top) / rect.width - 0.5 / aspect });
    } else if (drag.current && size) {
      const { from, view: start } = drag.current;
      const x = start.x + (event.clientX - from.x) / rect.width;
      const y = start.y + (event.clientY - from.y) / rect.width;
      setView(panView(start, { x: (Math.abs(x) < SNAP ? 0 : x) - start.x, y: (Math.abs(y) < SNAP ? 0 : y) - start.y }, size, aspect));
    }
  };
  const up = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.delete(event.pointerId)) return;
    anchorDrag();
    if (pointers.current.size === 0) setDragging(false);
  };

  useEffect(() => {
    const element = viewport.current;
    if (!element || !size || busy) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      if (!rect.width) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1;
      const anchor = { x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.width - 0.5 / aspect };
      setView((current) => zoomView(current, current.zoom * Math.exp(-event.deltaY * unit * 0.002), size, anchor, aspect));
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [image, busy, aspect]);

  const keys = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!ready) return;
    const step = event.shiftKey ? FAST_PAN : PAN;
    const pans: Record<string, CropPoint> = { ArrowLeft: { x: -step, y: 0 }, ArrowRight: { x: step, y: 0 }, ArrowUp: { x: 0, y: -step }, ArrowDown: { x: 0, y: step } };
    const pan = pans[event.key];
    if (pan) panBy(pan);
    else if (event.key === "+" || event.key === "=") zoomBy(STEP);
    else if (event.key === "-" || event.key === "_") zoomBy(1 / STEP);
    else if (event.key === "0") reset();
    else if (event.key === "c" || event.key === "C") center();
    else return;
    event.preventDefault();
  };

  const confirm = () => {
    if (!image || !size || busy) return;
    onConfirm(cropRegion(view, size, aspect), image, view);
  };

  const drawn = size ? drawnSize(size, view.zoom, aspect) : null;
  const axis = (centred: boolean) => cn("transition-[stroke] duration-150 motion-reduce:transition-none",
    darkAxes ? (centred ? "stroke-white/70" : dragging ? "stroke-white/35" : "stroke-white/15") : (centred ? "stroke-black/60" : dragging ? "stroke-black/35" : "stroke-black/15"));
  const percent = (value: number) => `${Math.round(value * 100)}%`;

  return <Sheet open={open} onClose={onClose} placement="auto" size="md" title={t.avatarPickerTitle} description={t.avatarPickerDescription}
    footer={<div className="flex items-center justify-end gap-2">
      {!failed && <Button variant="ghost" className="mr-auto" leading={<RotateCcw size={icon.sm} />} disabled={!ready || framed} onClick={reset}>{t.avatarPickerReset}</Button>}
      <Button variant="ghost" onClick={onClose}>{t.avatarPickerCancel}</Button>
      <Button variant="primary" disabled={!size} loading={busy} onClick={confirm}>{t.avatarPickerUse}</Button>
    </div>}>
    {src && <div className="space-y-4">
      {error}
      {failed ? <ErrorState size="sm" title={t.avatarPickerLoadError} retryLabel={t.avatarPickerRetry} onRetry={() => { setFailed(false); setAttempt((value) => value + 1); }} /> : <>
      <div ref={viewport} role="group" aria-roledescription={t.avatarPickerArea} aria-label={t.avatarPickerTitle} aria-describedby={hint}
        tabIndex={size ? 0 : -1} data-no-drag style={{ width: fit, aspectRatio: aspect }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} onKeyDown={keys}
        className={cn("relative mx-auto touch-none select-none overflow-hidden rounded-xl bg-surface-1 outline-none ring-1 ring-inset ring-line-2 focus-visible:ring-2 focus-visible:ring-accent",
          ready && "cursor-grab active:cursor-grabbing")}>
        {image && drawn && <>
          <img src={image.src} alt="" draggable={false} className="pointer-events-none absolute max-w-none"
            style={{ width: `${drawn.width * 100}%`, height: `${drawn.height * aspect * 100}%`, left: `${(0.5 - drawn.width / 2 + view.x) * 100}%`, top: `${(0.5 / aspect - drawn.height / 2 + view.y) * aspect * 100}%` }} />
          <svg aria-hidden="true" viewBox={`0 0 100 ${100 / aspect}`} className="pointer-events-none absolute inset-0 size-full">
            {!banner && <path d={OUTSIDE} fillRule="evenodd" className="fill-black/60" />}
            <g strokeWidth={1} vectorEffect="non-scaling-stroke" className="transition-[stroke] duration-150 motion-reduce:transition-none">
              <line x1={50} y1={0} x2={50} y2={100 / aspect} vectorEffect="non-scaling-stroke" className={axis(centredX)} />
              <line x1={0} y1={50 / aspect} x2={100} y2={50 / aspect} vectorEffect="non-scaling-stroke" className={axis(centredY)} />
            </g>
            <path transform={`translate(0 ${50 / aspect - 50})`} d={CROSS} strokeWidth={4} strokeLinecap="round" vectorEffect="non-scaling-stroke" className={cn("transition-[stroke] duration-150 motion-reduce:transition-none", darkCentre ? "stroke-black/35" : "stroke-white/45")} />
            <path transform={`translate(0 ${50 / aspect - 50})`} d={CROSS} strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" className={cn("transition-[stroke] duration-150 motion-reduce:transition-none", darkCentre ? "stroke-white" : "stroke-black")} />
            {banner ? <>
              {[100 / 3, 200 / 3].map((x) => <line key={`x${x}`} x1={x} y1={0} x2={x} y2={100 / aspect} strokeWidth={1} vectorEffect="non-scaling-stroke" className={axis(false)} />)}
              {[100 / (3 * aspect), 200 / (3 * aspect)].map((y) => <line key={`y${y}`} x1={0} y1={y} x2={100} y2={y} strokeWidth={1} vectorEffect="non-scaling-stroke" className={axis(false)} />)}
              <rect x={0.4} y={0.4} width={99.2} height={100 / aspect - 0.8} fill="none" strokeWidth={2} vectorEffect="non-scaling-stroke" className="stroke-white/85" />
            </> : <circle cx={50} cy={50} r={49.6} fill="none" strokeWidth={2} vectorEffect="non-scaling-stroke" className="stroke-white/85" />}
          </svg>
        </>}
        {!image && <div className="absolute inset-0 flex items-center justify-center"><Spinner /></div>}
      </div>
      <span id={hint} className="sr-only">{t.avatarPickerKeyboardHint}</span>
      <div className="mx-auto flex items-center gap-1" style={{ width: fit }}>
        <IconButton label={t.avatarPickerZoomOut} size="lg" disabled={!ready || view.zoom <= MIN_ZOOM} onClick={() => zoomBy(1 / STEP)}><ZoomOut size={icon.lg} /></IconButton>
        <Slider aria-label={t.avatarPickerZoom} aria-valuetext={percent(view.zoom)} className="min-w-0 flex-1" value={view.zoom} onChange={zoomTo}
          min={MIN_ZOOM} max={MAX_ZOOM} step={0.01} disabled={!ready} showValue={percent} />
        <IconButton label={t.avatarPickerZoomIn} size="lg" disabled={!ready || view.zoom >= MAX_ZOOM} onClick={() => zoomBy(STEP)}><ZoomIn size={icon.lg} /></IconButton>
        <IconButton label={t.avatarPickerCenter} size="lg" disabled={!ready || (centredX && centredY)} onClick={center}><Crosshair size={icon.lg} /></IconButton>
      </div>
      </>}
    </div>}
  </Sheet>;
}
