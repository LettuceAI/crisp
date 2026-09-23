import type { ReactNode, Ref } from "react";
import { cn } from "../lib/cn";
import { useCompactLayout } from "../lib/useMediaQuery";
import { Dock } from "./Dock";
import { NavRail } from "./NavRail";
import { TabBar } from "./TabBar";
import type { NavDestination } from "./nav";

export type NavStyle = "auto" | "tabs" | "tabsLabelled" | "rail" | "sidebar" | "floatingRail" | "dock" | "header";

export interface AppShellProps<T extends string> {
  items: readonly NavDestination<T>[];
  value: T;
  onChange: (id: T) => void;
  onCreate?: () => void;
  createLabel?: string;
  footerItems?: readonly NavDestination<T>[];
  /**
   * `auto` picks tabs on touch/narrow and a rail on desktop. The others are the
   * user's explicit choice — the app already lets people pick, and a phone-sized
   * window still falls back to tabs so nothing becomes unreachable.
   */
  navStyle?: NavStyle;
  side?: "left" | "right";
  dockEdge?: "top" | "bottom";
  /** Desktop window chrome, rendered above everything. */
  titleBar?: ReactNode;
  /** Header inside the content column. */
  header?: ReactNode;
  /** The scrolling content element — for a header that condenses on scroll, or for
      resetting the scroll position when the page's content changes underneath it. */
  mainRef?: Ref<HTMLElement>;
  /** Content under the destinations — recent chats. Shown folded on the rail too, so
      it does not appear and vanish as the sidebar opens and closes. */
  navSection?: ReactNode;
  /** Let the person switch the side navigation between sidebar and rail. */
  onNavToggle?: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * The application frame. Owns where navigation lives so pages never have to think
 * about it: on a phone the bar is at the bottom, on desktop the rail is at the side,
 * and the content column is the same component either way.
 *
 * It fills its parent (`h-full`). Mounted at the app root, give it a real height —
 * `<AppShell className="h-dvh">` — since #root only sets a min-height.
 */
export function AppShell<T extends string>({
  items, value, onChange, onCreate, createLabel, footerItems, navStyle = "auto",
  side = "left", dockEdge = "bottom", titleBar, header, mainRef, navSection, onNavToggle, children, className,
}: AppShellProps<T>) {
  const compact = useCompactLayout();
  const style: NavStyle = navStyle === "auto" ? (compact ? "tabs" : "rail") : navStyle;
  /* A phone-sized window can't host a rail or a dock; fall back rather than clip. */
  const resolved: NavStyle = compact && (style === "rail" || style === "sidebar" || style === "floatingRail" || style === "dock") ? "tabs" : style;

  const navProps = { items, value, onChange, onCreate, createLabel, footerItems };
  const sideNav = resolved === "rail" || resolved === "sidebar" || resolved === "floatingRail";

  return (
    <div className={cn("relative flex h-full flex-col overflow-hidden bg-surface text-fg", className)}>
      {titleBar}
      <div className={cn("flex min-h-0 flex-1", side === "right" && "flex-row-reverse")}>
        {sideNav &&
          (resolved === "floatingRail" ? (
            <div className={cn("absolute top-1/2 z-30 -translate-y-1/2", side === "left" ? "left-4" : "right-4")}>
              <NavRail {...navProps} side={side} floating />
            </div>
          ) : (
            <NavRail
              {...navProps}
              side={side}
              variant={resolved === "sidebar" ? "sidebar" : "rail"}
              section={navSection}
              onToggle={onNavToggle}
            />
          ))}

        <div className={cn("@container flex min-w-0 flex-1 flex-col", resolved === "floatingRail" && (side === "left" ? "pl-20" : "pr-20"))}>
          {header}
          <main ref={mainRef} className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>

      {resolved === "dock" && (
        <div className={cn("pointer-events-none absolute inset-x-0 z-30 flex justify-center", dockEdge === "bottom" ? "bottom-4" : "top-4")}>
          <div className="pointer-events-auto">
            <Dock {...navProps} edge={dockEdge} />
          </div>
        </div>
      )}

      {(resolved === "tabs" || resolved === "tabsLabelled") && (
        <TabBar {...navProps} showLabels={resolved === "tabsLabelled"} />
      )}
    </div>
  );
}
