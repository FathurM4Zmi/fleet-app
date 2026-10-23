import {
  isDvirItemComplete,
  isOtpComplete,
  isPinComplete,
  isPodComplete,
} from '../validation';

describe('DVIR item validation', () => {
  it('rejects an unanswered item', () => {
    expect(isDvirItemComplete({ result: null })).toBe(false);
  });

  it('accepts pass and N/A without a photo', () => {
    expect(isDvirItemComplete({ result: 'pass' })).toBe(true);
    expect(isDvirItemComplete({ result: 'na' })).toBe(true);
  });

  it('requires photo evidence for a failed item', () => {
    expect(isDvirItemComplete({ result: 'fail' })).toBe(false);
    expect(isDvirItemComplete({ result: 'fail', photoUri: 'file://photo.jpg' })).toBe(true);
  });
});

describe('POD validation', () => {
  it('requires at least one photo', () => {
    expect(isPodComplete({ photoUris: [] })).toBe(false);
    expect(isPodComplete({ photoUris: ['uploads/pod/1.jpg'] })).toBe(true);
  });
});

describe('PIN and OTP format', () => {
  it('accepts exactly six digits', () => {
    expect(isPinComplete('123456')).toBe(true);
    expect(isOtpComplete('000000')).toBe(true);
  });

  it('rejects short or non-numeric codes', () => {
    expect(isPinComplete('12345')).toBe(false);
    expect(isPinComplete('abcdef')).toBe(false);
    expect(isOtpComplete('12345a')).toBe(false);
  });
});
