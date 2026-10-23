import { API_BASE_URL, API_TIMEOUT_MS } from './config';

export class ApiError extends Error {
  readonly status: number;
  readonly detail?: string;
  readonly validation?: Record<string, string[]>;

  constructor(status: number, message: string, detail?: string, validation?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
    this.validation = validation;
  }

  /** 401/403 need a re-login or a different account, not a retry. */
  get isAuthError() {
    return this.status === 401 || this.status === 403;
  }

  /** Network-level failure (offline, DNS, timeout) — safe to queue and retry. */
  get isNetworkError() {
    return this.status === 0;
  }

  get isConflict() {
    return this.status === 409;
  }
}

export type TokenProvider = () => Promise<string | null>;
export type UnauthorizedHandler = () => void;

let tokenProvider: TokenProvider = async () => null;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setTokenProvider(provider: TokenProvider) {
  tokenProvider = provider;
}

/**
 * Registered by `AuthProvider`: a 401 means the stored session is no longer
 * valid, so the app clears it and returns to the login stack.
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
  /** Skip the bearer header (login endpoints). */
  anonymous?: boolean;
  /** Overrides `API_TIMEOUT_MS` for calls that must fail fast (auth). */
  timeoutMs?: number;
}

function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  if (!query) return url;
  const params = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  return params.length ? `${url}?${params.join('&')}` : url;
}

async function parseError(response: Response): Promise<ApiError> {
  const text = await response.text().catch(() => '');
  if (!text) {
    return new ApiError(response.status, `Permintaan gagal (${response.status}).`);
  }
  try {
    const payload = JSON.parse(text) as {
      title?: string;
      detail?: string;
      message?: string;
      errors?: Record<string, string[]>;
    };
    const message = payload.detail ?? payload.message ?? payload.title ?? `Permintaan gagal (${response.status}).`;
    return new ApiError(response.status, message, payload.detail, payload.errors);
  } catch {
    return new ApiError(response.status, text.slice(0, 200));
  }
}

function notifyUnauthorized(status: number) {
  if (status === 401) unauthorizedHandler?.();
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? API_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();
  options.signal?.addEventListener('abort', abortFromCaller);

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (!options.anonymous) {
    const token = await tokenProvider();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await parseError(response);
      notifyUnauthorized(error.status);
      throw error;
    }
    if (response.status === 204) return undefined as T;

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if ((error as Error)?.name === 'AbortError') {
      throw new ApiError(0, 'Permintaan melebihi batas waktu. Periksa koneksi.');
    }
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Periksa koneksi.');
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abortFromCaller);
  }
}

/**
 * Multipart upload for DVIR / POD / fuel receipt photos.
 * The backend returns the relative path that is stored in `photoPaths`.
 *
 * Uses the same timeout and error mapping as `apiRequest` so a stalled upload
 * cannot hang the form forever.
 */
export async function apiUpload(
  path: string,
  file: { uri: string; name: string; type: string },
  field = 'file',
): Promise<{ path: string; url: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const form = new FormData();
    // React Native accepts the `{ uri, name, type }` shape directly.
    form.append(field, file as unknown as Blob);

    const token = await tokenProvider();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await parseError(response);
      notifyUnauthorized(error.status);
      throw error;
    }
    return (await response.json()) as { path: string; url: string };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if ((error as Error)?.name === 'AbortError') {
      throw new ApiError(0, 'Unggahan melebihi batas waktu. Periksa koneksi.');
    }
    throw new ApiError(0, 'Tidak dapat mengunggah foto. Periksa koneksi.');
  } finally {
    clearTimeout(timeout);
  }
}
