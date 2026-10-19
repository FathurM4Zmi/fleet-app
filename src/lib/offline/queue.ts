import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiRequest, ApiError } from '@/lib/api/client';

const STORAGE_KEY = 'fleetops.driver.outbox';
const MAX_ATTEMPTS = 5;

export type OutboxKind = 'dvir' | 'pod' | 'fuel' | 'damage' | 'incident' | 'odometer';

export interface OutboxItem {
  id: string;
  kind: OutboxKind;
  /** Human label shown on the sync banner, e.g. `DVIR Pre-Trip`. */
  label: string;
  path: string;
  method: 'POST';
  body: unknown;
  createdAt: string;
  attempts: number;
  lastError?: string;
}

type Listener = (items: OutboxItem[]) => void;

let items: OutboxItem[] = [];
let loaded = false;
let flushing = false;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener(items);
}

async function persist() {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function loadOutbox(): Promise<OutboxItem[]> {
  if (loaded) return items;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    items = raw ? (JSON.parse(raw) as OutboxItem[]) : [];
  } catch {
    items = [];
  }
  loaded = true;
  emit();
  return items;
}

export function subscribeOutbox(listener: Listener): () => void {
  listeners.add(listener);
  listener(items);
  return () => listeners.delete(listener);
}

export function getOutbox(): OutboxItem[] {
  return items;
}

export async function enqueue(input: Omit<OutboxItem, 'id' | 'createdAt' | 'attempts'>) {
  await loadOutbox();
  const item: OutboxItem = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    attempts: 0,
  };
  items = [item, ...items];
  await persist();
  emit();
  return item;
}

async function remove(id: string) {
  items = items.filter((entry) => entry.id !== id);
  await persist();
  emit();
}

async function markFailed(id: string, message: string) {
  items = items.map((entry) =>
    entry.id === id ? { ...entry, attempts: entry.attempts + 1, lastError: message } : entry,
  );
  await persist();
  emit();
}

/**
 * Flush the queue oldest-first. Items that fail with a 4xx (except 408/429) are
 * dropped — retrying a validation error forever would block the queue.
 * Returns the number of items still pending.
 */
export async function flushOutbox(): Promise<number> {
  if (flushing) return items.length;
  await loadOutbox();
  if (!items.length) return 0;

  flushing = true;
  try {
    const pending = [...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    for (const item of pending) {
      try {
        await apiRequest(item.path, { method: item.method, body: item.body });
        await remove(item.id);
      } catch (error) {
        const apiError = error as ApiError;
        const permanent =
          apiError instanceof ApiError &&
          apiError.status >= 400 &&
          apiError.status < 500 &&
          apiError.status !== 408 &&
          apiError.status !== 429;
        if (permanent || item.attempts + 1 >= MAX_ATTEMPTS) {
          await remove(item.id);
        } else {
          await markFailed(item.id, apiError.message ?? 'Gagal mengirim');
          // Network is still down — stop this pass.
          if (!apiError.status) break;
        }
      }
    }
  } finally {
    flushing = false;
  }
  return items.length;
}

export async function clearOutbox() {
  items = [];
  await persist();
  emit();
}
