import * as ImagePicker from 'expo-image-picker';

/**
 * Opens the camera (falling back to the library when camera permission is
 * denied or unavailable, e.g. inside a simulator) and returns the local URI of
 * the captured photo, or `undefined` when the driver cancels.
 */
export async function capturePhoto(): Promise<string | undefined> {
  return captureMedia('images');
}

/** Same flow as `capturePhoto`, but records video instead of stills. */
export async function captureVideo(): Promise<string | undefined> {
  return captureMedia('videos');
}

async function captureMedia(
  mediaTypes: 'images' | 'videos',
): Promise<string | undefined> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  const result = permission.granted
    ? await ImagePicker.launchCameraAsync({ mediaTypes: [mediaTypes], quality: 0.6 })
    : await ImagePicker.launchImageLibraryAsync({ mediaTypes: [mediaTypes], quality: 0.6 });

  if (result.canceled) return undefined;
  return result.assets[0]?.uri;
}
