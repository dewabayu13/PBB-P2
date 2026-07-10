import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppContext } from '../context/AppContext';
import { VILLAGE_CENTER } from '../data/mock';
import { MapPin, Search, Filter, Home, Map as MapIcon, X } from 'lucide-react';
import { cn, formatIDR } from '../lib/utils';

export default function MapView() {
  const { houses, taxpayers } = useAppContext();
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSatelliteMode, setIsSatelliteMode] = useState(false);

  const mappedData = useMemo(() => {
    return houses.map(house => {
      const taxpayer = taxpayers.find(t => t.houseId === house.id);
      return { ...house, taxpayer };
    });
  }, [houses, taxpayers]);

  const getPinBackground = (status?: string) => {
    switch (status) {
      case 'PAID': return '#22c55e'; // green-500
      case 'UNPAID': return '#ef4444'; // red-500
      case 'NOT_VISITED': return '#f59e0b'; // yellow
      case 'EMPTY': return '#3b82f6'; // blue-500
      default: return '#94a3b8'; // gray (invalid/unknown)
    }
  };

  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  const selectedData = mappedData.find(d => d.id === selectedHouseId);

  return (
    <div className="h-full w-full relative flex flex-col rounded-3xl overflow-hidden border border-[#E0E2E6] shadow-sm bg-white">
      {/* Search & Filter Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex gap-2 max-w-xl mx-auto pointer-events-none">
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-[#E0E2E6] flex items-center px-4 pointer-events-auto transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-[#3A86FF]">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari NOP, Nama, ID Rumah..." 
            className="w-full py-3 px-3 bg-transparent focus:outline-none text-sm font-medium text-[#001D3D] placeholder-slate-400"
          />
        </div>
        <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-md border border-[#E0E2E6] text-slate-600 hover:bg-slate-50 pointer-events-auto transition-all hover:shadow-lg">
          <Filter size={20} />
        </button>
        <button 
          onClick={() => setIsSatelliteMode(!isSatelliteMode)}
          className={cn(
            "p-3 rounded-full shadow-md border pointer-events-auto transition-all hover:shadow-lg flex items-center justify-center backdrop-blur-sm",
            isSatelliteMode ? "bg-[#3A86FF] text-white border-transparent" : "bg-white/90 border-[#E0E2E6] text-slate-600 hover:bg-slate-50"
          )}
          title="Toggle Satellite View"
        >
          <MapIcon size={20} />
        </button>
      </div>

      {/* Legend Overlay */}
      <div className="absolute top-20 left-4 z-[400] flex gap-2 pointer-events-none hidden sm:flex">
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-[#E0E2E6] flex items-center gap-2 pointer-events-auto">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#001D3D]">Lunas</span>
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-[#E0E2E6] flex items-center gap-2 pointer-events-auto">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#001D3D]">Tertunggak</span>
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-[#E0E2E6] flex items-center gap-2 pointer-events-auto">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#001D3D]">Kosong</span>
        </div>
      </div>

      {/* Detail Panel Overlay */}
      {selectedData && !isDetailOpen && (
        <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:bottom-6 sm:w-80 z-[400] pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-blue-200 shadow-xl p-4 pointer-events-auto relative">
            <button 
              onClick={() => setSelectedHouseId(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
            
            <div className="h-24 w-full bg-slate-200 rounded-xl mb-3 flex items-center justify-center border border-slate-300 overflow-hidden relative group">
              {selectedData.photoUrl ? (
                <img src={selectedData.photoUrl} alt="Foto Rumah" className="w-full h-full object-cover" />
              ) : (
                <Home size={32} className="text-slate-400" />
              )}
              {!selectedData.photoUrl && (
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                  <span className="text-white text-xs font-bold">Belum ada foto</span>
                </div>
              )}
            </div>

            <p className="text-[10px] font-bold text-[#3A86FF] tracking-tight uppercase">ID: {selectedData.id}</p>
            <h3 className="text-sm font-bold text-[#001D3D] truncate mt-0.5">
              {selectedData.taxpayer?.name || 'Rumah Kosong'}
            </h3>
            <p className="text-[11px] text-[#64748B] mt-1 font-medium truncate">{selectedData.taxpayer?.address || 'Alamat tidak diketahui'}</p>
            
            <div className="mt-3 pt-3 border-t border-[#E0E2E6] flex justify-between items-center">
              <span className="text-xs font-black text-red-600">
                {selectedData.taxpayer?.status !== 'PAID' ? formatIDR(selectedData.taxpayer?.taxAmount || 0) : 'LUNAS'}
              </span>
              <button 
                onClick={() => setIsDetailOpen(true)}
                className="px-3 py-1.5 bg-[#3A86FF] hover:bg-blue-600 text-[10px] text-white rounded-lg font-bold tracking-widest uppercase transition-colors shadow-sm"
              >
                DETAIL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Detail Modal Overlay */}
      {selectedData && isDetailOpen && (
        <div className="absolute inset-0 z-[500] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-[#E0E2E6] flex flex-col max-h-full">
            <div className="p-4 border-b border-[#E0E2E6] flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-[#001D3D]">Detail Wajib Pajak</h2>
                <p className="text-[11px] font-bold text-[#3A86FF] uppercase tracking-wider">{selectedData.id}</p>
              </div>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
              {/* Photo Area (Portrait Ratio) */}
              <div className="w-full aspect-[3/4] bg-slate-100 rounded-2xl mb-4 border border-[#E0E2E6] overflow-hidden flex items-center justify-center relative">
                {selectedData.photoUrl ? (
                  <img src={selectedData.photoUrl} alt="Foto Rumah" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center flex flex-col items-center p-4">
                    <Home size={48} className="text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Belum ada foto lokasi</p>
                  </div>
                )}
              </div>

              {/* Details Info */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Nama Wajib Pajak</span>
                  <p className="text-sm font-bold text-[#001D3D]">{selectedData.taxpayer?.name || '-'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Alamat Lengkap</span>
                  <p className="text-sm font-medium text-[#1A1C1E]">{selectedData.taxpayer?.address || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Luas Bumi</span>
                    <p className="text-sm font-bold text-[#001D3D]">{selectedData.taxpayer?.landArea || 0} m²</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Luas Bangunan</span>
                    <p className="text-sm font-bold text-[#001D3D]">{selectedData.taxpayer?.buildingArea || 0} m²</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#E0E2E6]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Total Tagihan</span>
                  <p className={cn(
                    "text-xl font-black mt-1",
                    selectedData.taxpayer?.status === 'PAID' ? "text-green-600" : "text-red-600"
                  )}>
                    {selectedData.taxpayer?.status === 'PAID' ? 'LUNAS' : formatIDR(selectedData.taxpayer?.taxAmount || 0)}
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Map Content */}
      <div className="flex-1 w-full h-full relative z-0">
        <MapContainer 
          center={[VILLAGE_CENTER.lat, VILLAGE_CENTER.lng]} 
          zoom={16} 
          zoomControl={false}
          className="w-full h-full"
        >
          {isSatelliteMode ? (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          ) : (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          )}
          {mappedData.map(data => (
            <Marker 
              key={data.id}
              position={[data.lat, data.lng]}
              icon={createCustomIcon(getPinBackground(data.taxpayer?.status))}
              eventHandlers={{
                click: () => {
                  setSelectedHouseId(data.id);
                  setIsDetailOpen(false);
                },
              }}
            />
          ))}
        </MapContainer>
      </div>

      <div className="h-12 bg-[#F8FAFC] border-t border-[#E0E2E6] flex items-center px-4 justify-between z-10">
        <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider hidden sm:block">📍 Dusun Karanglo, Kec. Sukamaju - Wilayah IV</p>
        <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider sm:hidden">📍 Wilayah IV</p>
        <div className="flex items-center gap-4">
          <button className="text-[10px] font-bold text-[#3A86FF] hover:text-blue-700 uppercase tracking-wider">Optimasi Rute Penagihan</button>
        </div>
      </div>
    </div>
  );
}

