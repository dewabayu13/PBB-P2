import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

export const useImport = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return {
    isImportModalOpen,
    setIsImportModalOpen,
  };
};
