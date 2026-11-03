import { useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";
import { icon } from "../lib/icon";
import { Avatar, type AvatarProps } from "./Avatar";
import { AvatarCropSheet } from "./AvatarCropSheet";
import { Dropzone } from "./Dropzone";
import { useCrispStrings } from "../lib/strings";

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
  const { strings: t } = useCrispStrings();
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
          <button type="button" aria-label={t.avatarPickerRemove} onClick={() => onChange(null)} className="absolute -left-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-line-2 bg-surface-2 text-fg-3 shadow-raised hover:text-danger">
            <Trash2 size={icon.xs} />
          </button>
        )}
      </div>
      <AvatarCropSheet src={pending} onClose={() => setPending(null)} onConfirm={(region, image) => {
        const canvas = document.createElement("canvas");
        canvas.width = output;
        canvas.height = output;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(image, region.x, region.y, region.size, region.size, 0, 0, output, output);
        onChange(canvas.toDataURL("image/webp", 0.9));
        setPending(null);
      }} />
    </>
  );
}
