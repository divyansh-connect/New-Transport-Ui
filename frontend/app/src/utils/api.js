import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// PC WiFi IP — update this if your IP changes (run ipconfig to check)
const PC_WIFI_IP = '192.168.1.5';

// 10.0.2.2 = Android Emulator's special IP for host machine localhost
// PC_WIFI_IP = Physical Android/iOS phone on same WiFi network
export const API_BASE_URL = Platform.OS === 'android'
  ? `http://${PC_WIFI_IP}:5000/api`   // works for both emulator & physical phone
  : `http://${PC_WIFI_IP}:5000/api`;  // iOS / Web

/**
 * Custom fetch wrapper to handle secure API calls to the backend
 * @param {string} endpoint - The API endpoint suffix (e.g. '/auth/login')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 */
export async function apiFetch(endpoint, options = {}) {
  const token = await AsyncStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}
