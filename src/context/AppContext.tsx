import React, { createContext, useContext, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Taxpayer, House, User, Payment } from '../types';
import { db } from '../database/db';

const currentUser: User = {
  id: 'u1',
  name: 'Personal Admin',
  role: 'ADMIN',
};

interface AppContextType {
  taxpayers: Taxpayer[];
  houses: House[];
  user: User;
  payments: Payment[];
  updateTaxpayerStatus: (id: string, status: Taxpayer['status']) => Promise<void>;
  recordPayment: (payment: Omit<Payment, 'id' | 'date'>) => Promise<void>;
  importTaxpayers: (newTaxpayers: Taxpayer[], newHouses: House[]) => Promise<void>;
  updateTaxpayerData: (id: string, taxpayerUpdates: Partial<Taxpayer>, houseUpdates: Partial<House>) => Promise<void>;
  clearDatabase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const taxpayers = useLiveQuery(() => db.taxpayers.toArray()) || [];
  const houses = useLiveQuery(() => db.houses.toArray()) || [];
  const payments = useLiveQuery(() => db.payments.toArray()) || [];

  const updateTaxpayerStatus = async (id: string, status: Taxpayer['status']) => {
    await db.taxpayers.update(id, { status });
  };

  const recordPayment = async (payment: Omit<Payment, 'id' | 'date'>) => {
    const newPayment: Payment = {
      ...payment,
      id: `PAY-${Date.now()}`,
      date: new Date().toISOString(),
    };
    await db.transaction('rw', db.payments, db.taxpayers, async () => {
      await db.payments.add(newPayment);
      await db.taxpayers.update(payment.nop, { status: 'LUNAS' });
    });
  };

  const importTaxpayers = async (newTaxpayers: Taxpayer[], newHouses: House[]) => {
    await db.transaction('rw', db.taxpayers, db.houses, async () => {
      for (const t of newTaxpayers) {
        await db.taxpayers.put(t);
      }
      for (const h of newHouses) {
        await db.houses.put(h);
      }
    });
  };

  const updateTaxpayerData = async (id: string, taxpayerUpdates: Partial<Taxpayer>, houseUpdates: Partial<House>) => {
    await db.transaction('rw', db.taxpayers, db.houses, async () => {
      await db.taxpayers.update(id, taxpayerUpdates);
      const targetTaxpayer = await db.taxpayers.get(id);
      if (targetTaxpayer && targetTaxpayer.houseId && Object.keys(houseUpdates).length > 0) {
        await db.houses.update(targetTaxpayer.houseId, houseUpdates);
      }
    });
  };

  const clearDatabase = async () => {
    await db.transaction('rw', db.taxpayers, db.houses, db.payments, db.visits, async () => {
      await db.taxpayers.clear();
      await db.houses.clear();
      await db.payments.clear();
      await db.visits.clear();
    });
  }

  return (
    <AppContext.Provider value={{ 
      taxpayers, 
      houses, 
      user: currentUser, 
      payments,
      updateTaxpayerStatus,
      recordPayment,
      importTaxpayers,
      updateTaxpayerData,
      clearDatabase
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
