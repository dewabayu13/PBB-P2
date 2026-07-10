import { db } from '../database/db';
import { Taxpayer, House, Payment, Visit } from '../types';

export const TaxpayerRepository = {
  getAll: () => db.taxpayers.toArray(),
  getById: (id: string) => db.taxpayers.get(id),
  update: (id: string, changes: Partial<Taxpayer>) => db.taxpayers.update(id, changes),
  put: (taxpayer: Taxpayer) => db.taxpayers.put(taxpayer),
  clear: () => db.taxpayers.clear(),
  bulkAdd: (taxpayers: Taxpayer[]) => db.taxpayers.bulkAdd(taxpayers),
};

export const HouseRepository = {
  getAll: () => db.houses.toArray(),
  getById: (id: string) => db.houses.get(id),
  update: (id: string, changes: Partial<House>) => db.houses.update(id, changes),
  put: (house: House) => db.houses.put(house),
  clear: () => db.houses.clear(),
  bulkAdd: (houses: House[]) => db.houses.bulkAdd(houses),
};

export const PaymentRepository = {
  getAll: () => db.payments.toArray(),
  add: (payment: Payment) => db.payments.add(payment),
  clear: () => db.payments.clear(),
  bulkAdd: (payments: Payment[]) => db.payments.bulkAdd(payments),
};

export const VisitRepository = {
  getAll: () => db.visits.toArray(),
  add: (visit: Visit) => db.visits.add(visit),
  clear: () => db.visits.clear(),
  bulkAdd: (visits: Visit[]) => db.visits.bulkAdd(visits),
};
