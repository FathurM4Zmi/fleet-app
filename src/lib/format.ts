const DATE_TIME = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const DATE_ONLY = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const TIME_ONLY = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
});

const DAY_DATE = new Intl.DateTimeFormat('id-ID', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
});

/** `Sen, 13 Okt`. */
export const formatDayDate = (iso: string): string => DAY_DATE.format(new Date(iso));

export const formatDateTime = (iso: string): string => DATE_TIME.format(new Date(iso));

export const formatDate = (iso: string): string => DATE_ONLY.format(new Date(iso));

export const formatTime = (iso: string): string => TIME_ONLY.format(new Date(iso));

/** `1234` -> `1.234` (Indonesian thousands separator). */
export const formatNumber = (value: number): string => new Intl.NumberFormat('id-ID').format(value);

export const formatKm = (value: number): string => `${formatNumber(value)} km`;

export const formatKg = (value: number): string => `${formatNumber(value)} kg`;

/** `m:ss`, used by the OTP resend countdown. */
export const formatCountdown = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

/** Colour band for a 0–100 health score. */
export const scoreTone = (score: number): 'success' | 'warning' | 'critical' => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'critical';
};

/** Assumes a 45 km/h average, rounded to the nearest half hour. */
export const estimatedDurationHours = (distanceKm: number): number =>
  Math.max(1, Math.round((distanceKm / 45) * 2) / 2);

export const addHours = (iso: string, hours: number): string =>
  new Date(new Date(iso).getTime() + hours * 3_600_000).toISOString();

/** `5 menit lalu`, `2 jam lalu`, `Kemarin`, `12 Okt 2026`. */
export const formatRelative = (iso: string): string => {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.round(hours / 24);
  if (days === 1) return 'Kemarin';
  if (days < 7) return `${days} hari lalu`;
  return formatDate(iso);
};

/** `Hari ini, 07:45` when the timestamp is today, otherwise `13 Okt, 07:45`. */
export const formatRecency = (iso: string): string => {
  const date = new Date(iso);
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return `${isToday ? 'Hari ini' : formatDate(iso)}, ${formatTime(iso)}`;
};

/** `08:30 - 11:15` for a trip's scheduled slot. */
export const formatWindow = (scheduledAt: string, distanceKm: number): string =>
  `${formatTime(scheduledAt)} - ${formatTime(addHours(scheduledAt, estimatedDurationHours(distanceKm)))}`;

