import { useCallback, useMemo } from 'react';

import { toPod } from '@/data/adapters';
import type { Pod } from '@/data/types';
import { ApiError } from '@/lib/api/client';
import { taskApi } from '@/lib/api/endpoints';
import { currentPosition } from '@/lib/geo';
import { enqueue } from '@/lib/offline/queue';
import { uploadImage } from '@/lib/upload';
import { isPodComplete } from '@/lib/validation';
import { useApiQuery } from '@/hooks/api/useApiQuery';
import { useAppStore } from '@/store/app';

/** Fallback when location permission is denied — still records a POD, flagged as approximate. */
const FALLBACK_GEO = { lat: -6.2975, lng: 107.1493 };

export function usePodForm(tripId: string | undefined) {
  const { state, dispatch } = useAppStore();
  const taskQuery = useApiQuery(
    () => taskApi.list({ tripId, take: 5 }),
    [tripId],
    { enabled: Boolean(tripId) },
  );

  const task = taskQuery.data?.[0];
  const localPod = state.pods.find((entry) => entry.tripId === tripId);
  const pod: Pod | undefined = localPod ?? (task ? toPod(task) : undefined);

  const save = useCallback(
    async (draft: {
      photoUris: string[];
      hasSignature: boolean;
      recipientName: string;
      scannedCode?: string;
    }) => {
      if (!tripId || !task) {
        throw new Error('Task pengiriman untuk trip ini belum tersedia.');
      }

      const geo = (await currentPosition()) ?? FALLBACK_GEO;
      const capturedAt = new Date().toISOString();

      const photoPaths: string[] = [];
      for (const uri of draft.photoUris) {
        try {
          photoPaths.push(await uploadImage(uri, 'pod'));
        } catch {
          photoPaths.push(uri);
        }
      }

      const notes = [draft.recipientName, draft.scannedCode].filter(Boolean).join(' • ');
      const payload = {
        photoPath: photoPaths[0] ?? null,
        signaturePath: null,
        notes: photoPaths.length > 0 ? notes || null : notes || 'Ditandatangani penerima',
        latitude: geo.lat,
        longitude: geo.lng,
        capturedAt,
      };

      try {
        if (task.status === 'Assigned') await taskApi.start(task.id);
        await taskApi.deliver(task.id, payload);
        await taskQuery.refetch();
      } catch (error) {
        if (error instanceof ApiError && error.isNetworkError) {
          await enqueue({
            kind: 'pod',
            label: `POD ${draft.recipientName}`,
            path: `/api/driver/tasks/${task.id}/pod`,
            method: 'POST',
            body: payload,
          });
        } else {
          throw error;
        }
      }

      dispatch({
        type: 'pod/save',
        pod: {
          tripId,
          photoUris: photoPaths,
          hasSignature: draft.hasSignature,
          recipientName: draft.recipientName,
          scannedCode: draft.scannedCode,
          geo,
        },
      });
    },
    [tripId, task, taskQuery, dispatch],
  );

  return useMemo(
    () => ({
      pod,
      task,
      geo: pod?.geo ?? FALLBACK_GEO,
      /** A photo or a signature is required before the POD can be saved. */
      canSubmit: Boolean(task) && (pod ? isPodComplete(pod) && pod.recipientName.trim().length > 0 : true),
      save,
      markSynced: () => {
        if (tripId) dispatch({ type: 'pod/markSynced', tripId });
      },
      loading: taskQuery.loading,
      error: taskQuery.error,
    }),
    [pod, task, save, tripId, dispatch, taskQuery.loading, taskQuery.error],
  );
}
