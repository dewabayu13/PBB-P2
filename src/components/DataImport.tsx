import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseFile, ParsedData } from '../lib/fileParser';
import { useAppContext } from '../context/AppContext';

interface DataImportProps {
  onClose: () => void;
}

export default function DataImport({ onClose }: DataImportProps) {
  const { importTaxpayers } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setParsedData(null);
    setIsParsing(true);

    try {
      const data = await parseFile(selectedFile);
      setParsedData(data);
      if (data.taxpayers.length === 0) {
        setError("Tidak ada data valid yang ditemukan dalam file.");
      }
    } catch (err: any) {
      setError(err.message || "Gagal memproses file. Pastikan formatnya benar (CSV/XLSX).");
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    if (!parsedData || parsedData.taxpayers.length === 0) return;
    
    setIsImporting(true);
    
    // Simulate slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    importTaxpayers(parsedData.taxpayers, parsedData.houses);
    
    setIsImporting(false);
    setSuccess(true);
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white border shadow-2xl rounded-3xl border-slate-200 overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#001D3D]">Import Data Wajib Pajak</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">Format: CSV, XLS, XLSX</p>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Import Berhasil!</h3>
              <p className="text-sm text-slate-500 mt-2">Data wajib pajak dan koordinat telah ditambahkan.</p>
            </div>
          ) : (
            <>
              <div 
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  file ? 'border-[#3A86FF] bg-blue-50/50' : 'border-slate-300 hover:border-[#3A86FF] hover:bg-slate-50'
                }`}
              >
                <input 
                  type="file" 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  file ? 'bg-[#3A86FF] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <FileSpreadsheet size={24} />
                </div>
                
                {file ? (
                  <>
                    <p className="text-sm font-bold text-[#001D3D]">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-slate-700">Pilih atau letakkan file di sini</p>
                    <p className="text-xs text-slate-500 mt-1">Mendukung format Excel & CSV</p>
                  </>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 mt-4 text-red-700 bg-red-50 rounded-xl">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p className="text-xs font-medium leading-relaxed">{error}</p>
                </div>
              )}

              {isParsing && (
                <div className="flex items-center justify-center gap-3 p-4 mt-4 text-sm font-medium text-slate-600">
                  <div className="w-4 h-4 border-2 border-[#3A86FF] border-t-transparent rounded-full animate-spin"></div>
                  Memproses file...
                </div>
              )}

              {parsedData && !error && (
                <div className="p-4 mt-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Ringkasan Data</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <p className="text-2xl font-black text-[#001D3D]">{parsedData.taxpayers.length}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Wajib Pajak</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <p className="text-2xl font-black text-[#3A86FF]">{parsedData.houses.length}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Koordinat Ditemukan</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleImport}
                  disabled={!parsedData || parsedData.taxpayers.length === 0 || isImporting}
                  className="flex-1 py-3 text-sm font-bold text-white bg-[#3A86FF] rounded-xl hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isImporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Import Data
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
