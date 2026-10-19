import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'fleetops.driver.token';
const PROFILE_KEY = 'fleetops.driver.profile';

/**
 * SecureStore has no web implementation; `localStorage` is used there only for
 * the Expo web preview. Native builds always go through the Keychain/Keystore.
 */
const isWeb = Platform.OS === 'web';

async function read(key: string): Promise<string | null> {
  if (isWeb) {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

async function write(key: string, value: string | null): Promise<void> {
  if (isWeb) {
    try {
      if (value === null) globalThis.localStorage?.removeItem(key);
      else globalThis.localStorage?.setItem(key, value);
    } catch {
      // Storage disabled — the session simply won't survive a reload.
    }
    return;
  }
  if (value === null) await SecureStore.deleteItemAsync(key);
  else await SecureStore.setItemAsync(key, value);
}

export interface StoredSession {
  token: string;
  driverId: string;
  name: string;
  expiresAt: string | null;
}

let cachedToken: string | null = null;

export async function loadSession(): Promise<StoredSession | null> {
  const [token, rawProfile] = await Promise.all([read(TOKEN_KEY), read(PROFILE_KEY)]);
  if (!token || !rawProfile) {
    cachedToken = null;
    return null;
  }
  cachedToken = token;
  try {
    return { token, ...(JSON.parse(rawProfile) as Omit<StoredSession, 'token'>) };
  } catch {
    return null;
  }
}

export async function saveSession(session: StoredSession): Promise<void> {
  cachedToken = session.token;
  const { token, ...profile } = session;
  await Promise.all([write(TOKEN_KEY, token), write(PROFILE_KEY, JSON.stringify(profile))]);
}

export async function clearSession(): Promise<void> {
  cachedToken = null;
  await Promise.all([write(TOKEN_KEY, null), write(PROFILE_KEY, null)]);
}

/** Synchronous read used by the API client on every request. */
export function currentToken(): string | null {
  return cachedToken;
}
