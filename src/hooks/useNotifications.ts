import { useCallback, useMemo } from 'react';

import { toNotification } from '@/data/adapters';
import { notificationApi } from '@/lib/api/endpoints';
import { useApiQuery } from '@/hooks/api/useApiQuery';

export function useNotifications() {
  const query = useApiQuery(() => notificationApi.list({ pageSize: 100 }), []);
  const { refetch } = query;

  const notifications = useMemo(
    () => (query.data?.items ?? []).map(toNotification),
    [query.data],
  );

  const markRead = useCallback(
    async (id: string) => {
      await notificationApi.read(id);
      await refetch();
    },
    [refetch],
  );

  const markAllRead = useCallback(async () => {
    const unread = notifications.filter((entry) => !entry.readAt);
    await Promise.all(unread.map((entry) => notificationApi.read(entry.id)));
    await refetch();
  }, [notifications, refetch]);

  return {
    notifications,
    unreadCount: notifications.filter((entry) => !entry.readAt).length,
    loading: query.loading,
    refreshing: query.refreshing,
    error: query.error,
    refetch,
    markRead,
    markAllRead,
    /** Extra context is not exposed by the API yet; the screen falls back to the body. */
    detailFor: (_id: string) => undefined,
  };
}
