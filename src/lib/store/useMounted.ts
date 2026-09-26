'use client';

import { useSyncExternalStore } from 'react';

/** Nothing to subscribe to: mounted-ness is a one-way transition, not a stream. */
const subscribe = () => () => {};

/**
 * False while rendering on the server and during hydration, true afterwards.
 *
 * Use this to gate anything that depends on browser-only state — localStorage
 * backed Zustand stores, `Date.now()`, locale-sensitive formatting. A persisted
 * store rehydrates synchronously while its module is imported, i.e. *before*
 * React hydrates, so trusting a store's contents on the first render is exactly
 * what produces a hydration mismatch: the server HTML holds the seed data while
 * the client immediately swaps in the real data.
 *
 * Implemented with `useSyncExternalStore` rather than `useState` + `useEffect`
 * so the flip happens in the commit phase without an extra render pass.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
