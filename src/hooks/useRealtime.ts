import { useEffect, useRef } from 'react';

import { subscribeRealtime, type RealtimeScope } from '@/lib/realtime';

/**
 * Runs `onEvent` when the server pushes a change for `scope`.
 *
 * The callback lives in a ref so callers can pass an inline arrow function
 * (`() => void refetch()`) without re-subscribing on every render.
 */
export function useRealtime(scope: RealtimeScope, onEvent: () => void) {
  const handler = useRef(onEvent);

  useEffect(() => {
    handler.current = onEvent;
  }, [onEvent]);

  useEffect(
    () =>
      subscribeRealtime((changed) => {
        if (changed === scope) handler.current();
      }),
    [scope],
  );
}
