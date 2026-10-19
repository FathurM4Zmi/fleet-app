import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Base URL of the FleetOps API.
 *
 * Priority:
 * 1. `EXPO_PUBLIC_API_URL` (set in `.env` or the EAS profile).
 * 2. The LAN host the Expo dev server is served from, so a physical device can
 *    reach the machine running `dotnet run`.
 * 3. Platform fallbacks (`10.0.2.2` on the Android emulator).
 */
const API_PORT = 5196;

function devHostFromExpo(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants.expoGoConfig as { debuggerHost?: string } | undefined)?.debuggerHost;
  const host = hostUri?.split(':')[0];
  if (!host) return null;
  if (host === 'localhost' || host === '127.0.0.1') return null;
  return host;
}

function inferBaseUrl(): string {
  const lanHost = devHostFromExpo();
  if (lanHost) return `http://${lanHost}:${API_PORT}`;
  if (Platform.OS === 'android') return `http://10.0.2.2:${API_PORT}`;
  return `http://127.0.0.1:${API_PORT}`;
}

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? inferBaseUrl()).replace(/\/+$/, '');

export const API_TIMEOUT_MS = 20_000;

/** Absolute URL for a stored evidence path (`uploads/...`). */
export function mediaUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
}
