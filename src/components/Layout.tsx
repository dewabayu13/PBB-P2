import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, Users, Receipt, FileBarChart, Menu, X, Search, Bell } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAppContext();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Peta Interaktif', href: '/map', icon: MapIcon },
    { name: 'Data Wajib Pajak', href: '/taxpayers', icon: Users },
    { name: 'Modul Penagihan', href: '/collection', icon: Receipt },
    { name: 'Laporan Realisasi', href: '/reports', icon: FileBarChart },
  ];

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-[#1A1C1E] overflow-hidden font-sans">
      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-[#001D3D] text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col shadow-xl",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-[#ffffff1a] flex flex-col items-center justify-center text-center gap-3 relative">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 lg:hidden p-1 hover:bg-[#ffffff1a] rounded text-slate-300 hover:text-white">
            <X size={20} />
          </button>
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-xl overflow-hidden shadow-lg border border-[#ffffff1a]">
            <img src="/logo.png" alt="Logo Tim Tenang Ada Bayu" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl">P</span>'; }} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight leading-none uppercase text-white">PBB-P2 TENANG ADA BAYU</h1>
            <p className="text-[10px] text-[#A8B2BD] font-medium tracking-wider mt-1">PERSONAL WORKSPACE</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[#ffffff14] text-white" 
                    : "text-[#A8B2BD] hover:bg-[#ffffff0a]"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "opacity-80" : "opacity-60")} />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#ffffff1a]">
          <div className="flex items-center gap-3 p-2 bg-[#003566] rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight truncate">{user.name}</p>
              <p className="text-[10px] text-blue-300 truncate">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header / Navbar */}
        <header className="h-16 bg-white border-b border-[#E0E2E6] flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1 -ml-1 text-slate-600 hover:bg-[#F3F4F6] rounded-md"
            >
              <Menu size={24} />
            </button>
            <div className="relative w-full max-w-sm hidden sm:block">
              <input type="text" placeholder="Cari NOP, Nama, atau Alamat..." className="w-full bg-[#F3F4F6] border-none rounded-full px-5 py-2 text-sm focus:ring-2 focus:ring-[#3A86FF] outline-none" />
              <Search size={16} className="absolute right-4 top-2.5 opacity-40" />
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Koneksi:</span>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs font-bold text-green-600 uppercase tracking-tighter">Cloud Active</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-[#E0E2E6]"></div>
            <button className="relative p-1 text-slate-600 hover:bg-[#F3F4F6] rounded-full">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
        
        {/* Quick Action Footer */}
        <footer className="h-12 bg-white border-t border-[#E0E2E6] flex items-center px-4 lg:px-8 text-[10px] text-slate-400 font-medium flex-shrink-0">
          <div className="hidden sm:flex gap-6 items-center flex-1">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Mode Survei Aktif</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Terkunci (Lock Service)</span>
          </div>
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            <span>Sync Terakhir: 1 menit yang lalu</span>
            <div className="hidden sm:block w-px h-3 bg-slate-300"></div>
            <span className="text-[#001D3D] font-bold">MY PBB-P2 PERSONAL v1.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
