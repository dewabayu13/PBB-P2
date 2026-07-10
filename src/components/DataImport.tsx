import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, AlertCircle, ChevronRight, File, Replace, Plus } from 'lucide-react';
import { readFile, processSheetData, SheetPreview, parseDataToEntities } from '../utils/fileParser';
import { useAppContext } from '../contexts/AppContext';

interface DataImportProps {
  onComplete: () => void;
}

export const DataImport = ({ onComplete }: DataImportProps) => {
  const { taxpayers, importTaxpayers, clearDatabase } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [csvData, setCsvData] = useState<Record<string, unknown>[] | null>(null);
  const [sheetsPreview, setSheetsPreview] = useState<SheetPreview[]>([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState<number>(0);
  
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [isImporting, setIsImporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const existingNops = new Set(taxpayers.map(t => t.id));

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsParsing(true);
    setError(null);
    setSheetsPreview([]);

    try {
      const result = await readFile(selectedFile);
      if (result.isCsv && result.csvData) {
        setCsvData(result.csvData);
        const preview = processSheetData(result.csvData, 'CSV Data', existingNops);
        setSheetsPreview([preview]);
      } else if (result.workbook) {
        setWorkbook(result.workbook);
        const previews: SheetPreview[] = [];
        for (const sheetName of result.workbook.SheetNames) {
          const sheet = result.workbook.Sheets[sheetName];
          const rawData = XLSX.utils.sheet_to_json(sheet);
          if (rawData.length > 0) {
            previews.push(processSheetData(rawData, sheetName, existingNops));
          }
        }
        if (previews.length === 0) throw new Error('Tidak ada data yang valid ditemukan di dalam file.');
        setSheetsPreview(previews);
      }
    } catch (err: Error | unknown) {
      setError(err.message || 'Gagal membaca file');
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    if (sheetsPreview.length === 0) return;
    setIsImporting(true);
    
    try {
      const dataToImport = sheetsPreview[selectedSheetIndex].data;
      const parsedData = parseDataToEntities(dataToImport);
      
      if (importMode === 'replace') {
        await clearDatabase();
      }
      
      await importTaxpayers(parsedData.taxpayers, parsedData.houses);
      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (err: Error | unknown) {
      setError('Gagal mengimport data: ' + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const selectedPreview = sheetsPreview[selectedSheetIndex];

  return (
    <div>
      {success ? (
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Import Berhasil!</h3>
          <p className="text-slate-500 font-medium text-sm">Data SPPT telah berhasil ditambahkan ke database.</p>
        </div>
      ) : (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />

          {!file && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-[24px] p-12 text-center hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                <FileSpreadsheet size={24} />
              </div>
              <p className="text-sm font-bold text-slate-700">Klik untuk memilih file</p>
              <p className="text-xs text-slate-500 mt-1">Mendukung format Excel (.xlsx) & CSV</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 p-4 mb-4 text-red-700 bg-red-50 rounded-xl">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          {isParsing && (
            <div className="flex items-center justify-center gap-3 py-10 text-sm font-medium text-slate-600">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              Memproses file...
            </div>
          )}

          {sheetsPreview.length > 0 && !error && (
            <div className="space-y-6">
              {workbook && sheetsPreview.length > 1 && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Worksheet</label>
                  <div className="flex flex-wrap gap-2">
                    {sheetsPreview.map((sheet, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSheetIndex(idx)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedSheetIndex === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <File size={14} className="inline-block mr-2" />
                        {sheet.sheetName} ({sheet.totalSppt})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-lg font-black text-slate-900">{selectedPreview.totalSppt}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Total SPPT</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-lg font-black text-blue-600">{(selectedPreview.totalTax / 1000000).toFixed(1)}M</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Total Tagihan</p>
                  </div>
                </div>
                {(selectedPreview.duplicateCount > 0 || selectedPreview.emptyNameCount > 0) && (
                  <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs font-medium flex gap-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <p>Terdapat data duplikat atau tidak lengkap.</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mode Import</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setImportMode('append')}
                    className={`flex items-start p-3 rounded-xl border text-left transition-colors ${
                      importMode === 'append' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${importMode === 'append' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Plus size={16} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${importMode === 'append' ? 'text-slate-900' : 'text-slate-700'}`}>Tambah Data</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Gabung dengan data lama</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setImportMode('replace')}
                    className={`flex items-start p-3 rounded-xl border text-left transition-colors ${
                      importMode === 'replace' ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${importMode === 'replace' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Replace size={16} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${importMode === 'replace' ? 'text-rose-700' : 'text-slate-700'}`}>Ganti Total</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Hapus data lama</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => { setFile(null); setSheetsPreview([]); }}
                  className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Ubah File
                </button>
                <button
                  onClick={handleImport}
                  disabled={isImporting || selectedPreview.totalSppt === 0}
                  className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isImporting ? 'Menyimpan...' : 'Mulai Import'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
