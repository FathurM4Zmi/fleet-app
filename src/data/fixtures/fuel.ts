import type { FuelCardAccount, FuelTransaction } from '../types';

/** Virtual fuel card attached to the driver (module M08). */
export const fuelCardAccount: FuelCardAccount = {
  number: '4821 •••• •••• 7734',
  holder: 'BUDI SANTOSO',
  limit: 3_000_000,
  remaining: 1_240_000,
  used: 1_760_000,
  resetDay: 1,
  status: 'active',
};

export const fuelTransactions: FuelTransaction[] = [
  {
    key: 'txn-01',
    station: 'Pertamina Cikarang',
    dateLabel: '13 Okt',
    liters: 45,
    amount: 'Rp 652.500',
    status: 'reconciled',
    statusLabel: 'Terekonsiliasi',
  },
  {
    key: 'txn-02',
    station: 'Shell Kalideres',
    dateLabel: '12 Okt',
    liters: 40,
    amount: 'Rp 580.000',
    status: 'reconciled',
    statusLabel: 'Terekonsiliasi',
  },
  {
    key: 'txn-03',
    station: 'Pertamina Bekasi',
    dateLabel: '10 Okt',
    liters: 50,
    amount: 'Rp 715.000',
    status: 'pending',
    statusLabel: 'Menunggu',
  },
  {
    key: 'txn-04',
    station: 'Pertamina Jakarta',
    dateLabel: '08 Okt',
    liters: 45,
    amount: 'Rp 645.000',
    status: 'flagged',
    statusLabel: 'Ditandai',
    note: 'Menunggu tinjauan supervisor',
  },
];

/** Recently logged fuel entries, shown as a short recap under the form. */
export const recentFuelLogs = [
  { key: 'log-01', station: 'Pertamina Cikarang', dateLabel: '13 Okt', liters: 45, amount: 'Rp 652.500' },
  { key: 'log-02', station: 'Shell Kalideres', dateLabel: '12 Okt', liters: 40, amount: 'Rp 580.000' },
];
