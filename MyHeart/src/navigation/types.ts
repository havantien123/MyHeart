export type RootStackParamList = {
  HeartRateScreen: undefined;
  ResultScreen: {
    bpm: number;
    samples: { intensity: number; timestamp: number }[];
  };
  HistoryScreen: undefined;
};
