import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { ApiError } from '@/lib/api/client';
import { API_BASE_URL } from '@/lib/api/config';
import { currentToken } from '@/lib/auth/session';

/** Absolute URL of the backend-rendered settlement PDF. */
export function settlementSlipPdfUrl(period: string): string {
  return `${API_BASE_URL}/api/driver/settlements/${encodeURIComponent(period)}/pdf`;
}

function authHeaders(): Record<string, string> | undefined {
  const token = currentToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

/**
 * Downloads the settlement slip PDF and hands it to the OS.
 *
 * The endpoint sits behind a bearer token, so a plain link cannot be opened —
 * the file has to be fetched with the session header first. On web that becomes
 * a blob download; on device the file is cached and passed to the share sheet
 * (which is also where "Save to Files"/"Open in Drive" lives).
 */
export async function downloadSettlementPdf(period: string, fileName: string): Promise<void> {
  const url = settlementSlipPdfUrl(period);
  const headers = authHeaders();

  if (Platform.OS === 'web') {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new ApiError(response.status, 'Slip PDF tidak tersedia untuk periode ini.');
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
    return;
  }

  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) {
    throw new ApiError(0, 'Penyimpanan sementara tidak tersedia di perangkat ini.');
  }

  const result = await FileSystem.downloadAsync(url, `${cacheDir}${fileName}`, { headers });
  if (result.status !== 200) {
    throw new ApiError(result.status, 'Slip PDF tidak tersedia untuk periode ini.');
  }

  if (!(await Sharing.isAvailableAsync())) {
    throw new ApiError(0, `PDF tersimpan di ${result.uri}, tetapi menu bagikan tidak tersedia.`);
  }

  await Sharing.shareAsync(result.uri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: 'Slip Settlement',
  });
}
