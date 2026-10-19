/** A DVIR item marked as failed must carry photo evidence. */
export const isDvirItemComplete = (item: { result: string | null; photoUri?: string }): boolean => {
  if (item.result === null) return false;
  if (item.result === 'fail') return Boolean(item.photoUri);
  return true;
};

/** A POD is valid with either a photo or a recipient signature. */
export const isPodComplete = (pod: { photoUris: string[]; hasSignature: boolean }): boolean =>
  pod.photoUris.length > 0 || pod.hasSignature;

export const isPinComplete = (pin: string): boolean => /^\d{6}$/.test(pin);

export const isOtpComplete = (code: string): boolean => /^\d{6}$/.test(code);
