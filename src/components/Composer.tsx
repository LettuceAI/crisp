import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Check, ChevronsRight, Loader2, Mic, Plus, Square, X } from "lucide-react";
import { cn } from "../lib/cn";
import { motion as m } from "../lib/motion";
import { useLongPress } from "../lib/useLongPress";
import { IconButton } from "./IconButton";
import { useCrispStrings } from "../lib/strings";

export interface ComposerAttachment {
  id: string;
  /** Image data URL, or undefined for non-image files (shown as a chip). */
  src?: string;
  name?: string;
}

export interface ComposerMic {
  active: boolean;
  transcribing?: boolean;
  elapsedMs: number;
  analyser: AnalyserNode | null;
  /** The input level from 0 to 1, for a recorder that has no `analyser` in the page. */
  level?: number;
  onStart: () => void;
  onStop: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  /** Shown while `sending`; if absent the button just spins. */
  onStop?: () => void;
  /** Empty composer + tap send = let the character continue. */
  onContinue?: () => void;
  /** Long-press / right-click on send. */
  onSendAsSystem?: () => void;
  onAttach?: () => void;
  attachments?: ComposerAttachment[];
  onRemoveAttachment?: (id: string) => void;
  mic?: ComposerMic;
  sending?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Enter sends on desktop; on touch, Enter is a newline. */
  enterSends?: boolean;
  /** Rendered above the pill — an <Alert>. */
  notice?: ReactNode;
  /** Slot inside the pill above the input — author's note, quick snippets. */
  topSlot?: ReactNode;
  /** Size of the typed text. Follows the chat's text size so a reply and a draft read alike. */
  fontSize?: "small" | "medium" | "large" | "xlarge";
  /** Fill for the pill, any CSS colour. Kept slightly translucent so the frost still shows. */
  color?: string;
  className?: string;
}

const composerText = {
  small: { className: "text-sm", line: "1.25rem" },
  medium: { className: "text-base", line: "1.25rem" },
  large: { className: "text-lg", line: "1.5rem" },
  xlarge: { className: "text-xl", line: "1.75rem" },
} as const;

type Action = "stop" | "send" | "busy" | "continue";

