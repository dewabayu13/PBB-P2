import React from 'react';

export const EmptyState = ({ message = 'Tidak ada data ditemukan.', icon: Icon }: { message?: string, icon?: React.ElementType }) => (
  <div className="p-12 text-center flex flex-col items-center text-slate-400 font-medium">
    {Icon && <Icon size={48} className="mb-4 text-slate-200" />}
    {message}
  </div>
);
