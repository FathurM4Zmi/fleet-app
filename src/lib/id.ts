let counter = 0;

/** Short, collision-resistant id for in-memory mock records. */
export const createId = (prefix: string): string => {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
};

export const nowIso = (): string => new Date().toISOString();
