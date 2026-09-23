import type { ReactNode, Ref } from "react";
import { cn } from "../lib/cn";
import { AppBar, type AppBarProps } from "./AppBar";

export interface PageProps extends AppBarProps {
  /** Pinned under the content — an ActionBar, a composer. */
  footer?: ReactNode;
  /** The scrolling element, for AppBar's condensing title and scroll-to-top. */
  mainRef?: Ref<HTMLElement>;
  /** Padding around the content. `none` for lists that run edge to edge. */
  padding?: "default" | "none";
  contentClassName?: string;
  children: ReactNode;
}

/**
 * A screen of its own: the header, a scrolling body and, if there is one, a footer
 * that stays put. On the desktop it sits inside AppShell like any page; on the phone
 * it takes the whole screen — a sub-page has the back arrow, not the tab bar.
 */
export function Page({ footer, mainRef, padding = "default", contentClassName, className, children, ...bar }: PageProps) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto">
        <AppBar scrollRef={mainRef as AppBarProps["scrollRef"]} {...bar} />
        <div className={cn(padding === "default" && "px-4 pb-10 pt-1 @xl:px-6", contentClassName)}>{children}</div>
      </main>
      {footer}
    </div>
  );
}
