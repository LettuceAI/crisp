import { useState } from "react";
import { Button, ImageViewer } from "@lettuceai/crisp";

const art = (hue: number) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="hsl(${hue} 60% 45%)"/><circle cx="80" cy="50" r="28" fill="hsl(${hue + 40} 70% 70%)"/></svg>`)}`;

const images = [30, 150, 250].map((hue, i) => ({ src: art(hue), alt: `Picture ${i + 1}`, caption: `Picture ${i + 1} of 3` }));

export default function ImageViewerExample() {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <div className="flex gap-3">
        {images.map((image, i) => (
          <button key={image.alt} type="button" onClick={() => setIndex(i)} aria-label={`Open ${image.alt}`} className="overflow-hidden rounded-lg border border-line">
            <img src={image.src} alt="" className="h-16 w-24 object-cover" />
          </button>
        ))}
      </div>
      <Button variant="ghost" onClick={() => setIndex(0)}>Open the viewer</Button>
      <ImageViewer images={images} index={index} onIndexChange={setIndex} />
    </>
  );
}
