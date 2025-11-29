// biểu đồ BPM (tùy chọn)
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-svg-charts';

type Sample = {
  intensity: number;
  timestamp: number;
};

type Props = {
  samples: Sample[];
};

const Chart = ({ samples }: Props) => {
  const data = samples.map(s => s.intensity);

  return (
    <View style={styles.container}>
      <LineChart
        style={{ height: 200 }}
        data={data}
        svg={{ stroke: '#ff4444', strokeWidth: 2 }}
        contentInset={{ top: 20, bottom: 20 }}
      />
    </View>
  );
};

export default Chart;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
});
