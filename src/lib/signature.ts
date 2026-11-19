import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

/**
 * Converts the base64 PNG produced by `SignaturePad.toDataURL` into a URI that
 * `uploadImage` can send as multipart. On web the data URL is uploaded directly;
 * on native it is written to the cache directory first.
 */
export async function signatureBase64ToUri(base64: string): Promise<string> {
  if (Platform.OS === 'web') {
    return `data:image/png;base64,${base64}`;
  }
  const directory = FileSystem.cacheDirectory;
  if (!directory) {
    throw new Error('Penyimpanan sementara perangkat tidak tersedia.');
  }
  const uri = `${directory}ttd-${Date.now()}.png`;
  await FileSystem.writeAsStringAsync(uri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return uri;
}
