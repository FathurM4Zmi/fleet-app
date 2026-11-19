import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'fleetops.driver.cache.';

/**
 * Snapshot terakhir dari data yang juga tampil saat offline (FRD-MOB-INBOX-04).
 * Cache sengaja dibiarkan tanpa TTL: yang penting layar tidak kosong saat sinyal
 * putus, dan data baru akan menimpa begitu permintaan berhasil.
 */
export async function readCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(`${PREFIX}${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function writeCache(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Cache adalah optimisasi; kegagalan menulis tidak boleh mengganggu alur.
  }
}
