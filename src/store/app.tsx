import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import { currentDriver, notifications, trips, vehicles } from '@/data/fixtures';
import { createId, nowIso } from '@/lib/id';
import type { AuthSession } from '@/data/types';
import { appReducer, type AppAction, type AppState } from './reducers';

const initialState: AppState = {
  session: null,
  driver: currentDriver,
  vehicles,
  trips,
  dvir: [],
  pods: [],
  notifications,
  fuelLogs: [],
  odometerCorrections: [],
  damageReports: [],
  incidentReports: [],
};

interface AppStoreValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const value = useContext(AppStoreContext);
  if (!value) {
    throw new Error('useAppStore must be used inside <AppStoreProvider>');
  }
  return value;
}

/** Session slice plus the two actions auth screens need. */
export function useAuth() {
  const { state, dispatch } = useAppStore();

  return useMemo(
    () => ({
      session: state.session,
      isAuthenticated: state.session !== null,
      login: (driverId: string) => {
        const session: AuthSession = {
          driverId,
          token: createId('tok'),
          issuedAt: nowIso(),
        };
        dispatch({ type: 'auth/login', session });
      },
      logout: () => dispatch({ type: 'auth/logout' }),
    }),
    [state.session, dispatch],
  );
}
