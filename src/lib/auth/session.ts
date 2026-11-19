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
  /** FRD-MOB-LOGIN-02 — token untuk memperpanjang sesi tanpa login ulang. */
  refreshToken?: string | null;
}

let cachedToken: string | null = null;
let cachedRefreshToken: string | null = null;

/** A stored token past its `expiresAt` must never be treated as a session. */
function isExpired(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false;
  const timestamp = new Date(expiresAt).getTime();
  if (!Number.isFinite(timestamp)) return true;
  return timestamp <= Date.now();
}

export async function loadSession(): Promise<StoredSession | null> {
  const [token, rawProfile] = await Promise.all([read(TOKEN_KEY), read(PROFILE_KEY)]);
  if (!token || !rawProfile) {
    cachedToken = null;
    cachedRefreshToken = null;
    return null;
  }
  try {
    const session: StoredSession = {
      token,
      ...(JSON.parse(rawProfile) as Omit<StoredSession, 'token'>),
    };
    // Sesi kedaluwarsa masih bisa dipakai bila refresh token tersedia: permintaan
    // pertama akan 401 lalu ditukar otomatis oleh API client (FRD-MOB-LOGIN-02).
    if (isExpired(session.expiresAt) && !session.refreshToken) {
      await clearSession();
      return null;
    }
    cachedToken = token;
    cachedRefreshToken = session.refreshToken ?? null;
    return session;
  } catch {
    cachedToken = null;
    cachedRefreshToken = null;
    return null;
  }
}

export async function saveSession(session: StoredSession): Promise<void> {
  cachedToken = session.token;
  cachedRefreshToken = session.refreshToken ?? null;
  const { token, ...profile } = session;
  await Promise.all([write(TOKEN_KEY, token), write(PROFILE_KEY, JSON.stringify(profile))]);
}

export async function clearSession(): Promise<void> {
  cachedToken = null;
  cachedRefreshToken = null;
  await Promise.all([write(TOKEN_KEY, null), write(PROFILE_KEY, null)]);
}

/** Synchronous read used by the API client on every request. */
export function currentToken(): string | null {
  return cachedToken;
}

/** Synchronous read used by the refresh handler when a request returns 401. */
export function currentRefreshToken(): string | null {
  return cachedRefreshToken;
}
