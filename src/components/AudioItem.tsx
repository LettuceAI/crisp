import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Loader2, Pause, Play } from "lucide-react";
import { cn } from "../lib/cn";
import { Badge, type BadgeTone } from "./Badge";

export interface AudioItemProps {
  title: string;
  /** One line under the title when nothing is playing. */
  description?: ReactNode;
  src?: string | null;
  /** Called the first time play is pressed, to fetch the data lazily. */
  onLoadSrc?: () => Promise<string>;
  badge?: { label: string; tone?: BadgeTone };
  /** Trailing slot — an overflow menu. */
  actions?: ReactNode;
  className?: string;
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) value = 0;
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
}

/**
 * A clip in the audio library. The scrub bar is a real range input, so it is
 * keyboard- and screen-reader-operable — the app's version is a div with onClick.
 */
export function AudioItem({ title, description, src: srcProp, onLoadSrc, badge, actions, className }: AudioItemProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wantPlay = useRef(false);
  const [src, setSrc] = useState<string | null>(srcProp ?? null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (srcProp !== undefined) setSrc(srcProp);
  }, [srcProp]);

  const toggle = useCallback(async () => {
    if (!src) {
      if (loading || !onLoadSrc) return;
      wantPlay.current = true;
      setLoading(true);
      try {
        setSrc(await onLoadSrc());
      } catch {
        wantPlay.current = false;
        setLoading(false);
      }
      return;
    }
    const el = audioRef.current;
    if (!el) return;
    if (playing) el.pause();
    else void el.play().catch(() => setPlaying(false));
  }, [src, loading, onLoadSrc, playing]);

  const seek = (value: number) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    el.currentTime = value;
    setCurrent(value);
  };

  const started = Boolean(src) && duration > 0;
  const fill = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className={cn("flex items-center gap-3 rounded-xl border border-line bg-surface-1 p-3 transition-colors hover:border-line-2", className)}>
      <audio
        ref={audioRef}
        src={src ?? undefined}
        preload="metadata"
        className="hidden"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onCanPlay={() => {
          if (!wantPlay.current) return;
          wantPlay.current = false;
          setLoading(false);
          void audioRef.current?.play().catch(() => setPlaying(false));
        }}
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className={cn(
          "touch-target flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          "bg-accent text-on-accent transition-transform motion-instant active:scale-95",
        )}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 truncate text-base font-medium text-fg">{title}</p>
          {badge && <Badge tone={badge.tone} className="shrink-0">{badge.label}</Badge>}
        </div>
        {started ? (
          <div className="flex items-center gap-2.5">
            <input
              type="range"
              className="slider h-4 min-w-0 flex-1"
              min={0}
              max={duration}
              step={0.1}
              value={current}
              onChange={(event) => seek(Number(event.target.value))}
              aria-label={`Seek ${title}`}
              aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
              style={{ ["--slider-fill" as string]: `${fill}%` }}
            />
            <span className="shrink-0 text-2xs tabular-nums text-fg-3">
              {formatTime(current)} / {formatTime(duration)}
            </span>
          </div>
        ) : (
          description && <p className="truncate text-sm text-fg-3">{description}</p>
        )}
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
