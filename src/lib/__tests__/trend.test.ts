import { trendDirection } from '@/lib/trend';

describe('trendDirection', () => {
  it('kurang dari 2 titik = data belum cukup (bukan "naik")', () => {
    expect(trendDirection([])).toBe('insufficient');
    expect(trendDirection([60])).toBe('insufficient');
  });

  it('naik/turun/stabil berdasarkan selisih awal vs akhir', () => {
    expect(trendDirection([50, 55, 72])).toBe('up');
    expect(trendDirection([95, 60])).toBe('down');
    expect(trendDirection([70, 73])).toBe('flat');
  });
});
