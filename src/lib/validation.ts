/** A DVIR item marked as failed must carry photo evidence. */
export const isDvirItemComplete = (item: { result: string | null; photoUri?: string }): boolean => {
  if (item.result === null) return false;
  if (item.result === 'fail') return Boolean(item.photoUri);
  return true;
};

/** The driver app can only attach photos; signature capture is not implemented yet. */
export const isPodComplete = (pod: { photoUris: string[] }): boolean => pod.photoUris.length > 0;

export const isPinComplete = (pin: string): boolean => /^\d{6}$/.test(pin);

export const isOtpComplete = (code: string): boolean => /^\d{6}$/.test(code);
