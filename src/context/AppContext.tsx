import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Taxpayer, House, User, Payment } from '../types';
import { mockTaxpayers, mockHouses, currentUser } from '../data/mock';

interface AppContextType {
  taxpayers: Taxpayer[];
  houses: House[];
  user: User;
  payments: Payment[];
  updateTaxpayerStatus: (id: string, status: Taxpayer['status']) => void;
  recordPayment: (payment: Omit<Payment, 'id' | 'date'>) => void;
  importTaxpayers: (newTaxpayers: Taxpayer[], newHouses: House[]) => void;
  updateTaxpayerData: (id: string, taxpayerUpdates: Partial<Taxpayer>, houseUpdates: Partial<House>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [taxpayers, setTaxpayers] = useState<Taxpayer[]>(mockTaxpayers);
  const [houses, setHouses] = useState<House[]>(mockHouses);
  const [payments, setPayments] = useState<Payment[]>([]);

  const updateTaxpayerStatus = (id: string, status: Taxpayer['status']) => {
    setTaxpayers(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const recordPayment = (payment: Omit<Payment, 'id' | 'date'>) => {
    const newPayment: Payment = {
      ...payment,
      id: `PAY-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setPayments(prev => [...prev, newPayment]);
    updateTaxpayerStatus(payment.nop, 'PAID');
  };

  const importTaxpayers = (newTaxpayers: Taxpayer[], newHouses: House[]) => {
    setTaxpayers(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const filteredNew = newTaxpayers.filter(t => !existingIds.has(t.id));
      return [...prev, ...filteredNew];
    });
    setHouses(prev => {
      const existingIds = new Set(prev.map(h => h.id));
      const filteredNew = newHouses.filter(h => !existingIds.has(h.id));
      return [...prev, ...filteredNew];
    });
  };

  const updateTaxpayerData = (id: string, taxpayerUpdates: Partial<Taxpayer>, houseUpdates: Partial<House>) => {
    setTaxpayers(prev => prev.map(t => t.id === id ? { ...t, ...taxpayerUpdates } : t));
    const targetTaxpayer = taxpayers.find(t => t.id === id);
    if (targetTaxpayer && targetTaxpayer.houseId && Object.keys(houseUpdates).length > 0) {
      setHouses(prev => prev.map(h => h.id === targetTaxpayer.houseId ? { ...h, ...houseUpdates } : h));
    }
  };

  return (
    <AppContext.Provider value={{ 
      taxpayers, 
      houses, 
      user: currentUser, 
      payments,
      updateTaxpayerStatus,
      recordPayment,
      importTaxpayers,
      updateTaxpayerData
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
