// This reads the active backend URL directly from your web/index folder's .env file:
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
