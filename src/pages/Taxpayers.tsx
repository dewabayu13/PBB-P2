import React, { useState } from 'react';
import { Search, Filter, Edit, MapPin, Upload } from 'lucide-react';
import { formatIDR } from '../utils/format';
import { Taxpayer, TaxStatus, House } from '../types';
import { DataImport } from '../components/DataImport';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusChip } from '../components/ui/StatusChip';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useTaxpayer } from '../hooks/useTaxpayer';

export const Taxpayers = () => {
  const { 
    taxpayers, searchTerm, setSearchTerm, 
    statusFilter, setStatusFilter, updateTaxpayerStatus, updateTaxpayerData 
  } = useTaxpayer();
  
  const [selectedTaxpayer, setSelectedTaxpayer] = useState<Taxpayer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Taxpayer> & { newLat?: string; newLng?: string }>({});

  const handleEditClick = (t: Taxpayer) => {
    setSelectedTaxpayer(t);
    setEditForm({ 
      name: t.name, 
      phone: t.phone, 
      status: t.status,
      newLat: t.lat?.toString() || '',
      newLng: t.lng?.toString() || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedTaxpayer) {
      const tUpdates: Partial<Taxpayer> = {
        name: editForm.name,
        phone: editForm.phone,
        status: editForm.status as TaxStatus,
      };
      
      const hUpdates: Partial<House> = {};
      if (editForm.newLat) {
        tUpdates.lat = parseFloat(editForm.newLat);
        hUpdates.lat = parseFloat(editForm.newLat);
      }
      if (editForm.newLng) {
        tUpdates.lng = parseFloat(editForm.newLng);
        hUpdates.lng = parseFloat(editForm.newLng);
      }

      updateTaxpayerData(selectedTaxpayer.id, tUpdates, hUpdates);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Data Wajib Pajak</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola data SPPT dan status pembayaran</p>
        </div>
        <Button variant="primary" onClick={() => setIsImportModalOpen(true)}>
          <Upload size={18} className="mr-2" />
          Import Data Excel
        </Button>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50">
          <div className="flex-1 max-w-md">
            <Input 
              icon={<Search size={18} />} 
              placeholder="Cari NOP, Nama, atau Alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[160px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Semua Status</option>
              <option value="BELUM_LUNAS">Belum Lunas</option>
              <option value="LUNAS">Lunas</option>
              <option value="SUDAH_DIKUNJUNGI">Sudah Dikunjungi</option>
              <option value="RUMAH_KOSONG">Rumah Kosong</option>
              <option value="DATA_BERMASALAH">Data Bermasalah</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {taxpayers.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-400 uppercase bg-slate-50 font-black tracking-wider">
                <tr>
                  <th className="px-6 py-4 rounded-tl-[32px]">NOP / WP</th>
                  <th className="px-6 py-4">Alamat Objek</th>
                  <th className="px-6 py-4 text-right">Tagihan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {taxpayers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{t.name}</div>
                      <div className="text-slate-500 font-mono text-xs mt-0.5">{t.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">{t.address}</div>
                      <div className="text-slate-400 text-xs mt-0.5">RT {t.rt}/RW {t.rw}, {t.village}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-800">
                      {formatIDR(t.taxAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusChip status={t.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(t)}>
                        <Edit size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState message="Tidak ada data wajib pajak ditemukan." icon={Users} />
          )}
        </div>
      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Data Wajib Pajak"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama WP</label>
            <Input 
              value={editForm.name || ''} 
              onChange={e => setEditForm({...editForm, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">No. HP (Opsional)</label>
            <Input 
              value={editForm.phone || ''} 
              onChange={e => setEditForm({...editForm, phone: e.target.value})}
              placeholder="Contoh: 08123456789"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status SPPT</label>
            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              value={editForm.status || ''}
              onChange={e => setEditForm({...editForm, status: e.target.value as TaxStatus})}
            >
              <option value="BELUM_LUNAS">Belum Lunas</option>
              <option value="LUNAS">Lunas</option>
              <option value="SUDAH_DIKUNJUNGI">Sudah Dikunjungi</option>
              <option value="RUMAH_KOSONG">Rumah Kosong</option>
              <option value="DATA_BERMASALAH">Data Bermasalah</option>
            </select>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              Koordinat Peta
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Latitude</label>
                <Input 
                  value={editForm.newLat || ''} 
                  onChange={e => setEditForm({...editForm, newLat: e.target.value})}
                  placeholder="-6.12345"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Longitude</label>
                <Input 
                  value={editForm.newLng || ''} 
                  onChange={e => setEditForm({...editForm, newLng: e.target.value})}
                  placeholder="106.12345"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleSaveEdit}>Simpan Perubahan</Button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        title="Import Data Excel"
      >
        <DataImport onComplete={() => setIsImportModalOpen(false)} />
      </Modal>
    </div>
  );
};
