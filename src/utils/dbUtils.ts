import { db } from '../database/db';

export const exportDatabase = async () => {
  const taxpayers = await db.taxpayers.toArray();
  const houses = await db.houses.toArray();
  const payments = await db.payments.toArray();
  const visits = await db.visits.toArray();

  const data = {
    taxpayers,
    houses,
    payments,
    visits,
    version: 1,
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pbb_p2_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importDatabase = async (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        
        if (!data.taxpayers) {
          throw new Error('Invalid backup file format');
        }

        await db.transaction('rw', db.taxpayers, db.houses, db.payments, db.visits, async () => {
          await db.taxpayers.clear();
          await db.houses.clear();
          await db.payments.clear();
          await db.visits.clear();

          if (data.taxpayers.length > 0) await db.taxpayers.bulkAdd(data.taxpayers);
          if (data.houses.length > 0) await db.houses.bulkAdd(data.houses);
          if (data.payments?.length > 0) await db.payments.bulkAdd(data.payments);
          if (data.visits?.length > 0) await db.visits.bulkAdd(data.visits);
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
