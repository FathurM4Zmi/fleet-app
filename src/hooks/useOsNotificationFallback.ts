import { useCallback, useRef } from 'react';

import { notificationApi } from '@/lib/api/endpoints';
import { presentLocalNotification, pushRegistered } from '@/lib/push';
import { useRealtime } from '@/hooks/useRealtime';

/**
 * FRD-MOB-NOTIF-02 / SAF-05 / ALT-05 / INBOX-02 — banner OS untuk notifikasi kritis.
 *
 * Jalur utama adalah Expo Push Service (server → APNs/FCM). Jalur itu butuh
 * development build + `extra.eas.projectId`. Selama perangkat belum terdaftar
 * (Expo Go, web, atau project id belum ada) hook ini menampilkan notifikasi
 * lokal begitu server mengirim sinyal realtime, supaya driver tetap melihat
 * banner OS tanpa menunggu build native.
 *
 * Saat token Expo sudah aktif, hook diam agar tidak ada banner ganda.
 */
export function useOsNotificationFallback() {
  const lastSeenId = useRef<string | null>(null);
  const inFlight = useRef(false);

  const check = useCallback(async () => {
    if (pushRegistered() || inFlight.current) return;
    inFlight.current = true;

    try {
      const page = await notificationApi.list({ pageSize: 5 });
      const newest = page.items?.[0];
      if (!newest) return;

      // Panggilan pertama hanya mencatat posisi terakhir, bukan memicu banner
      // untuk notifikasi lama.
      if (lastSeenId.current === null) {
        lastSeenId.current = newest.id;
        return;
      }
      if (newest.id === lastSeenId.current) return;

      lastSeenId.current = newest.id;
      if (newest.isRead || newest.severity?.toLowerCase() !== 'critical') return;

      await presentLocalNotification(newest.title, newest.message, {
        notificationId: newest.id,
        type: newest.notificationType,
        severity: newest.severity,
        sourceType: newest.sourceType ?? undefined,
        sourceId: newest.sourceId ?? undefined,
      });
    } catch {
      // Jaringan gagal — percobaan berikutnya dipicu event realtime lagi.
    } finally {
      inFlight.current = false;
    }
  }, []);

  useRealtime('notifications', () => void check());
}
