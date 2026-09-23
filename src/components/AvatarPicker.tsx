import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Camera, Trash2, ZoomIn } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { Avatar, type AvatarProps } from "./Avatar";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { Dropzone } from "./Dropzone";
import { Slider } from "./Slider";

export interface AvatarPickerProps {
  value: string | null;
  /** Called with a square data URL, or null when the picture is removed. */
  onChange: (dataUrl: string | null) => void;
  /** Initials when there's no picture. */
  name?: string;
  size?: AvatarProps["size"];
  /** Pixel size of the square that comes out. Default 512. */
  output?: number;
  /** Skip the crop step and take the picture as it comes. */
  crop?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * The avatar as a target: tap or drop to pick, then frame it — drag to move, slide to
 * zoom — and out comes a square. Characters, personas and groups all start here.
 */
export function AvatarPicker({ value, onChange, name = "?", size = "xl", output = 512, crop = true, disabled, className }: AvatarPickerProps) {
  const [pending, setPending] = useState<string | null>(null);

  const read = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => (crop ? setPending(String(reader.result)) : onChange(String(reader.result)));
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className={cn("relative w-fit", className)}>
        <Dropzone accept="image/*" disabled={disabled} onFiles={([f]) => f && read(f)} className="rounded-full p-0">
          <div className="relative">
            <Avatar src={value ?? undefined} name={name} size={size} className={cn(size === "xl" && "h-28 w-28 text-3xl")} />
            <span aria-hidden="true" className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-line-2 bg-surface-2 text-fg shadow-raised">
              <Camera size={icon.md} />
            </span>
          </div>
        </Dropzone>
        {value && !disabled && (
          <button type="button" aria-label="Remove picture" onClick={() => onChange(null)} className="absolute -left-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-line-2 bg-surface-2 text-fg-3 shadow-raised hover:text-danger">
            <Trash2 size={icon.xs} />
          </button>
        )}
      </div>
      <CropDialog src={pending} output={output} onClose={() => setPending(null)} onDone={(url) => { onChange(url); setPending(null); }} />
    </>
  );
}

const BOX = 288;

function CropDialog({ src, output, onClose, onDone }: { src: string | null; output: number; onClose: () => void; onDone: (url: string) => void }) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  useEffect(() => {
    if (!src) { setImg(null); return; }
    const el = new Image();
    el.onload = () => { setImg(el); setZoom(1); setPos({ x: 0, y: 0 }); };
    el.src = src;
  }, [src]);

  /* The picture covers the box at zoom 1; zoom scales from there. */
  const base = img ? Math.max(BOX / img.width, BOX / img.height) : 1;
  const scale = base * zoom;
  const w = (img?.width ?? 0) * scale;
  const h = (img?.height ?? 0) * scale;
  const clamp = (p: { x: number; y: number }) => ({
    x: Math.min(Math.max(p.x, BOX - w), 0),
    y: Math.min(Math.max(p.y, BOX - h), 0),
  });
  const shown = clamp({ x: pos.x + (BOX - w) / 2, y: pos.y + (BOX - h) / 2 });

  const down = (e: ReactPointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: ReactPointerEvent) => {
    if (!drag.current) return;
    setPos({ x: drag.current.px + e.clientX - drag.current.x, y: drag.current.py + e.clientY - drag.current.y });
  };
  const up = () => { drag.current = null; };

  const done = () => {
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = output;
    canvas.height = output;
    const ctx = canvas.getContext("2d")!;
    const k = output / BOX;
    ctx.drawImage(img, shown.x * k, shown.y * k, w * k, h * k);
    onDone(canvas.toDataURL("image/webp", 0.9));
  };

  return (
    <Dialog
      open={Boolean(src)}
      onClose={onClose}
      title="Frame the picture"
      description="Drag to move, slide to zoom. What's in the circle is the avatar."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={!img} onClick={done}>Use picture</Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4">
        <div
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          className="relative cursor-grab touch-none select-none overflow-hidden rounded-2xl bg-black active:cursor-grabbing"
          style={{ width: BOX, height: BOX }}
        >
          {img && <img src={img.src} alt="" draggable={false} className="absolute max-w-none" style={{ width: w, height: h, left: shown.x, top: shown.y }} />}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_0_9999px_rgb(0_0_0/0.5)] [mask-image:radial-gradient(circle_at_center,transparent_49%,black_50%)]" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/70" />
        </div>
        <div className="flex w-full items-center gap-3">
          <ZoomIn size={icon.md} className="shrink-0 text-fg-3" />
          <Slider aria-label="Zoom" value={zoom} onChange={setZoom} min={1} max={3} step={0.01} className="flex-1" />
        </div>
      </div>
    </Dialog>
  );
}
