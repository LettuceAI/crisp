/**
 * Deterministic tint from a name, used as the backdrop when an item has no image.
 * The app derives this from the avatar's own colours; the fallback only has to be
 * stable, so the same character always looks the same.
 */
export function tintFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  const hue = Math.abs(hash) % 360;
  return {
    hue,
    background: `linear-gradient(160deg, oklch(0.42 0.09 ${hue}), oklch(0.22 0.05 ${(hue + 40) % 360}))`,
  };
}
