import React from 'react';
import { Badge } from './Badge';
import { TaxStatus } from '../../types';

export const StatusChip = ({ status }: { status: TaxStatus | string }) => {
  switch (status) {
    case 'LUNAS': 
      return <Badge variant="success">LUNAS</Badge>;
    case 'BELUM_LUNAS': 
      return <Badge variant="danger">BELUM LUNAS</Badge>;
    case 'SUDAH_DIKUNJUNGI':
      return <Badge variant="warning">DIKUNJUNGI</Badge>;
    case 'RUMAH_KOSONG':
      return <Badge variant="default">KOSONG</Badge>;
    case 'DATA_BERMASALAH':
      return <Badge variant="default" className="bg-violet-100 text-violet-700">BERMASALAH</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};
