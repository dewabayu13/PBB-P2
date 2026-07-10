import { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';

export const usePayment = () => {
  const { taxpayers, recordPayment, payments, user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [scanMode, setScanMode] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  
  const searchResult = useMemo(() => {
    if (!searchTerm || searchTerm.length < 3) return null;
    return taxpayers.find(t => 
      t.id.includes(searchTerm) || 
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, taxpayers]);

  return {
    searchTerm,
    setSearchTerm,
    scanMode,
    setScanMode,
    paymentAmount,
    setPaymentAmount,
    searchResult,
    recordPayment,
    payments,
    user
  };
};
