/**
 * The icon ladder. Five steps, mapped to what an icon sits next to, so nobody has to
 * pick a number again.
 *
 * Before this file Crisp had eleven sizes in use — 10, 11, 12, 13, 14, 15, 16, 17, 18,
 * 20, 22 — which is the same drift the README criticises the app for. Fifteen next to
 * sixteen is a difference nobody sees and everybody maintains.
 *
 * Type, spacing, radius, density and motion all went through a scale. This is the one
 * axis that never did.
 */
export const icon = {
  /** Inline with 11–12px meta: a pin beside a timestamp, a dot in a badge. */
  xs: 12,
  /** Small controls and dense rows — `sm` buttons, chips, clear buttons. */
  sm: 14,
  /** The default. `md` controls, menu items, inputs, a chevron. */
  md: 16,
  /** `lg` controls, the icon tile in a list row, toolbars, nav destinations. */
  lg: 18,
  /** Standing alone with no label: empty states, a composer's primary action. */
  xl: 20,
} as const;

export type IconSize = keyof typeof icon;
