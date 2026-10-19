import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '@/lib/api/client';

export interface ApiQueryResult<T> {
  data: T | undefined;
  error: ApiError | undefined;
  /** True only on the very first load (no data yet). */
  loading: boolean;
  /** True while a background refresh runs. */
  refreshing: boolean;
  refetch: () => Promise<void>;
  setData: (updater: T | ((previous: T | undefined) => T | undefined)) => void;
}

/**
 * Minimal fetch-on-mount hook. Deliberately not a cache: every screen owns its
 * own data and `refetch` is called after a mutation or a pull-to-refresh.
 */
export function useApiQuery<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[] = [],
  options: { enabled?: boolean } = {},
): ApiQueryResult<T> {
  const enabled = options.enabled ?? true;
  const [data, setDataState] = useState<T | undefined>(undefined);
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [loading, setLoading] = useState(enabled);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (!enabled) return;
      if (mode === 'initial') setLoading(true);
      else setRefreshing(true);
      try {
        const result = await fetcherRef.current();
        if (!mounted.current) return;
        setDataState(result);
        setError(undefined);
      } catch (caught) {
        if (!mounted.current) return;
        setError(caught instanceof ApiError ? caught : new ApiError(0, 'Terjadi kesalahan.'));
      } finally {
        if (!mounted.current) return;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [enabled],
  );

  useEffect(() => {
    if (!enabled) return;
    // Fetch-on-mount: `run` flips `loading` before the request resolves by design.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void run('initial');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const setData = useCallback((updater: T | ((previous: T | undefined) => T | undefined)) => {
    setDataState((previous) =>
      typeof updater === 'function' ? (updater as (p: T | undefined) => T | undefined)(previous) : updater,
    );
  }, []);

  const refetch = useCallback(() => run('refresh'), [run]);

  return {
    data,
    error,
    loading: enabled && loading,
    refreshing,
    refetch,
    setData,
  };
}
