import { db } from '../database/db';
import { Taxpayer, House, Payment } from '../types';
import { TaxpayerRepository, HouseRepository, PaymentRepository, VisitRepository } from '../repositories';

export const TaxpayerService = {
  updateStatus: async (id: string, status: Taxpayer['status']) => {
    await TaxpayerRepository.update(id, { status });
  },

  recordPayment: async (payment: Omit<Payment, 'id' | 'date'>) => {
    const newPayment: Payment = {
      ...payment,
      id: `PAY-${Date.now()}`,
      date: new Date().toISOString(),
    };
    await db.transaction('rw', db.payments, db.taxpayers, async () => {
      await PaymentRepository.add(newPayment);
      await TaxpayerRepository.update(payment.nop, { status: 'LUNAS' });
    });
  },

  importTaxpayers: async (newTaxpayers: Taxpayer[], newHouses: House[]) => {
    await db.transaction('rw', db.taxpayers, db.houses, async () => {
      for (const t of newTaxpayers) {
        await TaxpayerRepository.put(t);
      }
      for (const h of newHouses) {
        await HouseRepository.put(h);
      }
    });
  },

  updateTaxpayerData: async (id: string, taxpayerUpdates: Partial<Taxpayer>, houseUpdates: Partial<House>) => {
    await db.transaction('rw', db.taxpayers, db.houses, async () => {
      await TaxpayerRepository.update(id, taxpayerUpdates);
      const targetTaxpayer = await TaxpayerRepository.get(id);
      if (targetTaxpayer && targetTaxpayer.houseId && Object.keys(houseUpdates).length > 0) {
        await HouseRepository.update(targetTaxpayer.houseId, houseUpdates);
      }
    });
  },

  clearDatabase: async () => {
    await db.transaction('rw', db.taxpayers, db.houses, db.payments, db.visits, async () => {
      await TaxpayerRepository.clear();
      await HouseRepository.clear();
      await PaymentRepository.clear();
      await VisitRepository.clear();
    });
  }
};
