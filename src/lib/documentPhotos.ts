import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Latest photo the driver uploaded for a document.
 *
 * The document record itself is owned by the dispatcher, so the driver's own
 * upload is kept on the device and layered over the sample/API image instead of
 * mutating the admin record.
 */
const PREFIX = 'fleetops:document-photo:';

export async function loadDocumentPhoto(key: string): Promise<string | undefined> {
  try {
    return (await AsyncStorage.getItem(`${PREFIX}${key}`)) ?? undefined;
  } catch {
    return undefined;
  }
}

export async function saveDocumentPhoto(key: string, path: string): Promise<void> {
  await AsyncStorage.setItem(`${PREFIX}${key}`, path);
}
