import { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';

const DEFAULT_CENTER = { lat: -6.938833, lng: 107.574444 }; // Bandung/Cimahi default area

export const useMap = () => {
  const { taxpayers, houses } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);

  const getTaxpayerByHouse = (houseId: string) => {
    return taxpayers.find(t => t.houseId === houseId);
  };

  const mapCenter = useMemo(() => {
    if (selectedHouse) {
      const house = houses.find(h => h.id === selectedHouse);
      if (house) return { lat: house.lat, lng: house.lng };
    }
    
    if (houses.length > 0) {
      const lats = houses.map(h => h.lat);
      const lngs = houses.map(h => h.lng);
      return {
        lat: (Math.min(...lats) + Math.max(...lats)) / 2,
        lng: (Math.min(...lngs) + Math.max(...lngs)) / 2
      };
    }
    return DEFAULT_CENTER;
  }, [selectedHouse, houses]);

  return {
    taxpayers,
    houses,
    searchTerm,
    setSearchTerm,
    selectedHouse,
    setSelectedHouse,
    getTaxpayerByHouse,
    mapCenter
  };
};
