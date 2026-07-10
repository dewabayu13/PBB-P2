import React from 'react';
import { useAppContext } from '../context/AppContext';
import { formatIDR } from '../lib/utils';
import { Download, FileText, Calendar } from 'lucide-react';

export default function Reports() {
  const { payments, taxpayers } = useAppContext();

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#001D3D] tracking-tight">Laporan & Audit</h1>
          <p className="text-sm font-medium text-[#64748B] mt-1">Unduh laporan harian, mingguan, dan rekapitulasi.</p>
        </div>
        <button className="bg-[#3A86FF] hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-md flex items-center gap-2 transition-colors text-sm">
          <Download size={16} />
          Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E0E2E6] shadow-sm hover:border-blue-300 cursor-pointer transition-colors group">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#3A86FF] group-hover:text-white transition-colors">
              <Calendar size={20} />
            </div>
            <h3 className="font-bold text-[#001D3D]">Laporan Harian</h3>
            <p className="text-xs font-medium text-[#64748B] mt-1">Rekap setoran kolektor hari ini.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#E0E2E6] shadow-sm hover:border-blue-300 cursor-pointer transition-colors group">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileText size={20} />
            </div>
            <h3 className="font-bold text-[#001D3D]">Laporan Mingguan / RT</h3>
            <p className="text-xs font-medium text-[#64748B] mt-1">Capaian target per wilayah RT/RW.</p>
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-3xl border border-[#E0E2E6] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#F1F3F5] flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#001D3D]">Log Aktivitas Terbaru (Audit Trail)</h3>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{payments.length} transaksi</span>
          </div>
          <div className="flex-1 overflow-auto">
            {payments.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium">
                Belum ada aktivitas pembayaran tercatat.
              </div>
            ) : (
              <ul className="divide-y divide-[#F1F3F5]">
                {payments.slice().reverse().map((payment) => {
                  const target = taxpayers.find(t => t.id === payment.nop);
                  return (
                    <li key={payment.id} className="p-4 hover:bg-[#F8FAFC] transition-colors flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#001D3D]">
                          Pembayaran Diterima - {target?.name || payment.nop}
                        </p>
                        <p className="text-[11px] font-medium text-[#64748B] mt-1">
                          Petugas: Kolektor ID {payment.collectorId} • {new Date(payment.date).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right flex flex-col justify-center">
                        <p className="text-sm font-bold text-green-600">+{formatIDR(payment.amount)}</p>
                        <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-tighter">ID: {payment.id.substring(0, 12)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
