import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { notificationApi } from '@/lib/api/endpoints';

/**
 * FRD-MOB-NOTIF-02 / SAF-05 / ALT-05 — push OS untuk notifikasi Critical.
 *
 * Token Expo push hanya bisa didapat pada development build yang punya
 * `extra.eas.projectId`. Di Expo Go, web, atau saat izin ditolak fungsi ini tidak
 * melakukan apa pun: aplikasi tetap berjalan dan notifikasi tetap masuk lewat
 * SignalR + inbox.
 *
 * Modul `expo-notifications` sengaja di-import dinamis: memuatnya di web memicu
 * peringatan "push token changes is not yet supported on web" yang tidak berguna.
 */

type NotificationsModule = typeof import('expo-notifications');

let modulePromise: Promise<NotificationsModule | null> | null = null;
let registeredToken: string | null = null;

function loadNotifications(): Promise<NotificationsModule | null> {
  if (Platform.OS === 'web') return Promise.resolve(null);
  modulePromise ??= import('expo-notifications').catch(() => null);
  return modulePromise;
}

/** Notifikasi yang masuk saat app di foreground tetap ditampilkan. */
export async function configureForegroundNotifications(): Promise<void> {
  const Notifications = await loadNotifications();
  if (!Notifications) return;

  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch {
    // Modul native tidak tersedia — abaikan.
  }
}

export async function registerForPush(): Promise<void> {
  const Notifications = await loadNotifications();
  if (!Notifications) return;

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Peringatan kritis',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#DC2626',
      });
    }

    const current = await Notifications.getPermissionsAsync();
    let status = current.status;
    if (status !== 'granted') {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== 'granted') return;

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) return; // Belum `eas init` — push belum bisa didaftarkan.

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    if (!token || token === registeredToken) return;

    await notificationApi.registerDevice(token, Platform.OS);
    registeredToken = token;
  } catch {
    // Expo Go / tanpa project id / jaringan gagal — push non-aktif, bukan error fatal.
  }
}

export async function unregisterPush(): Promise<void> {
  if (!registeredToken) return;
  const token = registeredToken;
  registeredToken = null;
  try {
    await notificationApi.unregisterDevice(token);
  } catch {
    // Best effort: server juga menonaktifkan token yang ditolak Expo.
  }
}

/** True bila perangkat ini sudah terdaftar di Expo Push Service. */
export function pushRegistered(): boolean {
  return registeredToken !== null;
}

/**
 * Tampilkan banner OS secara lokal. Dipakai sebagai cadangan saat token Expo
 * belum tersedia (Expo Go / belum `eas init`) tetapi server sudah mengirim
 * notifikasi lewat SignalR.
 */
export async function presentLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  const Notifications = await loadNotifications();
  if (!Notifications) return;

  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.status !== 'granted') return;

    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: null,
    });
  } catch {
    // Modul native tidak tersedia — abaikan.
  }
}

/** Rute yang dituju saat notifikasi push diketuk (FRD-MOB-NOTIF-03). */export function routeForNotificationData(data: unknown): string {
  const payload = (data ?? {}) as { sourceType?: string; sourceId?: string };
  if (payload.sourceType?.toLowerCase() === 'trip' && payload.sourceId) {
    return `/trip/${payload.sourceId}`;
  }
  return '/notifications';
}

/**
 * Daftarkan listener ketuk-notifikasi. Mengembalikan fungsi pembersih; di web
 * tidak ada listener yang dipasang.
 */
export function subscribeToNotificationTaps(
  onTap: (target: string) => void,
): () => void {
  if (Platform.OS === 'web') return () => undefined;

  let subscription: { remove(): void } | undefined;
  let cancelled = false;

  void (async () => {
    const Notifications = await loadNotifications();
    if (!Notifications || cancelled) return;
    try {
      subscription = Notifications.addNotificationResponseReceivedListener((response) => {
        onTap(routeForNotificationData(response.notification.request.content.data));
      });
    } catch {
      // Listener tidak tersedia (mis. modul native belum terpasang).
    }
  })();

  return () => {
    cancelled = true;
    subscription?.remove();
  };
}
