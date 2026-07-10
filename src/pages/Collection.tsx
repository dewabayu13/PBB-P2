import React, { useState, useEffect } from 'react';
import { Search, QrCode, CheckCircle2, User, MapPin } from 'lucide-react';
import { formatIDR } from '../utils/format';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { usePayment } from '../hooks/usePayment';

export const Collection = () => {
  const { 
    searchTerm, setSearchTerm, scanMode, setScanMode,
    paymentAmount, setPaymentAmount, searchResult, recordPayment, user
  } = usePayment();
  
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchResult) {
      setPaymentAmount(searchResult.taxAmount.toString());
    }
  }, [searchResult, setPaymentAmount]);

  const handlePayment = async () => {
    if (searchResult) {
      await recordPayment({
        nop: searchResult.id,
        amount: Number(paymentAmount),
        collectorId: user.id
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSearchTerm('');
        setPaymentAmount('');
      }, 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Penerimaan PBB-P2</h1>
        <p className="text-slate-500 font-medium mt-1">Cari NOP atau gunakan scanner QR Code</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8">
          <div className="flex gap-3 mb-8">
            <div className="flex-1 relative">
              <Input 
                icon={<Search size={18} />} 
                placeholder="Masukkan NOP atau Nama WP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 text-lg"
              />
            </div>
            <Button 
              variant={scanMode ? 'primary' : 'secondary'} 
              size="icon" 
              className="w-12 h-12"
              onClick={() => setScanMode(!scanMode)}
            >
              <QrCode size={20} />
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {scanMode && !searchResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-900 rounded-3xl p-8 text-center aspect-video flex flex-col items-center justify-center border-4 border-slate-800 border-dashed"
              >
                <QrCode size={48} className="text-blue-500 mb-4 animate-pulse" />
                <p className="text-slate-400 font-medium">Arahkan kamera ke QR Code pada SPPT</p>
              </motion.div>
            )}

            {searchResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-6"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                    <User size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{searchResult.name}</h3>
                    <p className="text-blue-600 font-mono font-bold">{searchResult.id}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500 font-medium">
                      <MapPin size={14} />
                      {searchResult.address}, RT {searchResult.rt}/RW {searchResult.rw}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Tagihan</p>
                  <p className="text-3xl font-black text-slate-900 mb-4">{formatIDR(searchResult.taxAmount)}</p>
                  
                  {searchResult.status === 'LUNAS' ? (
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl text-sm font-bold">
                      <CheckCircle2 size={18} /> SPPT ini sudah LUNAS
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jumlah Pembayaran</label>
                      <Input 
                        type="number" 
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="text-lg font-bold"
                      />
                    </div>
                  )}
                </div>

                {searchResult.status !== 'LUNAS' && (
                  <Button 
                    variant="primary" 
                    className="w-full py-4 text-base"
                    onClick={handlePayment}
                  >
                    Proses Pembayaran
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
          >
            <div className="bg-white rounded-[32px] shadow-2xl p-8 text-center max-w-sm w-full">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Berhasil!</h3>
              <p className="text-slate-500 font-medium">Pembayaran berhasil dicatat untuk NOP {searchResult?.id}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
