// gọi API backend
import axios from 'axios';

const BASE_URL = 'http://192.168.1.143:8080/api/measure'; // thiết bị thật: IP LAN. Emulator: http://10.0.2.2:8080/api/measure

export type PpgSample = {
  intensity: number;
  timestamp: number;
};

export type MeasureSession = {
  id: string;
  userId: string;
  samples: PpgSample[];
  resultBpm: number;
  finishedAt?: number;
};

// Kiểu file đúng cho React Native FormData (tránh any)
type ReactNativeFile = {
  uri: string;
  type: string;
  name: string;
};

export const startSession = async (userId: string): Promise<string> => {
  const res = await axios.post(`${BASE_URL}/start`, null, {
    params: { userId },
    timeout: 15000,
  });
  return res.data.id;
};

export const sendFrame = async (
  sessionId: string,
  timestamp: number,
  fileUri: string,
): Promise<void> => {
  const formData = new FormData();
  formData.append('sessionId', sessionId);
  formData.append('timestamp', String(timestamp));

  const file: ReactNativeFile = {
    uri: fileUri, // 'file:///...'
    type: 'image/jpeg',
    name: `frame_${timestamp}.jpg`,
  };

  // FormData.append ở RN không gò kiểu Blob chuẩn → dùng cast an toàn để tránh any
  formData.append('file', file as unknown as Blob);

  await axios.post(`${BASE_URL}/frame`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 15000,
  });
};

export const finishSession = async (sessionId: string): Promise<number> => {
  const res = await axios.post(`${BASE_URL}/finish`, null, {
    params: { sessionId },
    timeout: 15000,
  });
  return res.data;
};

export const getSessionsByUser = async (
  userId: string,
): Promise<MeasureSession[]> => {
  const res = await axios.get(`${BASE_URL}/sessions/${userId}`, {
    timeout: 15000,
  });
  return res.data;
};
