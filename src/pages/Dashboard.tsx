import React from 'react';
import { 
  Users, MapPin, DollarSign, XCircle, Activity, 
  PieChart, Receipt, CreditCard 
} from 'lucide-react';
import { formatIDR } from '../utils/format';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area
} from 'recharts';
import { motion } from 'motion/react';
import { useDashboard } from '../hooks/useDashboard';

const StatCard = ({ title, value, subtitle, icon: Icon, color, delay }: { title: string, value: string | number, subtitle: string, icon: React.ElementType, color: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow"
  >
    <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 bg-current ${color} group-hover:scale-150 transition-transform duration-700 ease-out pointer-events-none`}></div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={`p-4 rounded-2xl bg-slate-50 ${color}`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">{title}</h3>
      <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
      <p className="text-sm text-slate-500 font-medium mt-2 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
        {subtitle}
      </p>
    </div>
  </motion.div>
);

export const Dashboard = () => {
  const { stats, chartData, dummyTrendData } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Ringkasan</h1>
          <p className="text-slate-500 font-medium mt-1">Pantau progres penerimaan PBB-P2 secara real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total SPPT" value={stats.totalSPPT} subtitle="Objek Pajak" icon={Users} color="text-blue-600" delay={0.1} />
        <StatCard title="Telah Lunas" value={stats.paidCount} subtitle={`${stats.percentage}% dari total`} icon={DollarSign} color="text-emerald-600" delay={0.2} />
        <StatCard title="Rumah Terdata" value={stats.totalHouses} subtitle="Pemetaan GIS" icon={MapPin} color="text-amber-600" delay={0.3} />
        <StatCard title="Sisa Tunggakan" value={formatIDR(stats.target - stats.collected)} subtitle={`${stats.unpaidCount} Objek Pajak`} icon={XCircle} color="text-rose-600" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 lg:col-span-2 relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" />
              Target & Realisasi
            </h2>
            <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm">
              {stats.percentage}% Selesai
            </div>
          </div>
          
          <div className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-sm mb-2 font-bold">
                <span className="text-slate-500">Terkumpul</span>
                <span className="text-emerald-600 text-lg">{formatIDR(stats.collected)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Number(stats.percentage))}%` }}
                  transition={{ delay: 0.8, duration: 1, type: "spring" }}
                  className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full"
                ></motion.div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Keseluruhan</span>
                <p className="font-black text-slate-800 text-lg mt-1">{formatIDR(stats.target)}</p>
              </div>
              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Sisa Tagihan</span>
                <p className="font-black text-rose-600 text-lg mt-1">{formatIDR(stats.target - stats.collected)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 flex flex-col relative overflow-hidden"
        >
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-6 flex items-center gap-2 relative z-10">
            <PieChart size={18} className="text-blue-500" />
            Status SPPT
          </h2>
          <div className="flex-1 min-h-[200px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 700 }} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 lg:col-span-2 relative overflow-hidden"
        >
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-6 flex items-center gap-2 relative z-10">
            <Receipt size={18} className="text-violet-500" />
            Trend Penerimaan (Simulasi)
          </h2>
          <div className="h-[250px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="bg-slate-900 rounded-[32px] shadow-lg border border-slate-800 p-8 text-white flex flex-col"
        >
           <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
            <CreditCard size={18} className="text-sky-400" />
            Statistik Nilai Pajak
          </h2>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Rata-rata Tagihan</p>
              <p className="text-3xl font-black text-white">{formatIDR(stats.avgTax)}</p>
            </div>
            <div className="h-px bg-slate-800 w-full"></div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tagihan Tertinggi</p>
              <p className="text-2xl font-bold text-rose-400">{formatIDR(stats.highestTax)}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tagihan Terendah</p>
              <p className="text-xl font-bold text-emerald-400">{formatIDR(stats.lowestTax)}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
