const API_BASE = import.meta.env.VITE_API_URL || '';

let authToken = localStorage.getItem('token') || null;

export function setAuthToken(token) {
  authToken = token;
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
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

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Lỗi kết nối API');
  }

  return data;
}

export const DEMO_PATIENT_ID = 'p1';

/** Mã BN đang xem: khách hàng dùng hồ sơ của mình, bác sĩ dùng BN đã chọn / demo */
export function getCurrentPatientId() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.role === 'customer' && user.patientId) {
      return user.patientId;
    }
  } catch {
    /* ignore */
  }
  return localStorage.getItem('activePatientId') || DEMO_PATIENT_ID;
}
