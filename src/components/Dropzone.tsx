import { useRef, useState, type DragEvent, type ReactNode } from "react";
import { Upload } from "lucide-react";
import { cn } from "../lib/cn";
import { useFieldContext } from "./Field";

export interface DropzoneProps {
  onFiles: (files: File[]) => void;
  /** An `accept` string, e.g. "image/*" or ".png,.webp". */
  accept?: string;
  multiple?: boolean;
  /** Bytes. Files over this are dropped and reported through `onReject`. */
  maxSize?: number;
  onReject?: (files: File[], reason: "size" | "type") => void;
  disabled?: boolean;
  /** Replaces the default prompt — a preview, say. */
  children?: ReactNode;
  hint?: ReactNode;
  className?: string;
}

/**
 * Drop, click or paste a file. Avatars, character cards, background images and audio
 * all get their own picker today; this is the one, and it keeps the keyboard path —
 * the hidden input is focusable, not `display: none`.
 */
export function Dropzone({
  onFiles, accept, multiple, maxSize, onReject, disabled, children, hint, className,
}: DropzoneProps) {
  const field = useFieldContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const accepts = (file: File) => {
    if (!accept) return true;
    return accept.split(",").some((rule) => {
      const r = rule.trim();
      if (r.endsWith("/*")) return file.type.startsWith(r.slice(0, -1));
      if (r.startsWith(".")) return file.name.toLowerCase().endsWith(r.toLowerCase());
      return file.type === r;
    });
  };

  const handle = (list: FileList | null) => {
    if (!list) return;
    const all = Array.from(list);
    const wrongType = all.filter((f) => !accepts(f));
    const rest = all.filter((f) => accepts(f));
    const tooBig = maxSize ? rest.filter((f) => f.size > maxSize) : [];
    const ok = maxSize ? rest.filter((f) => f.size <= maxSize) : rest;

    if (wrongType.length) onReject?.(wrongType, "type");
    if (tooBig.length) onReject?.(tooBig, "size");
    if (ok.length) onFiles(multiple ? ok : ok.slice(0, 1));
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setOver(false);
    if (!disabled) handle(event.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(event) => { event.preventDefault(); if (!disabled) setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      onPaste={(event) => !disabled && handle(event.clipboardData.files)}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
        over ? "border-accent bg-accent/8" : "border-line-2 bg-surface-1 hover:border-line-3",
        disabled && "pointer-events-none opacity-40",
        className,
      )}
    >
      <input
        ref={inputRef}
        id={field?.id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-describedby={field?.describedBy}
        onChange={(event) => { handle(event.target.files); event.target.value = ""; }}
        /* Invisible but focusable, so the keyboard and screen readers still reach it. */
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      {children ?? (
        <>
          <span className={cn("flex h-10 w-10 items-center justify-center rounded-full", over ? "bg-accent/20 text-accent" : "bg-fill-2 text-fg-3")}>
            <Upload size={18} />
          </span>
          <p className="text-base font-medium text-fg">
            {over ? "Drop to add" : "Drop a file, or click to choose"}
          </p>
          {hint && <p className="text-sm text-fg-3">{hint}</p>}
        </>
      )}
    </div>
  );
}
