import { Fragment, type ReactNode } from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/cn";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "./Menu";

export interface Crumb {
  label: string;
  icon?: ReactNode;
  /** Omit on the last crumb — the page you are on is not a link. */
  onClick?: () => void;
  href?: string;
}

export interface BreadcrumbProps {
  items: readonly Crumb[];
  /**
   * Keep the first crumb and the last `n`; everything between collapses into a menu.
   * Deep settings paths would otherwise wrap or scroll on a phone. Default 1.
   */
  maxVisible?: number;
  className?: string;
}

function CrumbLink({ crumb, current }: { crumb: Crumb; current: boolean }) {
  const content = (
    <>
      {crumb.icon && <span className="shrink-0">{crumb.icon}</span>}
      <span className="truncate">{crumb.label}</span>
    </>
  );
  const shared = "inline-flex min-w-0 items-center gap-1.5 rounded-md px-1 py-0.5 text-sm";

  if (current) {
    return (
      <span aria-current="page" className={cn(shared, "font-medium text-fg")}>
        {content}
      </span>
    );
  }
  if (crumb.href) {
    return (
      <a href={crumb.href} className={cn(shared, "text-fg-3 transition-colors hover:text-fg")}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={crumb.onClick} className={cn(shared, "text-fg-3 transition-colors hover:text-fg")}>
      {content}
    </button>
  );
}

/**
 * Where you are in a nested screen. Desktop shows the whole path; on a narrow
 * viewport the middle collapses into a menu rather than wrapping to a second line.
 * It complements the back button, it does not replace it.
 */
export function Breadcrumb({ items, maxVisible = 1, className }: BreadcrumbProps) {
  if (items.length === 0) return null;

  const tailCount = Math.max(1, maxVisible);
  const collapses = items.length > tailCount + 2;
  const head = collapses ? items[0] : null;
  const hidden = collapses ? items.slice(1, items.length - tailCount) : [];
  const tail = collapses ? items.slice(items.length - tailCount) : items;

  const separator = (
    <ChevronRight size={14} className="shrink-0 text-fg-4" aria-hidden="true" />
  );

  return (
    <nav aria-label="Breadcrumb" className={cn("flex min-w-0 items-center gap-1", className)}>
      {head && (
        <>
          <CrumbLink crumb={head} current={false} />
          {separator}
          <Menu>
            <MenuTrigger>
              <button
                type="button"
                aria-label={`${hidden.length} more levels`}
                className="tap-target flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg"
              >
                <MoreHorizontal size={14} />
              </button>
            </MenuTrigger>
            <MenuContent>
              {hidden.map((crumb) => (
                <MenuItem key={crumb.label} icon={crumb.icon} onSelect={crumb.onClick}>
                  {crumb.label}
                </MenuItem>
              ))}
            </MenuContent>
          </Menu>
          {separator}
        </>
      )}
      {tail.map((crumb, index) => (
        <Fragment key={crumb.label}>
          {index > 0 && separator}
          <CrumbLink crumb={crumb} current={index === tail.length - 1} />
        </Fragment>
      ))}
    </nav>
  );
}
