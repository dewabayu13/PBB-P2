import { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Taxpayer } from '../types';

export const useTaxpayer = () => {
  const { taxpayers, updateTaxpayerStatus, updateTaxpayerData } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTaxpayers = useMemo(() => {
    return taxpayers.filter(t => {
      const matchesSearch = 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.includes(searchTerm) ||
        t.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [taxpayers, searchTerm, statusFilter]);

  return {
    taxpayers: filteredTaxpayers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    updateTaxpayerStatus,
    updateTaxpayerData
  };
};
