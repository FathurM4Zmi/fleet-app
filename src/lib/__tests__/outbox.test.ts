import { ApiError } from '@/lib/api/client';
import {
  clearOutbox,
  enqueue,
  flushOutbox,
  getOutbox,
  loadOutbox,
} from '@/lib/offline/queue';

const mockApiRequest = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@/lib/api/client', () => {
  class MockApiError extends Error {
    readonly status: number;

    constructor(status: number, message = 'request failed') {
      super(message);
      this.name = 'ApiError';
      this.status = status;
    }
  }

  return {
    apiRequest: (...args: unknown[]) => mockApiRequest(...args),
    ApiError: MockApiError,
  };
});

const apiError = (status: number, message?: string) =>
  new (ApiError as unknown as new (status: number, message?: string) => Error)(status, message);

const dvir = (label: string) => ({
  kind: 'dvir' as const,
  label,
  path: '/api/driver/dvir',
  method: 'POST' as const,
  body: { label },
});

describe('offline outbox', () => {
  beforeEach(async () => {
    jest.useFakeTimers({ now: new Date('2026-01-01T08:00:00.000Z') });
    mockApiRequest.mockReset();
    await clearOutbox();
    await loadOutbox();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('queues an item and persists it for later sync', async () => {
    await enqueue(dvir('DVIR Pre-Trip'));

    expect(getOutbox()).toHaveLength(1);
    expect(getOutbox()[0].attempts).toBe(0);
    expect(getOutbox()[0].label).toBe('DVIR Pre-Trip');
  });

  it('sends queued items oldest-first and clears them on success', async () => {
    mockApiRequest.mockResolvedValue(undefined);

    await enqueue(dvir('first'));
    jest.setSystemTime(new Date('2026-01-01T08:05:00.000Z'));
    await enqueue(dvir('second'));

    const pending = await flushOutbox();

    expect(pending).toBe(0);
    expect(mockApiRequest).toHaveBeenCalledTimes(2);
    expect(mockApiRequest.mock.calls.map((call) => (call[1] as any).body.label)).toEqual([
      'first',
      'second',
    ]);
    expect(getOutbox()).toHaveLength(0);
  });

  it('keeps the item and counts the attempt when the network is down', async () => {
    mockApiRequest.mockRejectedValue(apiError(0, 'Network request failed'));

    await enqueue(dvir('offline'));

    const pending = await flushOutbox();

    expect(pending).toBe(1);
    expect(getOutbox()[0].attempts).toBe(1);
    expect(getOutbox()[0].lastError).toBe('Network request failed');
  });

  it('drops an item the server rejects with a validation error', async () => {
    mockApiRequest.mockRejectedValue(apiError(422, 'invalid payload'));

    await enqueue(dvir('bad'));

    const pending = await flushOutbox();

    expect(pending).toBe(0);
    expect(getOutbox()).toHaveLength(0);
  });

  it('keeps evidence when the session expired and stops the pass', async () => {
    mockApiRequest.mockRejectedValue(apiError(401, 'Sesi berakhir'));

    await enqueue(dvir('needs-login'));
    jest.setSystemTime(new Date('2026-01-01T08:10:00.000Z'));
    await enqueue(dvir('queued-after'));

    const pending = await flushOutbox();

    expect(pending).toBe(2);
    expect(mockApiRequest).toHaveBeenCalledTimes(1);
    expect(getOutbox().some((item) => item.lastError === 'Sesi berakhir')).toBe(true);
  });

  it('drops an item after the maximum number of retries', async () => {
    mockApiRequest.mockRejectedValue(apiError(503, 'server down'));

    await enqueue(dvir('flaky'));

    for (let pass = 0; pass < 5; pass += 1) {
      await flushOutbox();
    }

    expect(getOutbox()).toHaveLength(0);
  });
});
