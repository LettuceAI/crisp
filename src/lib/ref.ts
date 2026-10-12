import type { Ref, RefCallback } from "react";

/**
 * Combines multiple React refs (callback or RefObject) into a single callback ref.
 * Safely handles null and undefined refs.
 */
export function mergeRefs<T>(...refs: (Ref<T> | undefined | null)[]): RefCallback<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(node);
      } else if (typeof ref === "object" && "current" in ref) {
        (ref as { current: T | null }).current = node;
      }
    }
  };
}

/**
 * Extracts the ref from a React element across React 18 (element.ref) and React 19 (element.props.ref).
 */
export function getElementRef<T>(element: unknown): Ref<T> | undefined {
  if (!element || typeof element !== "object") return undefined;
  const el = element as { ref?: Ref<T>; props?: { ref?: Ref<T> } };
  return el.props?.ref ?? el.ref;
}
