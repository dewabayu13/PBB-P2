import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap as useLeafletMap, LayersControl } from 'react-leaflet';
import { Search, Navigation, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { formatIDR } from '../utils/format';
import { Input } from '../components/ui/Input';
import { useMap } from '../hooks/useMap';
import { StatusChip } from '../components/ui/StatusChip';

// Custom Map Icons
const createIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative w-8 h-8 flex items-center justify-center">
        <div class="absolute inset-0 bg-${color}-500 rounded-full opacity-20 animate-ping"></div>
        <div class="relative bg-white w-6 h-6 rounded-full border-2 border-${color}-500 shadow-md flex items-center justify-center z-10">
          <div class="w-2 h-2 bg-${color}-500 rounded-full"></div>
        </div>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-${color}-500 rotate-45 z-0"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const ICONS = {
  LUNAS: createIcon('emerald'),
  BELUM_LUNAS: createIcon('rose'),
  SUDAH_DIKUNJUNGI: createIcon('amber'),
  RUMAH_KOSONG: createIcon('slate'),
  DATA_BERMASALAH: createIcon('violet'),
  DEFAULT: createIcon('blue')
};

function MapUpdater({ center }: { center: { lat: number, lng: number } }) {
  const map = useLeafletMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], 18, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export const MapView = () => {
  const navigate = useNavigate();
  const { 
    taxpayers, houses, searchTerm, setSearchTerm, 
    selectedHouse, setSelectedHouse, getTaxpayerByHouse, mapCenter 
  } = useMap();

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="h-[calc(100vh-80px)] lg:h-[calc(100vh-40px)] flex flex-col sm:flex-row gap-4 max-w-7xl mx-auto pb-16 lg:pb-0">
      <div className="w-full sm:w-80 bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3">Peta Wajib Pajak</h2>
          <Input 
            icon={<Search size={16} />} 
            placeholder="Cari NOP atau Nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {taxpayers
            .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.includes(searchTerm))
            .map(t => {
              const h = houses.find(house => house.id === t.houseId);
              if (!h) return null;
              
              const isSelected = selectedHouse === h.id;
              
              return (
                <div 
                  key={t.id}
                  onClick={() => setSelectedHouse(h.id)}
                  className={`p-3 rounded-xl mb-2 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="font-bold text-slate-800 text-sm">{t.name}</div>
                  <div className="text-[10px] font-mono font-bold text-blue-600 mt-0.5">{t.id}</div>
                  <div className="text-[10px] font-bold mt-1 text-slate-500 uppercase flex items-center justify-between">
                    <span>{t.rt}/{t.rw} - {t.hamlet}</span>
                    <StatusChip status={t.status} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
        <MapContainer center={mapCenter} zoom={16} style={{ height: '100%', width: '100%' }}>
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Peta Dasar">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satelit">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          <MapUpdater center={mapCenter} />
          
          {houses.map(house => {
            const taxpayer = getTaxpayerByHouse(house.id);
            if (!taxpayer) return null;
            
            if (searchTerm && !(taxpayer.name.toLowerCase().includes(searchTerm.toLowerCase()) || taxpayer.id.includes(searchTerm))) {
              return null;
            }

            // @ts-ignore
            const icon = ICONS[taxpayer.status] || ICONS.DEFAULT;

            return (
              <Marker 
                key={house.id} 
                position={[house.lat, house.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => setSelectedHouse(house.id)
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <User size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-tight">{taxpayer.name}</h3>
                        <p className="text-[10px] font-mono font-bold text-blue-600">{taxpayer.id}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mt-3 pt-3 border-t border-slate-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-medium">Tagihan</span>
                        <span className="font-bold text-slate-800">{formatIDR(taxpayer.taxAmount)}</span>
                      </div>
                      <div className="flex justify-between text-xs items-center mt-2">
                        <span className="text-slate-500 font-medium">Status</span>
                        <StatusChip status={taxpayer.status} />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => openGoogleMaps(house.lat, house.lng)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                      >
                        <Navigation size={12} /> Rute
                      </button>
                      <button 
                        onClick={() => navigate(`/taxpayers`)}
                        className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
