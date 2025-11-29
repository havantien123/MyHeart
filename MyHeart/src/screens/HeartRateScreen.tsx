import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {
  startSession,
  sendFrame as uploadFrame,
  finishSession,
} from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useHeartRate } from '../store';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HeartRateScreen'
>;

const HeartRateScreen = () => {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const navigation = useNavigation<NavigationProp>();
  const { addRecord } = useHeartRate();

  const { hasPermission, requestPermission } = useCameraPermission();

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bpm, setBpm] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [samples, setSamples] = useState<
    { intensity: number; timestamp: number }[]
  >([]);

  const userId = 'demo_user_123';

  const ensureCameraPermission = useCallback(async () => {
    if (hasPermission) return true;
    const granted = await requestPermission();
    return granted;
  }, [hasPermission, requestPermission]);

  const startMeasure = async () => {
    setLoading(true);
    try {
      const ok = await ensureCameraPermission();
      if (!ok) {
        console.error('Camera permission denied');
        setLoading(false);
        return;
      }
      if (!device) {
        console.error('No camera device available');
        setLoading(false);
        return;
      }

      const id = await startSession(userId);
      setSessionId(id);
      setSamples([]);
      setBpm(null);
      setIsMeasuring(true);
      setCameraReady(false); // reset lại, sẽ được set true khi camera initialized
    } catch (err) {
      console.error('Start error:', err);
    }
    setLoading(false);
  };

  const stopMeasure = async () => {
    setLoading(true);
    try {
      if (sessionId) {
        const result = await finishSession(sessionId);
        setBpm(result);
        setIsMeasuring(false);

        addRecord({ bpm: result, samples, timestamp: Date.now() });

        navigation.navigate('ResultScreen', { bpm: result, samples });
      } else {
        setIsMeasuring(false);
      }
    } catch (err) {
      console.error('Finish error:', err);
    }
    setLoading(false);
  };

  const captureFrame = useCallback(async () => {
    if (!camera.current || !sessionId || !cameraReady || !isMeasuring) return;

    try {
      const photo = await camera.current.takePhoto({ flash: 'off' });

      const filePath = photo.path.startsWith('file://')
        ? photo.path
        : 'file://' + photo.path;
      const timestamp = Date.now();

      await uploadFrame(sessionId, timestamp, filePath);

      const fakeIntensity = Math.random() * 100;
      setSamples(prev => [...prev, { intensity: fakeIntensity, timestamp }]);
    } catch (err) {
      console.error('Frame error:', err);
    }
  }, [camera, sessionId, cameraReady, isMeasuring]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isMeasuring) {
      interval = setInterval(captureFrame, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMeasuring, captureFrame]);

  if (!device) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 8 }}>Đang tìm camera...</Text>
      </View>
    );
  }

  // Nếu chưa có quyền camera → hiển thị nút xin quyền
  if (!hasPermission) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: '#fff', marginBottom: 12 }}>
          Ứng dụng cần quyền Camera để đo nhịp tim.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const granted = await requestPermission();
            if (!granted) {
              console.error('Camera permission denied');
            }
          }}
        >
          <Text style={styles.buttonText}>Cấp quyền Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isMeasuring && cameraReady} // chỉ bật khi đã initialized
        photo={true}
        torch={isMeasuring ? 'on' : 'off'}
        onInitialized={() => setCameraReady(true)}
        onError={e => {
          console.error('Camera error:', e);
        }}
      />
      <View style={styles.controls}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : isMeasuring ? (
          <TouchableOpacity style={styles.button} onPress={stopMeasure}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={startMeasure}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}

        {bpm !== null && (
          <Text style={styles.bpmText}>Your BPM: {Math.round(bpm)}</Text>
        )}

        <TouchableOpacity
          style={[styles.button, styles.historyButton]}
          onPress={() => navigation.navigate('HistoryScreen')}
        >
          <Text style={styles.buttonText}>Xem lịch sử</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeartRateScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  controls: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyButton: { backgroundColor: '#4444ff' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  bpmText: { color: '#fff', fontSize: 20, marginTop: 10 },
});
