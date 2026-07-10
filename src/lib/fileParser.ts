import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Taxpayer, House } from '../types';

export interface ParsedData {
  taxpayers: Taxpayer[];
  houses: House[];
}

export const parseFile = async (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const isCsv = file.name.toLowerCase().endsWith('.csv');

    if (isCsv) {
      // Use papaparse for CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            resolve(processRawData(results.data as any[]));
          } catch (error) {
            reject(error);
          }
        },
        error: (error: any) => reject(error),
      });
    } else {
      // Use xlsx for Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve(processRawData(json as any[]));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    }
  });
};

const processRawData = (data: any[]): ParsedData => {
  const taxpayers: Taxpayer[] = [];
  const houses: House[] = [];

  const getValue = (row: any, primary: string[], secondary: string[] = []) => {
    // Exact clean match
    for (const key in row) {
      const cleanKey = key.toUpperCase().replace(/[^A-Z0-9]/g, '');
      for (const kw of primary) {
        if (cleanKey === kw.toUpperCase().replace(/[^A-Z0-9]/g, '')) return row[key];
      }
    }
    // Partial match
    for (const key in row) {
      const cleanKey = key.toUpperCase().replace(/[^A-Z0-9]/g, '');
      for (const kw of [...primary, ...secondary]) {
        if (cleanKey.includes(kw.toUpperCase().replace(/[^A-Z0-9]/g, ''))) return row[key];
      }
    }
    return undefined;
  };

  data.forEach((row, index) => {
    let id = getValue(row, ['NOP', 'ID', 'NOPOBJEKPAJAK', 'NOMOROBJEKPAJAK']);
    id = (id || `NOP-AUTO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`).toString().trim();
    if (!id) return;

    const houseId = `H-${id}`;

    let rawNominal = getValue(row, ['TAGIHAN', 'NOMINAL', 'PBB', 'PAJAK', 'TAXAMOUNT', 'KETETAPAN'], ['BAYAR']);
    if (typeof rawNominal === 'string') rawNominal = rawNominal.replace(/[^0-9]/g, '');
    
    let rawLuas = getValue(row, ['LUASBUMI', 'LUASTANAH', 'BUMI', 'LANDAREA'], ['LUAS']);
    if (typeof rawLuas === 'string') rawLuas = rawLuas.replace(/[^0-9]/g, '');

    let rawBangunan = getValue(row, ['LUASBNG', 'LUASBANGUNAN', 'BANGUNAN', 'BUILDINGAREA']);
    if (typeof rawBangunan === 'string') rawBangunan = rawBangunan.replace(/[^0-9]/g, '');

    taxpayers.push({
      id,
      name: (getValue(row, ['NAMA', 'NAMASPPT', 'NAMAWP', 'NAME'], ['WAJIBPAJAK']) || 'Unknown').toString(),
      address: (getValue(row, ['ALAMAT', 'ALAMATOP', 'LETAKOP', 'ADDRESS']) || 'Sesuai SPPT').toString(),
      village: (getValue(row, ['DESA', 'KELURAHAN', 'VILLAGE']) || 'Sukamaju').toString(),
      hamlet: (getValue(row, ['DUSUN', 'HAMLET']) || 'Karanglo').toString(),
      rt: (getValue(row, ['RT']) || '01').toString(),
      rw: (getValue(row, ['RW']) || '01').toString(),
      block: (getValue(row, ['BLOK', 'BLOCK']) || 'A').toString(),
      landArea: parseFloat(rawLuas) || 0,
      buildingArea: parseFloat(rawBangunan) || 0,
      taxAmount: parseFloat(rawNominal) || 0,
      phone: (getValue(row, ['TELP', 'TELEPON', 'NOHP', 'PHONE']) || '-').toString(),
      status: (getValue(row, ['STATUS', 'KET']) || 'NOT_VISITED').toString().toUpperCase() as any,
      houseId,
    });

    const lat = parseFloat(getValue(row, ['LAT', 'LATITUDE']));
    const lng = parseFloat(getValue(row, ['LNG', 'LONGITUDE', 'LONG', 'LON']));

    if (!isNaN(lat) && !isNaN(lng)) {
      houses.push({
        id: houseId,
        lat,
        lng,
      });
    } else {
      // Default to slightly random coordinates around center if no coordinates exist
      const latOffset = (Math.random() - 0.5) * 0.005;
      const lngOffset = (Math.random() - 0.5) * 0.005;
      houses.push({
        id: houseId,
        lat: -7.801 + latOffset,
        lng: 110.364 + lngOffset,
      });
    }
  });

  return { taxpayers, houses };
};
