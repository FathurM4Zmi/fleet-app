import { useCallback, useEffect, useRef } from 'react';

import { documentApi, dvirApi, fuelApi, insightApi, profileApi, safetyApi, settlementApi, taskApi, tripApi, tripOpsApi, vehicleApi } from '@/lib/api/endpoints';
import { useApiQuery } from './useApiQuery';

/** Home + profil. */
export const useHome = () => useApiQuery(profileApi.home);
export const useMe = () => useApiQuery(profileApi.me);

/** Trip list + detail. */
export const useTripList = (params: { status?: string; take?: number } = {}) =>
  useApiQuery(() => tripApi.list(params), [params.status, params.take]);

export const useTripDetail = (tripId: string | undefined) =>
  useApiQuery(() => tripApi.detail(tripId as string), [tripId], { enabled: Boolean(tripId) });

/** DVIR. */
export const useDvirQueue = () => useApiQuery(dvirApi.queue);
export const useDvirHistory = (params: { vehicleId?: string; take?: number } = {}) =>
  useApiQuery(() => dvirApi.history(params), [params.vehicleId, params.take]);

/** Delivery tasks / POD. */
export const useTasks = (params: { status?: string; take?: number } = {}) =>
  useApiQuery(() => taskApi.list(params), [params.status, params.take]);

/** Trip operations. */
export const useTripTracking = (tripId: string | undefined) =>
  useApiQuery(() => tripOpsApi.tracking(tripId as string), [tripId], { enabled: Boolean(tripId) });
export const useTripRoutes = (tripId: string | undefined) =>
  useApiQuery(() => tripOpsApi.routes(tripId as string), [tripId], { enabled: Boolean(tripId) });
export const useTripWarnings = (tripId: string | undefined) =>
  useApiQuery(() => tripOpsApi.warnings(tripId as string), [tripId], { enabled: Boolean(tripId) });
export const useTripAssets = (tripId: string | undefined) =>
  useApiQuery(() => tripOpsApi.assets(tripId as string), [tripId], { enabled: Boolean(tripId) });

/** BBM. */
export const useFuelLogs = (take = 50) => useApiQuery(() => fuelApi.logs(take), [take]);
export const useFuelCard = () => useApiQuery(fuelApi.card);
export const useFuelTransactions = (take = 50) =>
  useApiQuery(() => fuelApi.cardTransactions(take), [take]);

/** Coaching / kinerja / aktivitas / DNA. */
export const useCoaching = () => useApiQuery(insightApi.coaching);
export const usePerformance = () => useApiQuery(insightApi.performance);
export const useActivity = (days = 30, take = 50) =>
  useApiQuery(() => insightApi.activity(days, take), [days, take]);
export const useDna = () => useApiQuery(insightApi.dna);

/** Kerusakan / safety / kepatuhan. */
export const useDamageReports = (take = 50) => useApiQuery(() => safetyApi.damage(take), [take]);
export const useSafetyEvents = (days = 30, take = 50) =>
  useApiQuery(() => safetyApi.events(days, take), [days, take]);
export const useCompliance = () => useApiQuery(safetyApi.compliance);

/** Kendaraan & dokumen. */
export const useVehicle = () => useApiQuery(vehicleApi.current);
export const useVehicleDocuments = (vehicleId?: string) =>
  useApiQuery(() => vehicleApi.documents(vehicleId), [vehicleId]);
export const useOdometerCorrections = () => useApiQuery(vehicleApi.odometerCorrections);
export const useDocuments = () => useApiQuery(documentApi.list);
export const useDocument = (id: string | undefined) =>
  useApiQuery(() => documentApi.detail(id as string), [id], { enabled: Boolean(id) });

/** Settlement. */
export const useSettlement = (months = 3) =>
  useApiQuery(() => settlementApi.summary(months), [months]);

/** Convenience: run a mutation then refresh one or more queries. */
export function useRefresh(...refetchers: (() => Promise<void>)[]) {
  const latest = useRef(refetchers);

  useEffect(() => {
    latest.current = refetchers;
  });

  return useCallback(async () => {
    await Promise.all(latest.current.map((refetch) => refetch()));
  }, []);
}
