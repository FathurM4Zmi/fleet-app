import { Alert, Platform } from 'react-native';

/**
 * One-shot information dialog. `react-native-web` ships a no-op `Alert`, so a
 * confirmation on web would silently do nothing — use the browser dialog there
 * instead. Confirmations with buttons live next to their screens for now.
 */
export function notify(title: string, message?: string): void {
  if (Platform.OS === 'web') {
    globalThis.alert?.(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}
