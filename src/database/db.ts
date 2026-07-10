import Dexie, { Table } from 'dexie';
import { Taxpayer, House, Payment, Visit } from '../types';

export class PbbDatabase extends Dexie {
  taxpayers!: Table<Taxpayer, string>;
  houses!: Table<House, string>;
  payments!: Table<Payment, string>;
  visits!: Table<Visit, string>;

  constructor() {
    super('PBB-P2-Database');
    this.version(1).stores({
      taxpayers: 'id, name, village, rt, rw, block, status',
      houses: 'id',
      payments: 'id, nop, date, collectorId',
      visits: 'id, nop, date, status'
    });
  }
}

export const db = new PbbDatabase();
