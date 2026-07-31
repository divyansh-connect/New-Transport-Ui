import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Reads active backend URL from .env, fallback to live Railway production backend:
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://user-logistic-production.up.railway.app/api';

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
