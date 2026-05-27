/**
 * Cấu hình API - đổi IP khi chạy trên thiết bị thật
 * Android emulator: http://10.0.2.2:3000
 * iOS simulator: http://localhost:3000
 */
import { Platform } from 'react-native';

const DEV_HOST =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEV_HOST;

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi kết nối API');
  }

  return data;
}
