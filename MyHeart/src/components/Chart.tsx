// biểu đồ BPM (tùy chọn)
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type Sample = {
  intensity: number;
  timestamp: number;
};

type Props = {
  samples: Sample[];
};

const Chart = ({ samples }: Props) => {
  const data = samples.map(s => s.intensity);
  const { width } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: [],
          datasets: [{ data }],
        }}
        width={width - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: '#f5f5f5',
          backgroundGradientTo: '#f5f5f5',
          color: () => '#ff4444',
          labelColor: () => '#666',
          strokeWidth: 2,
          propsForDots: { r: '0' }, // ẩn dot
        }}
        bezier
        style={{ borderRadius: 8 }}
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
