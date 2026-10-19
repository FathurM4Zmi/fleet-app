import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { setTokenProvider } from '@/lib/api/client';
import { authApi } from '@/lib/api/endpoints';
import type { LoginResponse } from '@/lib/api/types';
import { clearSession, currentToken, loadSession, saveSession, type StoredSession } from '@/lib/auth/session';
import { clearOutbox } from '@/lib/offline/queue';

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

  const persist = useCallback(async (response: LoginResponse) => {
    if (!response.token) {
      throw new Error('Server tidak mengembalikan token sesi.');
    }
    const next: StoredSession = {
      token: response.token,
      driverId: response.user?.id ?? '',
      name: response.user?.fullName ?? 'Driver',
      expiresAt: response.expiresAt,
    };
    await saveSession(next);
    setSession(next);
    setStatus('authenticated');
  }, []);

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
    await Promise.all([clearSession(), clearOutbox()]);
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
