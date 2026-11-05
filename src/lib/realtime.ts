import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';

import { API_BASE_URL } from '@/lib/api/config';
import { currentToken } from '@/lib/auth/session';

/**
 * Scopes the server pushes on `dataChanged`. The payload carries only the scope
 * name — each screen knows how to refresh itself, so one event can serve several
 * FRDs without a bespoke payload per feature.
 */
export type RealtimeScope = 'notifications' | 'trips' | 'dna' | 'vehicle' | 'alerts';

type Listener = (scope: string) => void;

/** The API may still be booting when the app opens; retry quietly. */
const RETRY_MS = 10_000;

let connection: HubConnection | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let stopped = true;

const listeners = new Set<Listener>();

function clearRetry() {
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
}

async function connect() {
  if (stopped || connection) return;
  if (!currentToken()) return;

  const next = new HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/hubs/driver`, {
      accessTokenFactory: () => currentToken() ?? '',
    })
    .withAutomaticReconnect([0, 2_000, 5_000, 10_000, 30_000])
    .configureLogging(LogLevel.None)
    .build();

  next.on('dataChanged', (scope: string) => {
    for (const listener of listeners) listener(scope);
  });

  try {
    await next.start();
    connection = next;
  } catch {
    // Offline or the API is not up yet — never block the UI, just try again.
    clearRetry();
    retryTimer = setTimeout(() => void connect(), RETRY_MS);
  }
}

/** Called once the driver is authenticated (see `(app)/_layout`). */
export function startRealtime() {
  stopped = false;
  void connect();
}

/** Called on logout so the socket does not outlive the session. */
export async function stopRealtime() {
  stopped = true;
  clearRetry();
  const current = connection;
  connection = null;
  if (!current) return;
  try {
    await current.stop();
  } catch {
    // Already closed — nothing to clean up.
  }
}

export function subscribeRealtime(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
