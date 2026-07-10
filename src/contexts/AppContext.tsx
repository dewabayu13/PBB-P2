import React, { createContext, useContext, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Taxpayer, House, User, Payment } from '../types';
import { db } from '../database/db';
import { TaxpayerService } from '../services/TaxpayerService';

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

  return (
    <AppContext.Provider value={{ 
      taxpayers, 
      houses, 
      user: currentUser, 
      payments,
      updateTaxpayerStatus: TaxpayerService.updateStatus,
      recordPayment: TaxpayerService.recordPayment,
      importTaxpayers: TaxpayerService.importTaxpayers,
      updateTaxpayerData: TaxpayerService.updateTaxpayerData,
      clearDatabase: TaxpayerService.clearDatabase
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
