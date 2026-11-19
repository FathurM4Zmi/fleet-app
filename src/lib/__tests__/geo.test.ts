import { distanceKm, pathLengthKm } from '../geo';

const jakarta = { lat: -6.2, lng: 106.8 };
const bandung = { lat: -6.9175, lng: 107.6191 };

describe('distanceKm', () => {
  it('is zero for the same coordinate', () => {
    expect(distanceKm(jakarta, jakarta)).toBe(0);
  });

  it('matches the known Jakarta–Bandung great-circle distance', () => {
    // ~118 km according to the haversine formula; allow a small tolerance.
    const km = distanceKm(jakarta, bandung);
    expect(km).toBeGreaterThan(110);
    expect(km).toBeLessThan(125);
  });

  it('is symmetric', () => {
    expect(distanceKm(jakarta, bandung)).toBeCloseTo(distanceKm(bandung, jakarta), 6);
  });

  it('handles a short hop in metres without collapsing to zero', () => {
    expect(distanceKm({ lat: -6.2, lng: 106.8 }, { lat: -6.2001, lng: 106.8 })).toBeGreaterThan(0);
  });
});

describe('pathLengthKm', () => {
  it('returns zero for an empty or single-point trail', () => {
    expect(pathLengthKm([])).toBe(0);
    expect(pathLengthKm([{ latitude: -6.2, longitude: 106.8 }])).toBe(0);
  });

  it('sums every segment of the trail', () => {
    const trail = [
      { latitude: jakarta.lat, longitude: jakarta.lng },
      { latitude: bandung.lat, longitude: bandung.lng },
      { latitude: bandung.lat, longitude: bandung.lng },
    ];

    expect(pathLengthKm(trail)).toBeCloseTo(distanceKm(jakarta, bandung), 6);
  });
});
