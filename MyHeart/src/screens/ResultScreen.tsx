import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Chart from '../components/Chart';
import { RootStackParamList } from '../navigation/types';

type ResultScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ResultScreen'
>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'ResultScreen'>;

const ResultScreen = () => {
  const navigation = useNavigation<ResultScreenNavigationProp>();
  const route = useRoute<ResultScreenRouteProp>();
  const { bpm, samples } = route.params;

  const getAdvice = (bpm: number): string => {
    if (bpm < 60) return 'Nhịp tim hơi thấp, hãy nghỉ ngơi hoặc kiểm tra lại.';
    if (bpm <= 100) return 'Nhịp tim bình thường. Bạn đang ổn!';
    return 'Nhịp tim cao, hãy thư giãn và hít thở sâu.';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kết quả đo nhịp tim</Text>
      <Text style={styles.bpmText}>{Math.round(bpm)} BPM</Text>
      <Text style={styles.advice}>{getAdvice(bpm)}</Text>

      <View style={styles.chartContainer}>
        <Chart samples={samples} />
      </View>

      {/* Nút đo lại */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Đo lại</Text>
      </TouchableOpacity>

      {/* ✅ Nút xem lịch sử */}
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('HistoryScreen')}
      >
        <Text style={styles.buttonText}>Xem lịch sử</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  bpmText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ff4444',
    textAlign: 'center',
  },
  advice: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  chartContainer: { flex: 1, marginTop: 20 },
  button: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  historyButton: {
    backgroundColor: '#4444ff', // màu khác để phân biệt
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
