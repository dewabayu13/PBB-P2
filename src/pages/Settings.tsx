import React, { useState } from 'react';
import { Database, Download, Upload, AlertTriangle, Shield, HardDrive, Trash2 } from 'lucide-react';
import { exportDatabase, importDatabase } from '../utils/dbUtils';
import { useAppContext } from '../contexts/AppContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const Settings = () => {
  const { clearDatabase } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportDatabase();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Gagal mengekspor data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (!window.confirm('PERINGATAN: Mengimport backup akan MENIMPA semua data yang ada saat ini. Anda yakin ingin melanjutkan?')) {
          return;
        }
        
        try {
          setIsImporting(true);
          await importDatabase(file);
          alert('Data berhasil diimport. Aplikasi akan dimuat ulang.');
          window.location.reload();
        } catch (error) {
          console.error('Import failed:', error);
          alert('Gagal mengimport data. Pastikan file backup valid.');
        } finally {
          setIsImporting(false);
        }
      }
    };
    input.click();
  };

  const handleClearDatabase = async () => {
    try {
      setIsClearing(true);
      await clearDatabase();
      setIsClearModalOpen(false);
      alert('Database berhasil dibersihkan');
      window.location.reload();
    } catch (error) {
      console.error('Clear DB failed:', error);
      alert('Gagal membersihkan database');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pengaturan Sistem</h1>
        <p className="text-slate-500 font-medium mt-1">Kelola preferensi dan manajemen database</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Manajemen Database</h2>
            <p className="text-slate-500 text-sm font-medium">Backup dan restore data aplikasi</p>
          </div>
        </div>
        
        <div className="p-8 space-y-6 text-sm text-slate-600">
          <div className="flex flex-col sm:flex-row gap-6 p-6 border border-slate-200 rounded-[24px] hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Download size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-800 mb-1">Backup Data (Export)</h3>
              <p className="mb-4">Unduh seluruh data aplikasi (Wajib Pajak, Rumah, Transaksi) dalam format JSON untuk cadangan.</p>
              <Button 
                variant="outline" 
                onClick={handleExport} 
                disabled={isExporting}
                isLoading={isExporting}
              >
                Buat File Backup
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 p-6 border border-slate-200 rounded-[24px] hover:border-amber-300 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-800 mb-1">Restore Data (Import)</h3>
              <p className="mb-4 text-amber-600/80 font-medium">Peringatan: Proses ini akan menimpa seluruh data yang ada saat ini dengan data dari file backup.</p>
              <Button 
                variant="outline" 
                onClick={handleImportClick}
                disabled={isImporting}
                isLoading={isImporting}
              >
                Pilih File Backup
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-rose-100 overflow-hidden">
        <div className="p-8 border-b border-rose-50 flex items-center gap-4 bg-rose-50/50">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-rose-800 tracking-tight">Zona Berbahaya</h2>
            <p className="text-rose-500/80 text-sm font-medium">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Hapus Semua Data</h3>
              <p className="text-sm text-slate-500 font-medium">Menghapus seluruh database dan mereset aplikasi ke kondisi awal.</p>
            </div>
            <Button variant="danger" onClick={() => setIsClearModalOpen(true)}>
              <Trash2 size={18} className="mr-2" />
              Reset Database
            </Button>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isClearModalOpen} 
        onClose={() => !isClearing && setIsClearModalOpen(false)} 
        title="Konfirmasi Penghapusan"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Peringatan Bahaya</h3>
          <p className="text-slate-600 mb-8 font-medium">
            Anda akan menghapus <span className="font-bold text-rose-600">seluruh data aplikasi</span>. 
            Tindakan ini permanen dan tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setIsClearModalOpen(false)} disabled={isClearing}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleClearDatabase} isLoading={isClearing}>
              Ya, Hapus Semua Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
