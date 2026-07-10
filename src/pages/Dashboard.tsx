import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatIDR } from '../lib/utils';
import { PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const { taxpayers, houses } = useAppContext();

  const stats = useMemo(() => {
    const totalSPPT = taxpayers.length;
    const paid = taxpayers.filter(t => t.status === 'PAID');
    const unpaid = taxpayers.filter(t => t.status === 'UNPAID' || t.status === 'NOT_VISITED');
    
    const target = taxpayers.reduce((sum, t) => sum + t.taxAmount, 0);
    const collected = paid.reduce((sum, t) => sum + t.taxAmount, 0);
    const percentage = target > 0 ? (collected / target) * 100 : 0;

    return {
      totalSPPT,
      totalHouses: houses.length,
      paidCount: paid.length,
      unpaidCount: unpaid.length,
      target,
      collected,
      percentage: percentage.toFixed(1)
    };
  }, [taxpayers, houses]);

  const chartData = [
    { name: 'Lunas', value: stats.paidCount, color: '#16a34a' }, // green-600
    { name: 'Belum', value: stats.unpaidCount, color: '#dc2626' } // red-600
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Dashboard Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E0E2E6] shadow-sm">
          <p className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider mb-1">Total SPPT</p>
          <h3 className="text-2xl font-bold text-[#001D3D]">{stats.totalSPPT}</h3>
          <div className="flex items-center mt-2 text-[11px] text-blue-600 font-semibold">
            <span>+{Math.floor(stats.totalSPPT * 0.1)} Tahun ini</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E0E2E6] shadow-sm">
          <p className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider mb-1">Terealisasi (Rp)</p>
          <h3 className="text-2xl font-bold text-green-600">{formatIDR(stats.collected)}</h3>
          <div className="flex items-center mt-2 text-[11px] text-green-600 font-semibold">
            <span>{stats.percentage}% dari Target</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E0E2E6] shadow-sm">
          <p className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider mb-1">Rumah Terdata</p>
          <h3 className="text-2xl font-bold text-[#001D3D]">{stats.totalHouses}</h3>
          <div className="flex items-center mt-2 text-[11px] text-amber-600 font-semibold">
            <span>92% GIS Coverage</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E0E2E6] shadow-sm">
          <p className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider mb-1">Sisa Tunggakan</p>
          <h3 className="text-2xl font-bold text-red-600">{formatIDR(stats.target - stats.collected)}</h3>
          <div className="flex items-center mt-2 text-[11px] text-red-500 font-semibold">
            <span>{stats.unpaidCount} Objek Pajak</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Progress */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E0E2E6] p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#001D3D]">Target Penerimaan</h2>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {stats.percentage}% Terkumpul
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1 font-bold">
                <span className="text-[#64748B]">Terkumpul</span>
                <span className="text-[#001D3D]">{formatIDR(stats.collected)}</span>
              </div>
              <div className="w-full bg-[#E0E2E6] rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Number(stats.percentage))}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm items-center pt-4 border-t border-[#F1F3F5] font-medium">
              <span className="text-[#64748B]">Target Keseluruhan</span>
              <span className="font-bold text-[#001D3D]">{formatIDR(stats.target)}</span>
            </div>
            <div className="flex justify-between text-sm items-center pt-2 font-medium">
              <span className="text-[#64748B]">Sisa Tagihan</span>
              <span className="font-bold text-red-600">{formatIDR(stats.target - stats.collected)}</span>
            </div>
          </div>
        </div>

        {/* Status Breakdown Chart */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E0E2E6] p-6 flex flex-col">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#001D3D] mb-6 flex items-center gap-2">
            <PieChart size={16} className="text-[#64748B]" />
            Status SPPT
          </h2>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E2E6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <Tooltip cursor={{ fill: '#F0F2F5' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E0E2E6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
