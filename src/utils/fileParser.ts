import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Taxpayer, House } from '../types';

export interface ParsedData {
  taxpayers: Taxpayer[];
  houses: House[];
}

export interface SheetPreview {
  sheetName: string;
  totalSppt: number;
  totalTax: number;
  totalLandArea: number;
  totalBuildingArea: number;
  duplicateCount: number;
  emptyNameCount: number;
  emptyAddressCount: number;
  data: Record<string, unknown>[];
}

export const readFile = async (file: File): Promise<{isCsv: boolean, workbook?: XLSX.WorkBook, csvData?: Record<string, unknown>[]}> => {
  return new Promise((resolve, reject) => {
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    if (isCsv) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve({ isCsv: true, csvData: results.data });
        },
        error: (error: Error | unknown) => reject(error),
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          resolve({ isCsv: false, workbook });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    }
  });
}

export const processSheetData = (data: Record<string, unknown>[], existingNops: Set<string> = new Set()): SheetPreview => {
  let totalSppt = 0;
  let totalTax = 0;
  let totalLandArea = 0;
  let totalBuildingArea = 0;
  let duplicateCount = 0;
  let emptyNameCount = 0;
  let emptyAddressCount = 0;

  const localNops = new Set<string>();

  data.forEach((row) => {
    const id = getValue(row, ['NOP', 'ID', 'NOPOBJEKPAJAK', 'NOMOROBJEKPAJAK']);
    if (!id) return;
    
    totalSppt++;
    
    if (localNops.has(id) || existingNops.has(id)) {
      duplicateCount++;
    }
    localNops.add(id);

    const name = getValue(row, ['NAMA', 'NAMASPPT', 'NAMAWP', 'NAME'], ['WAJIBPAJAK']);
    if (!name || String(name).trim() === '') emptyNameCount++;

    const address = getValue(row, ['ALAMAT', 'ALAMATOP', 'LETAKOP', 'ADDRESS']);
    if (!address || String(address).trim() === '') emptyAddressCount++;

    let rawNominal = getValue(row, ['TAGIHAN', 'NOMINAL', 'PBB', 'PAJAK', 'TAXAMOUNT', 'KETETAPAN'], ['BAYAR']);
    if (typeof rawNominal === 'string') rawNominal = rawNominal.replace(/[^0-9]/g, '');
    totalTax += (parseFloat(rawNominal) || 0);

    let rawLuas = getValue(row, ['LUASBUMI', 'LUASTANAH', 'BUMI', 'LANDAREA'], ['LUAS']);
    if (typeof rawLuas === 'string') rawLuas = rawLuas.replace(/[^0-9]/g, '');
    totalLandArea += (parseFloat(rawLuas) || 0);

    let rawBangunan = getValue(row, ['LUASBNG', 'LUASBANGUNAN', 'BANGUNAN', 'BUILDINGAREA']);
    if (typeof rawBangunan === 'string') rawBangunan = rawBangunan.replace(/[^0-9]/g, '');
    totalBuildingArea += (parseFloat(rawBangunan) || 0);
  });

  return {
    sheetName: '',
    totalSppt,
    totalTax,
    totalLandArea,
    totalBuildingArea,
    duplicateCount,
    emptyNameCount,
    emptyAddressCount,
    data
  };
};

export const parseDataToEntities = (data: Record<string, unknown>[]): ParsedData => {
  const taxpayers: Taxpayer[] = [];
  const houses: House[] = [];

  data.forEach((row) => {
    let id = getValue(row, ['NOP', 'ID', 'NOPOBJEKPAJAK', 'NOMOROBJEKPAJAK']);
    id = (id || '').toString().trim();
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
      status: (getValue(row, ['STATUS', 'KET']) || 'BELUM_LUNAS').toString().toUpperCase() as any,
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

const getValue = (row: Record<string, unknown>, primary: string[], secondary: string[] = []) => {
  for (const key in row) {
    const cleanKey = key.toUpperCase().replace(/[^A-Z0-9]/g, '');
    for (const kw of primary) {
      if (cleanKey === kw.toUpperCase().replace(/[^A-Z0-9]/g, '')) return row[key];
    }
  }
  for (const key in row) {
    const cleanKey = key.toUpperCase().replace(/[^A-Z0-9]/g, '');
    for (const kw of [...primary, ...secondary]) {
      if (cleanKey.includes(kw.toUpperCase().replace(/[^A-Z0-9]/g, ''))) return row[key];
    }
  }
  return undefined;
};
