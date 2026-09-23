import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";
import { Button, type ButtonProps } from "./Button";
import { Menu, MenuContent, MenuTrigger } from "./Menu";

export interface ButtonGroupProps {
  /** Buttons joined into one control — the inner corners are squared off. */
  attached?: boolean;
  className?: string;
  children: ReactNode;
}

export function ButtonGroup({ attached = true, className, children }: ButtonGroupProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<{ className?: string }>[];
  return (
    <div role="group" className={cn("inline-flex", attached ? "-space-x-px" : "gap-2", className)}>
      {items.map((child, index) =>
        cloneElement(child, {
          className: cn(
            child.props.className,
            attached && index > 0 && "rounded-l-none",
            attached && index < items.length - 1 && "rounded-r-none",
            attached && "relative focus-visible:z-10",
          ),
        }),
      )}
    </div>
  );
}

export interface SplitButtonProps extends Omit<ButtonProps, "children"> {
  children: ReactNode;
  /** Menu items for the attached chevron. */
  menu: ReactNode;
  menuLabel?: string;
}

/**
 * A primary action with alternatives behind a chevron. The composer already does this
 * with hold-to-send-as-system — a gesture nobody discovers. On desktop this is the
 * visible version of the same thing.
 */
export function SplitButton({ children, menu, menuLabel = "More actions", variant = "primary", size = "md", ...rest }: SplitButtonProps) {
  return (
    <div className="inline-flex -space-x-px">
      <Button variant={variant} size={size} className="rounded-r-none" {...rest}>
        {children}
      </Button>
      <Menu>
        <MenuTrigger>
          <Button variant={variant} size={size} aria-label={menuLabel} className="rounded-l-none px-2">
            <ChevronDown size={16} />
          </Button>
        </MenuTrigger>
        <MenuContent align="end">{menu}</MenuContent>
      </Menu>
    </div>
  );
}
