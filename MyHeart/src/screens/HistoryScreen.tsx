import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getSessionsByUser, MeasureSession } from '../services/api';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HistoryScreen'
>;

const HistoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [sessions, setSessions] = useState<MeasureSession[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = 'demo_user_123';

  useEffect(() => {
    setLoading(true);
    getSessionsByUser(userId)
      .then(setSessions)
      .catch(err => console.error('History error:', err))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({
    item,
    index,
  }: {
    item: MeasureSession;
    index: number;
  }) => {
    const bpm = item.resultBpm ?? 0;
    const time = new Date().toLocaleString('vi-VN'); // backend chưa có finishedAt

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('ResultScreen', {
            bpm,
            samples: item.samples || [],
          })
        }
      >
        <Text style={styles.bpm}>
          Lần {index + 1}: {Math.round(bpm)} BPM
        </Text>
        <Text style={styles.time}>{time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử đo nhịp tim</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#444" />
      ) : sessions.length === 0 ? (
        <Text style={styles.empty}>Chưa có dữ liệu đo nào.</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  empty: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 40 },
  item: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  bpm: { fontSize: 18, fontWeight: 'bold', color: '#ff4444' },
  time: { fontSize: 14, color: '#333', marginTop: 4 },
});
