import { useMemo } from 'react';

import { notificationDetailById } from '@/data/fixtures';
import { useAppStore } from '@/store/app';

export function useNotifications() {
  const { state, dispatch } = useAppStore();

  return useMemo(
    () => ({
      notifications: state.notifications,
      unreadCount: state.notifications.filter((entry) => !entry.readAt).length,
      markRead: (id: string) => dispatch({ type: 'notification/markRead', id }),
      markAllRead: () => dispatch({ type: 'notification/markAllRead' }),
      /** Extra context for the notification detail screen. */
      detailFor: (id: string) => notificationDetailById(id),
    }),
    [state.notifications, dispatch],
  );
}
