import { useMemo } from 'react';

import type { DvirItem, DvirResult } from '@/data/types';
import { isDvirItemComplete } from '@/lib/validation';
import { useAppStore } from '@/store/app';

export function useDvirForm(tripId: string | undefined, inspectionType: 'pre' | 'post') {
  const { state, dispatch } = useAppStore();

  return useMemo(() => {
    const inspection = state.dvir.find(
      (entry) => entry.tripId === tripId && entry.type === inspectionType,
    );

    const items: DvirItem[] = inspection?.items ?? [];
    const answered = items.filter((item) => item.result !== null);
    const failures = items.filter((item) => item.result === 'fail');
    /** Every item answered and every failure backed by a photo. */
    const canSubmit = items.length > 0 && items.every(isDvirItemComplete);

    return {
      inspection,
      items,
      answeredCount: answered.length,
      failureCount: failures.length,
      totalCount: items.length,
      canSubmit,
      /** Grouped for sectioned rendering: `[{ group, items }]`. */
      groups: items.reduce<{ group: string; items: DvirItem[] }[]>((acc, item) => {
        const last = acc[acc.length - 1];
        if (last && last.group === item.group) {
          last.items.push(item);
        } else {
          acc.push({ group: item.group, items: [item] });
        }
        return acc;
      }, []),
      start: () => {
        if (tripId) dispatch({ type: 'dvir/start', tripId, inspectionType });
      },
      setResult: (itemId: string, result: DvirResult) => {
        if (tripId) {
          dispatch({
            type: 'dvir/setItem',
            tripId,
            inspectionType,
            itemId,
            patch: { result, ...(result === 'fail' ? {} : { photoUri: undefined }) },
          });
        }
      },
      setNote: (itemId: string, note: string) => {
        if (tripId) {
          dispatch({ type: 'dvir/setItem', tripId, inspectionType, itemId, patch: { note } });
        }
      },
      setPhoto: (itemId: string, photoUri: string) => {
        if (tripId) {
          dispatch({ type: 'dvir/setItem', tripId, inspectionType, itemId, patch: { photoUri } });
        }
      },
      setOdometer: (odometerKm: number) => {
        if (tripId) {
          dispatch({ type: 'dvir/setOdometer', tripId, inspectionType, odometerKm });
        }
      },
      submit: () => {
        if (tripId) dispatch({ type: 'dvir/submit', tripId, inspectionType });
      },
    };
  }, [state.dvir, tripId, inspectionType, dispatch]);
}
