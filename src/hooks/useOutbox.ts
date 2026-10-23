import NetInfo from '@react-native-community/netinfo';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import {
  flushOutbox,
  getOutbox,
  loadOutbox,
  subscribeOutbox,
  type OutboxItem,
} from '@/lib/offline/queue';

/**
 * Keeps the offline outbox in sync with the server:
 * - once on mount (app start),
 * - whenever connectivity returns,
 * - whenever the app comes back to the foreground.
 */
export function useOutbox() {
  const [items, setItems] = useState<OutboxItem[]>(getOutbox());
  const [syncing, setSyncing] = useState(false);
  const running = useRef(false);

  useEffect(() => {
    void loadOutbox();
    return subscribeOutbox(setItems);
  }, []);

  const sync = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    setSyncing(true);
    try {
      await flushOutbox();
    } finally {
      running.current = false;
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    void sync();

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      if (state.isConnected) void sync();
    });

    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') void sync();
    });

    return () => {
      unsubscribeNetInfo();
      appState.remove();
    };
  }, [sync]);

  return { items, pending: items.length, syncing, sync };
}
