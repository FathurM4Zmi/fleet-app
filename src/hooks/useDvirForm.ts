import { useCallback, useMemo } from 'react';

import { serializeChecklist, type ChecklistEntry } from '@/data/adapters';
import type { DvirItem, DvirResult } from '@/data/types';
import { dvirApi } from '@/lib/api/endpoints';
import { ApiError } from '@/lib/api/client';
import { enqueue } from '@/lib/offline/queue';
import { uploadImage } from '@/lib/upload';
import { isDvirItemComplete } from '@/lib/validation';
import { useAppStore } from '@/store/app';

export function useDvirForm(tripId: string | undefined, inspectionType: 'pre' | 'post') {
  const { state, dispatch } = useAppStore();

  const inspection = state.dvir.find(
    (entry) => entry.tripId === tripId && entry.type === inspectionType,
  );

  const items: DvirItem[] = useMemo(() => inspection?.items ?? [], [inspection]);
  const answered = items.filter((item) => item.result !== null);
  const failures = items.filter((item) => item.result === 'fail');
  const canSubmit = items.length > 0 && items.every(isDvirItemComplete);

  const submit = useCallback(
    async (vehicleId: string) => {
      if (!tripId || !inspection) return;

      const checklist: ChecklistEntry[] = [];
      for (const item of items) {
        let photoPath: string | undefined;
        if (item.photoUri) {
          try {
            photoPath = await uploadImage(item.photoUri, 'dvir');
          } catch {
            // Keep the local URI so the queued request still carries the evidence
            // once connectivity returns; the upload is retried with the payload.
            photoPath = item.photoUri;
          }
        }
        checklist.push({
          id: item.id,
          label: item.label,
          group: item.group,
          result: item.result,
          note: item.note,
          photoPath,
        });
      }

      const failed = checklist.filter((entry) => entry.result === 'fail');
      const payload = {
        vehicleId,
        inspectionType: inspectionType === 'pre' ? ('PreTrip' as const) : ('PostTrip' as const),
        odometerKm: inspection.odometerKm,
        passed: failed.length === 0,
        defectNotes: failed.length
          ? failed.map((entry) => `${entry.label}${entry.note ? `: ${entry.note}` : ''}`).join('; ')
          : null,
        photoPaths: checklist.map((entry) => entry.photoPath).filter(Boolean) as string[],
        checklistJson: serializeChecklist(checklist),
      };

      try {
        await dvirApi.submit(payload);
      } catch (error) {
        if (error instanceof ApiError && error.isNetworkError) {
          await enqueue({
            kind: 'dvir',
            label: `DVIR ${inspectionType === 'pre' ? 'Pre-Trip' : 'Post-Trip'}`,
            path: '/api/driver/dvir',
            method: 'POST',
            body: payload,
          });
        } else {
          throw error;
        }
      }

      dispatch({ type: 'dvir/submit', tripId, inspectionType });
    },
    [tripId, inspection, items, inspectionType, dispatch],
  );

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
    submit,
  };
}
