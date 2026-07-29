import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// =========================================================
// SWITCH BACKEND HERE (Comment / Uncomment the lines below)
// =========================================================

// 1. LOCAL BACKEND (WiFi IP so physical phone can connect too)
const PC_WIFI_IP = '192.168.1.8';
export const API_BASE_URL = `http://${PC_WIFI_IP}:5000/api`;

// 2. LIVE PRODUCTION BACKEND (Railway)
// export const API_BASE_URL = 'https://user-logistic-production.up.railway.app/api';

// 3. (Optional) Load from Expo .env file
// export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || `http://${PC_WIFI_IP}:5000/api`;

// =========================================================

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

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.log(`API [${endpoint}] Non-JSON response:`, text.substring(0, 100));
    throw new Error('Server connection error. Please verify backend is running.');
  }

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}
