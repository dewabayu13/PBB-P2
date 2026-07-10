import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatIDR } from '../lib/utils';
import { Search, Filter, MoreVertical, MapPin, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Taxpayer, House } from '../types';
import DataImport from '../components/DataImport';

export default function Taxpayers() {
  const { taxpayers, houses, updateTaxpayerData } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTaxpayerId, setEditingTaxpayerId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = taxpayers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.id.includes(searchTerm)
  );

  const editingTaxpayer = taxpayers.find(t => t.id === editingTaxpayerId);
  const editingHouse = houses.find(h => h.id === editingTaxpayer?.houseId);

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTaxpayerId) return;

    const formData = new FormData(e.currentTarget);
    
    updateTaxpayerData(
      editingTaxpayerId,
      {
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        taxAmount: Number(formData.get('taxAmount')),
      },
      {
        lat: Number(formData.get('lat')),
        lng: Number(formData.get('lng')),
      }
    );

    setEditingTaxpayerId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID': 
        return <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">Lunas</span>;
      case 'UNPAID': 
        return <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">Tertunggak</span>;
      case 'NOT_VISITED': 
        return <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">Belum Dikunjungi</span>;
      case 'EMPTY': 
        return <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">Rumah Kosong</span>;
      default: 
        return <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">Invalid</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#001D3D] tracking-tight">Database Wajib Pajak</h1>
          <p className="text-sm font-medium text-[#64748B] mt-1">Kelola data SPPT dan status pembayaran warga.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E0E2E6] rounded-full bg-white text-[#3A86FF] font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">Import Data</span>
          </button>
          <div className="relative flex-1 sm:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari NOP / Nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#E0E2E6] rounded-full bg-white focus:ring-2 focus:ring-[#3A86FF] focus:border-[#3A86FF] outline-none text-sm transition-shadow shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center p-2 border border-[#E0E2E6] rounded-full bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E0E2E6] rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] text-[10px] uppercase font-bold text-[#64748B]">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">NOP & Wajib Pajak</th>
                <th className="px-6 py-4">Alamat Objek Pajak</th>
                <th className="px-6 py-4">Tagihan (Rp)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5] text-xs">
              {filtered.map((taxpayer) => (
                <tr key={taxpayer.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#001D3D]">{taxpayer.name}</div>
                    <div className="text-[10px] font-bold text-[#3A86FF] mt-0.5 tracking-tight">{taxpayer.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#1A1C1E]">{taxpayer.address}</div>
                    <div className="text-[10px] text-[#64748B] mt-0.5">
                      RT {taxpayer.rt}/RW {taxpayer.rw}, {taxpayer.hamlet}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#001D3D]">
                    {formatIDR(taxpayer.taxAmount)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(taxpayer.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate('/map')}
                        title="Lihat di Peta"
                        className="p-1.5 text-slate-400 hover:text-[#3A86FF] hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <MapPin size={18} />
                      </button>
                      <button 
                        onClick={() => setEditingTaxpayerId(taxpayer.id)}
                        title="Edit Data"
                        className="p-1.5 text-slate-400 hover:text-[#3A86FF] hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[#E0E2E6] bg-[#F8FAFC] text-[10px] font-bold text-[#64748B] flex justify-between items-center">
          <span>MENAMPILKAN {filtered.length} WAJIB PAJAK</span>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTaxpayer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#E0E2E6]">
            <div className="p-6 border-b border-[#E0E2E6] flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-[#001D3D]">Edit Wajib Pajak</h2>
                <p className="text-xs font-medium text-[#64748B] mt-1">{editingTaxpayer.id}</p>
              </div>
              <button 
                onClick={() => setEditingTaxpayerId(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Nama Wajib Pajak</label>
                <input 
                  type="text" 
                  name="name"
                  defaultValue={editingTaxpayer.name}
                  required
                  className="w-full px-4 py-2.5 border border-[#E0E2E6] rounded-xl focus:ring-2 focus:ring-[#3A86FF] focus:border-[#3A86FF] outline-none text-sm font-medium text-[#001D3D]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Alamat</label>
                <textarea 
                  name="address"
                  defaultValue={editingTaxpayer.address}
                  required
                  rows={2}
                  className="w-full px-4 py-2.5 border border-[#E0E2E6] rounded-xl focus:ring-2 focus:ring-[#3A86FF] focus:border-[#3A86FF] outline-none text-sm font-medium text-[#001D3D]"
                ></textarea>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Tagihan (Rp)</label>
                <input 
                  type="number" 
                  name="taxAmount"
                  defaultValue={editingTaxpayer.taxAmount}
                  required
                  className="w-full px-4 py-2.5 border border-[#E0E2E6] rounded-xl focus:ring-2 focus:ring-[#3A86FF] focus:border-[#3A86FF] outline-none text-sm font-medium text-[#001D3D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Latitude</label>
                  <input 
                    type="number" 
                    name="lat"
                    step="any"
                    defaultValue={editingHouse?.lat}
                    required
                    className="w-full px-4 py-2.5 border border-[#E0E2E6] rounded-xl focus:ring-2 focus:ring-[#3A86FF] focus:border-[#3A86FF] outline-none text-sm font-medium text-[#001D3D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Longitude</label>
                  <input 
                    type="number" 
                    name="lng"
                    step="any"
                    defaultValue={editingHouse?.lng}
                    required
                    className="w-full px-4 py-2.5 border border-[#E0E2E6] rounded-xl focus:ring-2 focus:ring-[#3A86FF] focus:border-[#3A86FF] outline-none text-sm font-medium text-[#001D3D]"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingTaxpayerId(null)}
                  className="flex-1 py-3 border border-[#E0E2E6] rounded-xl text-[#001D3D] font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#3A86FF] hover:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isImportModalOpen && (
        <DataImport onClose={() => setIsImportModalOpen(false)} />
      )}
    </div>
  );
}
