import { useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';

export const useDashboard = () => {
  const { taxpayers, houses } = useAppContext();

  const stats = useMemo(() => {
    const totalSPPT = taxpayers.length;
    const paid = taxpayers.filter(t => t.status === 'LUNAS');
    const unpaid = taxpayers.filter(t => t.status === 'BELUM_LUNAS');
    
    const target = taxpayers.reduce((sum, t) => sum + t.taxAmount, 0);
    const collected = paid.reduce((sum, t) => sum + t.taxAmount, 0);
    const percentage = target > 0 ? (collected / target) * 100 : 0;
    
    const avgTax = target > 0 ? target / totalSPPT : 0;
    const highestTax = taxpayers.length > 0 ? Math.max(...taxpayers.map(t => t.taxAmount)) : 0;
    const lowestTax = taxpayers.length > 0 ? Math.min(...taxpayers.map(t => t.taxAmount)) : 0;

    return {
      totalSPPT,
      totalHouses: houses.length,
      paidCount: paid.length,
      unpaidCount: unpaid.length,
      target,
      collected,
      percentage: percentage.toFixed(1),
      avgTax,
      highestTax,
      lowestTax
    };
  }, [taxpayers, houses]);

  const chartData = useMemo(() => [
    { name: 'Lunas', value: stats.paidCount, color: '#16a34a' },
    { name: 'Belum', value: stats.unpaidCount, color: '#dc2626' }
  ], [stats.paidCount, stats.unpaidCount]);

  const dummyTrendData = useMemo(() => [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ], []);

  return { stats, chartData, dummyTrendData };
};
