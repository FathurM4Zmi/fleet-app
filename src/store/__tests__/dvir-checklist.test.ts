import { appReducer, type AppState } from '../reducers';

const base = (): AppState =>
  ({ trips: [], dvir: [], pods: [], notifications: [] }) as unknown as AppState;

const template = {
  type: 'dvir/applyChecklist' as const,
  tripId: 't1',
  inspectionType: 'pre' as const,
  templateName: 'Reefer',
  items: [{ id: 'r-01', label: 'Suhu box ≤ 4°C', group: 'Pendingin', critical: true }],
};

describe('dvir/applyChecklist (FRD-M17-04)', () => {
  it('mengganti checklist standar dengan template server selama belum ada jawaban', () => {
    const started = appReducer(base(), { type: 'dvir/start', tripId: 't1', inspectionType: 'pre' });
    expect(started.dvir[0].items.some((i) => i.critical)).toBe(true);

    const next = appReducer(started, template);
    expect(next.dvir[0].templateName).toBe('Reefer');
    expect(next.dvir[0].items).toEqual([{ ...template.items[0], result: null }]);
  });

  it('tidak membuang jawaban driver yang sudah diisi', () => {
    let s = appReducer(base(), { type: 'dvir/start', tripId: 't1', inspectionType: 'pre' });
    const firstId = s.dvir[0].items[0].id;
    s = appReducer(s, { type: 'dvir/setItem', tripId: 't1', inspectionType: 'pre', itemId: firstId, patch: { result: 'pass' } });
    const after = appReducer(s, template);
    expect(after.dvir[0].templateName).toBeUndefined();
    expect(after.dvir[0].items[0].result).toBe('pass');
  });
});
