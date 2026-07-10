import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatIDR } from '../lib/utils';
import { Camera, MapPin, Check, QrCode, X } from 'lucide-react';

export default function Collection() {
  const { taxpayers, houses, recordPayment, user, updateTaxpayerData } = useAppContext();
  const [activeNop, setActiveNop] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [isSurveying, setIsSurveying] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For demo, we just pick the first unvisited/unpaid
  const pendingTargets = taxpayers.filter(t => t.status !== 'PAID');
  
  const activeTaxpayer = taxpayers.find(t => t.id === activeNop);
  const activeHouse = houses.find(h => h.id === activeTaxpayer?.houseId);

  const handleNopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveNop(e.target.value);
    setSuccess(false);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNop) return;
    
    const target = taxpayers.find(t => t.id === activeNop);
    if (!target) return;

    recordPayment({
      nop: target.id,
      amount: target.taxAmount,
      collectorId: user.id,
      location: { lat: activeHouse?.lat || 0, lng: activeHouse?.lng || 0 }
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setActiveNop('');
    }, 3000);
  };

  const handleSurveyLokasi = () => {
    if (!activeNop) return;
    setIsSurveying(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateTaxpayerData(
            activeNop, 
            {}, 
            { 
              lat: position.coords.latitude, 
              lng: position.coords.longitude 
            }
          );
          setIsSurveying(false);
          alert('Lokasi berhasil diperbarui menggunakan GPS perangkat!');
        },
        (error) => {
          // Fallback to simulation if failed
          updateTaxpayerData(
            activeNop, 
            {}, 
            { 
              lat: -7.7956 + (Math.random() * 0.002 - 0.001), 
              lng: 110.3695 + (Math.random() * 0.002 - 0.001) 
            }
          );
          setIsSurveying(false);
          alert('Berhasil disimulasikan! (Akses GPS ditolak/gagal)');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setTimeout(() => {
        updateTaxpayerData(
          activeNop, 
          {}, 
          { 
            lat: -7.7956 + (Math.random() * 0.002 - 0.001), 
            lng: 110.3695 + (Math.random() * 0.002 - 0.001) 
          }
        );
        setIsSurveying(false);
        alert('Perangkat tidak mendukung GPS. Menggunakan simulasi.');
      }, 1000);
    }
  };

  const handleFotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeNop) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateTaxpayerData(activeNop, {}, { photoUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    if (!activeNop) return;
    updateTaxpayerData(activeNop, {}, { photoUrl: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#001D3D] tracking-tight">Modul Penagihan Lapangan</h1>
        <p className="text-sm font-medium text-[#64748B] mt-1">Penerimaan pembayaran dan update status rumah.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E0E2E6]">
        <h2 className="text-lg font-bold text-[#001D3D] mb-4">Formulir Penerimaan PBB-P2</h2>
        
        {success ? (
          <div className="bg-green-50 p-6 rounded-2xl border border-green-200 flex flex-col items-center justify-center text-center py-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">Pembayaran Berhasil Dicatat</h3>
            <p className="text-sm font-medium text-green-600">Data telah disinkronisasi ke server (Offline Ready).</p>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Cari Wajib Pajak / NOP</label>
              <div className="flex gap-2">
                <select 
                  className="flex-1 p-3 border border-[#E0E2E6] rounded-xl focus:ring-2 focus:ring-[#3A86FF] focus:border-[#3A86FF] outline-none text-sm shadow-sm"
                  value={activeNop}
                  onChange={handleNopChange}
                  required
                >
                  <option value="">Pilih Target Penagihan...</option>
                  {pendingTargets.map(t => (
                    <option key={t.id} value={t.id}>{t.id} - {t.name}</option>
                  ))}
                </select>
                <button 
                  type="button" 
                  onClick={() => {
                    // Simulate scanning a random pending NOP
                    if (pendingTargets.length > 0) {
                      const randomIdx = Math.floor(Math.random() * pendingTargets.length);
                      setActiveNop(pendingTargets[randomIdx].id);
                      alert('Simulasi scan QR Code berhasil!');
                    } else {
                      alert('Tidak ada target penagihan tersisa.');
                    }
                  }}
                  title="Simulasi Scan QR Code Wajib Pajak"
                  className="p-3 border border-[#E0E2E6] rounded-xl text-slate-600 bg-white hover:bg-slate-50 shadow-sm transition-colors"
                >
                  <QrCode size={20} />
                </button>
              </div>
            </div>

            {activeTaxpayer && (
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E0E2E6] space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-[#E0E2E6]">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Nama</span>
                  <span className="font-bold text-[#001D3D]">{activeTaxpayer.name}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#E0E2E6]">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Alamat</span>
                  <span className="font-medium text-[#1A1C1E] text-right text-sm">{activeTaxpayer.address}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Jumlah Tagihan</span>
                  <span className="text-xl font-black text-red-600">{formatIDR(activeTaxpayer.taxAmount)}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={handleSurveyLokasi}
                disabled={!activeNop || isSurveying}
                className="flex-1 py-3 flex items-center justify-center gap-2 border border-[#E0E2E6] bg-white rounded-xl text-[#001D3D] hover:bg-slate-50 font-bold shadow-sm text-sm transition-colors disabled:opacity-50"
              >
                {isSurveying ? (
                  <div className="animate-spin w-4 h-4 border-2 border-[#3A86FF] border-t-transparent rounded-full" />
                ) : (
                  <MapPin size={16} className="text-[#3A86FF]" />
                )}
                Survey Lokasi
              </button>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button 
                type="button" 
                onClick={handleFotoClick}
                disabled={!activeNop}
                className="flex-1 py-3 flex items-center justify-center gap-2 border border-[#E0E2E6] bg-white rounded-xl text-[#001D3D] hover:bg-slate-50 font-bold shadow-sm text-sm transition-colors disabled:opacity-50"
              >
                <Camera size={16} className="text-[#3A86FF]" />
                Foto Rumah
              </button>
            </div>
            
            {activeHouse?.photoUrl && (
              <div className="relative mt-4">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Foto Rumah (Tersimpan)</p>
                <img src={activeHouse.photoUrl} alt="Foto Rumah" className="w-full h-48 object-cover rounded-xl border border-[#E0E2E6]" />
                <button 
                  type="button"
                  onClick={clearPhoto}
                  className="absolute top-8 right-2 p-1.5 bg-white/80 hover:bg-white text-red-500 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={!activeNop}
              className="w-full py-4 bg-[#3A86FF] hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              Terima Pembayaran Tunai
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
