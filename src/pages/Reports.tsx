import React, { useState } from 'react';
import { Download, Filter, Calendar } from 'lucide-react';
import { formatIDR } from '../utils/format';
import { useAppContext } from '../contexts/AppContext';
import { Button } from '../components/ui/Button';

export const Reports = () => {
  const { payments, taxpayers } = useAppContext();
  const [period, setPeriod] = useState('Bulan Ini');

  const exportReport = () => {
    const csvContent = [
      ['ID Transaksi', 'Tanggal', 'NOP', 'Nama WP', 'Nominal', 'Petugas'].join(','),
      ...payments.map(p => {
        const t = taxpayers.find(t => t.id === p.nop);
        return [
          p.id,
          new Date(p.date).toLocaleString(),
          p.nop,
          `"${t?.name || 'Tidak diketahui'}"`,
          p.amount,
          p.collectorId
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Laporan_Penerimaan_${period.replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Laporan Penerimaan</h1>
          <p className="text-slate-500 font-medium mt-1">Rekapitulasi pembayaran PBB-P2</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="secondary">
            <Filter size={18} className="mr-2" /> Filter
          </Button>
          <Button variant="primary" onClick={exportReport}>
            <Download size={18} className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 rounded-[32px] p-8 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
          <p className="text-emerald-100 font-bold uppercase tracking-wider text-xs mb-2 relative z-10">Total Penerimaan</p>
          <p className="text-4xl font-black relative z-10">{formatIDR(totalCollected)}</p>
          <p className="text-emerald-200 text-sm mt-4 relative z-10 flex items-center gap-2">
            <Calendar size={14} /> {payments.length} Transaksi
          </p>
        </div>
        
        <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm md:col-span-2">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Periode Laporan</h3>
           <div className="flex flex-wrap gap-3">
             {['Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini'].map(p => (
               <button 
                 key={p}
                 onClick={() => setPeriod(p)}
                 className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                   period === p 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                 }`}
               >
                 {p}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-black text-slate-800">Riwayat Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">NOP & Nama WP</th>
                <th className="px-6 py-4 text-right">Nominal</th>
                <th className="px-6 py-4">Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map(payment => {
                const taxpayer = taxpayers.find(t => t.id === payment.nop);
                return (
                  <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{new Date(payment.date).toLocaleDateString('id-ID')}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{new Date(payment.date).toLocaleTimeString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{taxpayer?.name || 'Unknown'}</div>
                      <div className="text-[11px] font-mono font-bold text-blue-600 mt-0.5">{payment.nop}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-emerald-600">
                      {formatIDR(payment.amount)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {payment.collectorId}
                    </td>
                  </tr>
                );
              })}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                    Belum ada transaksi pada periode ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
