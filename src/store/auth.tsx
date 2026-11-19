import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { setRefreshHandler, setTokenProvider, setUnauthorizedHandler } from '@/lib/api/client';
import { authApi } from '@/lib/api/endpoints';
import type { LoginResponse } from '@/lib/api/types';
import { clearSession, currentRefreshToken, currentToken, loadSession, saveSession, type StoredSession } from '@/lib/auth/session';
import { registerForPush, unregisterPush } from '@/lib/push';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  status: AuthStatus;
  session: StoredSession | null;
  isAuthenticated: boolean;
  loginWithPin: (identifier: string, pin: string) => Promise<void>;
  loginWithOtp: (identifier: string, code: string) => Promise<void>;
  loginWithQr: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// The API client reads the token synchronously on every request.
setTokenProvider(async () => currentToken());

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      const stored = await loadSession();
      if (!active) return;
      setSession(stored);
      setStatus(stored ? 'authenticated' : 'anonymous');
    })();
    return () => {
      active = false;
    };
  }, []);

  // FRD-MOB-NOTIF-02 — daftarkan token push begitu sesi aktif; lepas saat logout.
  useEffect(() => {
    if (status === 'authenticated') void registerForPush();
  }, [status]);

  // A 401 from any request means the token is no longer valid. Drop it and let
  // the protected stack send the driver back to login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      void clearSession();
      setSession(null);
      setStatus('anonymous');
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const persist = useCallback(async (response: LoginResponse) => {
    if (!response.token) {
      throw new Error('Server tidak mengembalikan token sesi.');
    }
    const next: StoredSession = {
      token: response.token,
      driverId: response.user?.id ?? '',
      name: response.user?.fullName ?? 'Driver',
      expiresAt: response.expiresAt,
      refreshToken: response.refreshToken ?? null,
    };
    await saveSession(next);
    setSession(next);
    setStatus('authenticated');
  }, []);

  // FRD-MOB-LOGIN-02 — access token kedaluwarsa diperpanjang otomatis memakai refresh
  // token; driver hanya kembali ke login bila refresh ikut ditolak server.
  useEffect(() => {
    setRefreshHandler(async () => {
      const stored = currentRefreshToken();
      if (!stored) return false;
      try {
        const response = await authApi.refresh(stored);
        if (!response.token) return false;
        await persist(response);
        return true;
      } catch {
        return false;
      }
    });
    return () => setRefreshHandler(null);
  }, [persist]);

  const loginWithPin = useCallback(
    async (identifier: string, pin: string) => {
      const response = await authApi.loginPin(identifier.trim(), pin);
      await persist(response);
    },
    [persist],
  );

  const loginWithOtp = useCallback(
    async (identifier: string, code: string) => {
      const response = await authApi.verifyOtp(identifier.trim(), code.trim());
      await persist(response);
    },
    [persist],
  );

  const loginWithQr = useCallback(
    async (token: string) => {
      const response = await authApi.loginQr(token.trim());
      await persist(response);
    },
    [persist],
  );

  const logout = useCallback(async () => {
    // Pending offline items are intentionally kept: dropping them on logout
    // would silently lose submitted evidence. They flush on the next login.
    await unregisterPush();
    await clearSession();
    setSession(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      isAuthenticated: status === 'authenticated',
      loginWithPin,
      loginWithOtp,
      loginWithQr,
      logout,
    }),
    [status, session, loginWithPin, loginWithOtp, loginWithQr, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
