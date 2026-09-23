import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { IconButton } from "./IconButton";

export interface ViewerImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ImageViewerProps {
  images: readonly ViewerImage[];
  /** Index to show; null closes the viewer. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

/**
 * Full-screen image inspection for the image library and chat attachments. Arrow keys
 * page, Escape closes, +/- zoom, and a zoomed image pans by drag.
 */
export function ImageViewer({ images, index, onIndexChange }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const open = index !== null;
  const image = open ? images[index] : null;
  const restore = useRef<HTMLElement | null>(null);

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndexChange(Math.min(images.length - 1, Math.max(0, index + delta)));
      setZoom(1);
    },
    [index, images.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onIndexChange(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "+" || event.key === "=") setZoom((z) => Math.min(4, z + 0.5));
      if (event.key === "-") setZoom((z) => Math.max(1, z - 0.5));
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      restore.current?.focus?.();
    };
  }, [open, onIndexChange, step]);

  useEffect(() => { if (!open) setZoom(1); }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && image && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={m.quick}
          className="fixed inset-0 z-[90] flex flex-col bg-black/90 backdrop-blur-sm"
        >
          <div className="flex shrink-0 items-center gap-2 p-3">
            <span className="min-w-0 flex-1 truncate text-sm text-white/70">{image.alt}</span>
            <span className="shrink-0 text-sm tabular-nums text-white/50">{index + 1} / {images.length}</span>
            <IconButton label="Zoom out" shape="round" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} className="text-white/70 hover:text-white">
              <ZoomOut size={18} />
            </IconButton>
            <IconButton label="Zoom in" shape="round" onClick={() => setZoom((z) => Math.min(4, z + 0.5))} className="text-white/70 hover:text-white">
              <ZoomIn size={18} />
            </IconButton>
            <IconButton label="Close" shape="round" onClick={() => onIndexChange(null)} className="text-white/70 hover:text-white" data-autofocus>
              <X size={18} />
            </IconButton>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4">
            <motion.img
              key={image.src}
              src={image.src}
              alt={image.alt}
              drag={zoom > 1}
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: zoom }}
              transition={m.quick}
              className={cn("max-h-full max-w-full object-contain", zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in")}
              onClick={() => zoom === 1 && setZoom(2)}
            />
            {images.length > 1 && (
              <>
                <IconButton label="Previous image" shape="round" onClick={() => step(-1)} disabled={index === 0} className="absolute left-3 text-white/70 hover:text-white">
                  <ChevronLeft size={20} />
                </IconButton>
                <IconButton label="Next image" shape="round" onClick={() => step(1)} disabled={index === images.length - 1} className="absolute right-3 text-white/70 hover:text-white">
                  <ChevronRight size={20} />
                </IconButton>
              </>
            )}
          </div>

          {image.caption && <p className="shrink-0 px-4 pb-4 text-center text-sm text-white/60">{image.caption}</p>}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
