export type TaxStatus = 'PAID' | 'UNPAID' | 'NOT_VISITED' | 'EMPTY' | 'INVALID';

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
  location: { lat: number; lng: number };
}

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR' | 'COLLECTOR' | 'VILLAGE_HEAD';
  avatar?: string;
}
