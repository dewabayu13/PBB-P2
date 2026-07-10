import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Map as MapIcon, ClipboardList, FileBarChart, Settings, Bell } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const Layout = () => {
  const location = useLocation();
  const { user } = useAppContext();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/taxpayers', label: 'Wajib Pajak', icon: Users },
    { path: '/map', label: 'Peta GIS', icon: MapIcon },
    { path: '/collection', label: 'Penerimaan', icon: ClipboardList },
    { path: '/reports', label: 'Laporan', icon: FileBarChart },
    { path: '/settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 shadow-sm z-20 transition-all`}>
        <div className="p-6 flex flex-col items-center justify-center text-center gap-3 relative">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center font-bold text-xl overflow-hidden shadow-sm border border-blue-100">
            <span className="text-2xl text-blue-600">P</span>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight leading-none uppercase text-slate-800">PBB-P2 VILLAGE</h1>
            <p className="text-[10px] text-blue-500 font-bold tracking-wider mt-1">SMART VILLAGE v2.0</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-semibold'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 sm:h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 z-10">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center font-bold text-blue-600">
              P
            </div>
            <h1 className="text-xs font-black tracking-tight uppercase text-slate-800">PBB-P2</h1>
          </div>
          <div className="hidden lg:block">
            <h2 className="text-lg font-black text-slate-800 capitalize tracking-tight">
              {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50"></span>
            </button>
            <div className="flex items-center gap-3 bg-slate-50 pl-2 pr-4 py-1.5 rounded-full border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                {user?.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-700 leading-none">{user?.name}</p>
                <p className="text-[9px] text-blue-500 font-bold uppercase tracking-wider mt-0.5">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 flex justify-around p-2 pb-safe z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors min-w-[64px] ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-50' : 'bg-transparent'}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[9px] font-bold ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                  {item.label === 'Wajib Pajak' ? 'W. Pajak' : item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
