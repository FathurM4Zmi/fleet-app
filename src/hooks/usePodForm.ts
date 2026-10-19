import { useMemo } from 'react';

import { isPodComplete } from '@/lib/validation';
import { useAppStore } from '@/store/app';

/** Coordinates around the Cikarang warehouse, used as the mock capture location. */
const MOCK_GEO = { lat: -6.2975, lng: 107.1493 };

export function usePodForm(tripId: string | undefined) {
  const { state, dispatch } = useAppStore();

  return useMemo(() => {
    const pod = state.pods.find((entry) => entry.tripId === tripId);

    return {
      pod,
      geo: MOCK_GEO,
      /** A photo or a signature is required before the POD can be saved. */
      canSubmit: pod ? isPodComplete(pod) && pod.recipientName.trim().length > 0 : false,
      save: (draft: {
        photoUris: string[];
        hasSignature: boolean;
        recipientName: string;
        scannedCode?: string;
      }) => {
        if (tripId) {
          dispatch({ type: 'pod/save', pod: { tripId, geo: MOCK_GEO, ...draft } });
        }
      },
      markSynced: () => {
        if (tripId) dispatch({ type: 'pod/markSynced', tripId });
      },
    };
  }, [state.pods, tripId, dispatch]);
}