export function Composer({
  value, onChange, onSend, onStop, onContinue, onSendAsSystem, onAttach, attachments = [], onRemoveAttachment,
  mic, sending = false, disabled = false, placeholder, enterSends = true, notice, topSlot, fontSize = "medium", color, className,
}: ComposerProps) {
  const { strings: t } = useCrispStrings();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasDraft = value.trim().length > 0;
  const hasContent = hasDraft || attachments.length > 0;
  const recording = Boolean(mic?.active);

  const action: Action = sending ? (onStop ? "stop" : "busy") : hasContent ? "send" : "continue";
  const actionDisabled = disabled || action === "busy" || (action === "continue" && !onContinue);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    const box = el?.parentElement;
    if (!el || !box) return;
    const held = box.style.height;
    box.style.height = `${box.offsetHeight}px`;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    box.style.height = held;
  }, [value]);

  const longPress = useLongPress(onSendAsSystem, { enabled: action === "send" && !disabled });

  const runAction = () => {
    if (action === "stop") onStop?.();
    else if (action === "send") onSend();
    else if (action === "continue") onContinue?.();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!enterSends || event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (!sending && !disabled && hasContent) onSend();
  };

  const actionStyle: Record<Action, string> = {
    stop: "bg-danger text-fg",
    send: "bg-accent text-on-accent",
    busy: "bg-fill-3 text-fg-3",
    continue: "border border-accent/30 bg-accent/15 text-accent",
  };
  const actionLabel: Record<Action, string> = {
    stop: t.composerStop,
    send: t.composerSend,
    busy: t.composerSending,
    continue: t.composerContinue,
  };
  const actionIcon: Record<Action, ReactNode> = {
    stop: <Square size={14} fill="currentColor" />,
    send: <ArrowUp size={18} strokeWidth={2.5} />,
    busy: <Loader2 size={18} className="animate-spin" />,
    continue: <ChevronsRight size={18} />,
  };

  return (
    <div className={cn("space-y-2", className)}>
      {notice}
      <div
        className={cn(
          "rounded-[26px] border border-line bg-surface-el/85 shadow-raised backdrop-blur-md transition-colors motion-instant",
          disabled && "opacity-60",
        )}
        style={color ? { backgroundColor: `color-mix(in oklab, ${color} 85%, transparent)` } : undefined}
      >
        {topSlot && <div className="border-b border-line px-3 py-2">{topSlot}</div>}

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="group relative">
                {attachment.src ? (
                  <img src={attachment.src} alt={attachment.name ?? t.composerAttachment} className="h-14 w-14 rounded-lg border border-line object-cover" />
                ) : (
                  <span className="inline-flex h-9 max-w-48 items-center truncate rounded-lg border border-line bg-fill px-3 text-sm text-fg-2">{attachment.name ?? t.composerFile}</span>
                )}
                {onRemoveAttachment && (
                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(attachment.id)}
                    aria-label={t.composerAttachmentRemove(attachment.name)}
                    className="tap-target absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface/80 text-fg backdrop-blur-sm transition-colors hover:bg-danger"
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="composer-row flex items-end gap-1 p-1">
          {onAttach && (
            <IconButton label={t.composerAddAttachment} shape="round" size="md" onClick={onAttach} disabled={disabled || sending || recording}>
              <Plus size={18} />
            </IconButton>
          )}

          {recording && mic ? (
            <RecordingWave elapsedMs={mic.elapsedMs} analyser={mic.analyser} level={mic.level} frozen={mic.transcribing} />
          ) : (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder ?? t.composerPlaceholder}
              rows={1}
              disabled={disabled || sending}
              aria-label={t.composerMessage}
              /* One line is exactly as tall as the buttons beside it — both read
                 --composer-row — so under items-end the text and the icons share a
                 centre. At 40px against 44px buttons it sat 2px low. */
              className={cn(
                "scrollbar-none min-h-[var(--composer-row)] flex-1 resize-none bg-transparent px-2 py-[calc((var(--composer-row)-var(--composer-line))/2)] leading-[var(--composer-line)] text-fg outline-none placeholder:text-fg-3 disabled:cursor-not-allowed",
                composerText[fontSize].className,
              )}
              style={{ "--composer-line": composerText[fontSize].line } as CSSProperties}
            />
          )}

          {mic && (
            recording ? (
              <>
                <IconButton label={t.composerCancelRecording} shape="round" size="md" onClick={mic.onCancel} disabled={mic.transcribing}>
                  <X size={16} />
                </IconButton>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={mic.onStop}
                  disabled={mic.transcribing}
                  aria-label={mic.transcribing ? t.composerTranscribing : t.composerStopAndTranscribe}
                  className="touch-target control-md flex w-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent disabled:opacity-70"
                >
                  {mic.transcribing ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={2.5} />}
                </motion.button>
              </>
            ) : (
              <IconButton label={t.composerRecordVoice} shape="round" size="md" onClick={mic.onStart} disabled={disabled || sending || mic.disabled}>
                <Mic size={16} />
              </IconButton>
            )
          )}

          {!recording && (
            <motion.button
              type="button"
              whileTap={actionDisabled ? undefined : { scale: 0.94 }}
              disabled={actionDisabled}
              aria-label={actionLabel[action]}
              title={action === "send" && onSendAsSystem ? t.composerSendAsSystem : actionLabel[action]}
              onClick={longPress.guardClick(runAction)}
              {...longPress.handlers}
              className={cn(
                "touch-target control-md relative flex w-10 shrink-0 items-center justify-center rounded-full transition-colors motion-instant",
                "disabled:cursor-not-allowed disabled:opacity-40",
                actionStyle[action],
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={action}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={m.instant}
                  className="flex"
                >
                  {actionIcon[action]}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** Live waveform while recording. Same sampling as the app; drawn in tokens. */
export function RecordingWave({ elapsedMs, analyser, level, frozen = false }: { elapsedMs: number; analyser: AnalyserNode | null; level?: number; frozen?: boolean }) {
  const { strings: t } = useCrispStrings();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const samplesRef = useRef<number[]>([]);
  const dataRef = useRef<Uint8Array | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const levelRef = useRef(level);
  levelRef.current = level;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: Math.floor(rect.width), h: Math.floor(rect.height) });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    samplesRef.current = [];
    dataRef.current = analyser ? new Uint8Array(new ArrayBuffer(analyser.fftSize)) : null;
  }, [analyser]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.w <= 0) return;
    const dpr = window.devicePixelRatio || 1;
    const height = size.h || 20;
    canvas.width = Math.floor(size.w * dpr);
    canvas.height = Math.floor(height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const color = getComputedStyle(canvas).color;
    const BAR = 2, GAP = 2, STEP = BAR + GAP, INTERVAL = 50;
    const maxBars = Math.ceil(size.w / STEP) + 4;
    let lastPush = 0;
    let frame = 0;

    const draw = (now: number) => {
      if (!frozen && analyser && dataRef.current && now - lastPush >= INTERVAL) {
        analyser.getByteTimeDomainData(dataRef.current as Uint8Array<ArrayBuffer>);
        let sumSq = 0;
        for (const byte of dataRef.current) { const v = (byte - 128) / 128; sumSq += v * v; }
        const rms = Math.sqrt(sumSq / dataRef.current.length);
        samplesRef.current.push(Math.min(1, Math.pow(rms * 18, 0.5)));
        if (samplesRef.current.length > maxBars) samplesRef.current.splice(0, samplesRef.current.length - maxBars);
        lastPush = now;
      } else if (!frozen && !analyser && levelRef.current !== undefined && now - lastPush >= INTERVAL) {
        samplesRef.current.push(Math.min(1, Math.max(0, Math.pow(levelRef.current, 0.5))));
        if (samplesRef.current.length > maxBars) samplesRef.current.splice(0, samplesRef.current.length - maxBars);
        lastPush = now;
      }
      ctx.clearRect(0, 0, size.w, height);
      const samples = samplesRef.current;
      for (let i = Math.max(0, samples.length - maxBars); i < samples.length; i++) {
        const age = samples.length - 1 - i;
        const x = size.w - BAR - age * STEP;
        if (x + BAR < 0) break;
        const h = Math.max(3, samples[i] * (height - 2));
        ctx.globalAlpha = 0.95 - (age / Math.max(1, maxBars - 1)) * 0.35;
        ctx.fillStyle = color;
        ctx.fillRect(x, height / 2 - h / 2, BAR, h);
      }
      frame = window.requestAnimationFrame(draw);
    };
    frame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frame);
  }, [analyser, size.w, size.h, frozen]);

  return (
    <div className="flex min-h-[var(--composer-row)] min-w-0 flex-1 items-center gap-2.5 px-2" role="status" aria-live="polite" aria-label={frozen ? t.composerTranscribing : t.composerRecording(formatElapsed(elapsedMs))}>
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        {!frozen && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-60" />}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", frozen ? "bg-fg-3" : "bg-danger")} />
      </span>
      <div
        ref={containerRef}
        className="relative h-5 min-w-0 flex-1 overflow-hidden text-fg"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 40px)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 40px)",
        }}
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line-2" />
        <canvas ref={canvasRef} className="relative block h-full w-full" style={{ width: size.w || undefined }} />
      </div>
      <span className="shrink-0 text-xs tabular-nums text-fg-2">{formatElapsed(elapsedMs)}</span>
    </div>
  );
}
