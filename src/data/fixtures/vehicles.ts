import type { Vehicle } from '../types';

export const vehicles: Vehicle[] = [
  {
    id: 'veh-001',
    plate: 'B 9021 KYD',
    model: 'Isuzu Traga',
    type: 'Light Truck',
    odometerKm: 148_320,
    status: 'in_use',
  },
  {
    id: 'veh-002',
    plate: 'B 7742 UXT',
    model: 'Mitsubishi Canter',
    type: 'Medium Truck',
    odometerKm: 231_884,
    status: 'available',
  },
  {
    id: 'veh-003',
    plate: 'B 3388 TRB',
    model: 'Hino Dutro',
    type: 'Light Truck',
    odometerKm: 96_540,
    status: 'blocked',
    blockedReason: 'DVIR pre-trip gagal — kebocoran oli',
  },
];

export const vehicleById = (id: string): Vehicle | undefined =>
  vehicles.find((vehicle) => vehicle.id === id);
