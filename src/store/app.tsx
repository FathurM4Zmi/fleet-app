import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';

import type { Driver } from '@/data/types';
import { appReducer, type AppAction, type AppState } from './reducers';

/**
 * Local draft store. Server data is fetched per screen through
 * `src/hooks/api/useDriverData.ts`; this store only holds in-progress forms
 * (DVIR checklist, POD, fuel, damage, incident) that must survive navigation.
 */
export const emptyDriver: Driver = {
  id: '',
  name: 'Driver',
  initials: 'DR',
  phone: '—',
  employeeId: '—',
  site: '—',
  licenseNo: '—',
  licenseExpiry: '',
  status: 'active',
  dnaScore: 0,
};

const initialState: AppState = {
  session: null,
  driver: emptyDriver,
  vehicles: [],
  trips: [],
  dvir: [],
  pods: [],
  notifications: [],
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
