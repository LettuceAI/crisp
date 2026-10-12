import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False while the server's markup is being hydrated, true after: for anything that reads browser-only state. */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
