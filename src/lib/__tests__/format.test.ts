import { formatCountdown, formatKm, formatNumber, scoreTone } from '../format';

describe('format helpers', () => {
  it('formats Indonesian thousands separators', () => {
    expect(formatNumber(1234)).toBe('1.234');
    expect(formatKm(1234)).toBe('1.234 km');
  });

  it('formats the OTP countdown', () => {
    expect(formatCountdown(42)).toBe('0:42');
    expect(formatCountdown(-5)).toBe('0:00');
  });

  it('maps scores to tone bands', () => {
    expect(scoreTone(80)).toBe('success');
    expect(scoreTone(79)).toBe('warning');
    expect(scoreTone(59)).toBe('critical');
  });
});
