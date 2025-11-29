import React, { createContext, useContext, useState } from 'react';

export type Sample = {
  intensity: number;
  timestamp: number;
};

export type HeartRateRecord = {
  bpm: number;
  samples: Sample[];
  timestamp: number;
};

type HeartRateContextType = {
  records: HeartRateRecord[];
  addRecord: (record: HeartRateRecord) => void;
};

const HeartRateContext = createContext<HeartRateContextType | undefined>(
  undefined,
);

export const HeartRateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<HeartRateRecord[]>([]);

  const addRecord = (record: HeartRateRecord) => {
    setRecords(prev => [...prev, record]);
  };

  return (
    <HeartRateContext.Provider value={{ records, addRecord }}>
      {children}
    </HeartRateContext.Provider>
  );
};

export const useHeartRate = () => {
  const ctx = useContext(HeartRateContext);
  if (!ctx) {
    throw new Error('useHeartRate must be used within a HeartRateProvider');
  }
  return ctx;
};
