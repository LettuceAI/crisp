import type { ReactNode } from "react";

export interface NavDestination<T extends string = string> {
  id: T;
  icon: ReactNode;
  label: string;
  /** A number renders a count; `true` renders a dot. */
  badge?: number | boolean;
}

export interface NavProps<T extends string = string> {
  items: readonly NavDestination<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Primary create action — the one accented control in the whole nav. */
  onCreate?: () => void;
  createLabel?: string;
  /** Pinned to the far end, away from the destinations (settings, account). */
  footerItems?: readonly NavDestination<T>[];
  className?: string;
}
