/**
 * Lưu bệnh nhân đang được chọn quản lý (không đụng file COD1 cũ).
 */
const STORAGE_KEY = 'activePatientId';
export const DEFAULT_PATIENT_ID = 'p1';

export function getActivePatientId() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_PATIENT_ID;
}

export function setActivePatientId(id) {
  if (id) localStorage.setItem(STORAGE_KEY, id);
}
