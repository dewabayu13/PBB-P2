export type TaxStatus = 'BELUM_LUNAS' | 'LUNAS' | 'SUDAH_DIKUNJUNGI' | 'RUMAH_KOSONG' | 'DATA_BERMASALAH';

export interface Taxpayer {
  id: string; // NOP
  name: string;
  address: string;
  village: string;
  hamlet: string;
  rt: string;
  rw: string;
  block: string;
  landArea: number;
  buildingArea: number;
  taxAmount: number;
  phone: string;
  status: TaxStatus;
  notes?: string;
  houseId: string;
  lat?: number;
  lng?: number;
}

export interface House {
  id: string;
  lat: number;
  lng: number;
  photoUrl?: string;
  qrCode?: string;
  lastVisit?: string;
  collectorNotes?: string;
}

export interface Payment {
  id: string;
  nop: string;
  amount: number;
  date: string;
  collectorId: string;
  photoUrl?: string;
  lat?: number;
  lng?: number;
  notes?: string;
}

export interface Visit {
  id: string;
  nop: string;
  date: string;
  status: TaxStatus;
  notes?: string;
  lat?: number;
  lng?: number;
  photoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR' | 'COLLECTOR' | 'VILLAGE_HEAD';
  avatar?: string;
}
