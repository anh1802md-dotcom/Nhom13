/**
 * Tiện ích bổ sung — kiểm tra liệu trình thuốc & xóa bệnh nhân
 * Không sửa db.js hay COD1-48
 */
const { db } = require('./db');

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isMedicationCourseFinished(med) {
  if (!med.endDate) return false;
  const end = parseDate(med.endDate);
  if (!end) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return end < today;
}

function getPatientMedications(patientId) {
  return db.medications.filter((m) => m.patientId === patientId);
}

function canDeletePatient(patientId) {
  const patient = db.patients.find((p) => p.id === patientId);
  if (!patient) {
    return { canDelete: false, reason: 'Không tìm thấy bệnh nhân', medications: [] };
  }

  const medications = getPatientMedications(patientId);
  if (medications.length === 0) {
    return {
      canDelete: true,
      reason: 'Bệnh nhân chưa có đơn thuốc — được phép xóa',
      medications: [],
    };
  }

  const stillActive = medications.filter((m) => !isMedicationCourseFinished(m));
  if (stillActive.length > 0) {
    return {
      canDelete: false,
      reason: 'Còn thuốc chưa hết quá trình điều trị (ngày kết thúc chưa qua hoặc chưa có ngày kết thúc)',
      medications,
      activeMedications: stillActive,
    };
  }

  return {
    canDelete: true,
    reason: 'Đã hết quá trình sử dụng thuốc — được phép xóa',
    medications,
  };
}

function deletePatientAndRelated(patientId) {
  const index = db.patients.findIndex((p) => p.id === patientId);
  if (index === -1) return false;

  db.patients.splice(index, 1);
  db.medications = db.medications.filter((m) => m.patientId !== patientId);
  db.appointments = db.appointments.filter((a) => a.patientId !== patientId);
  db.examinations = db.examinations.filter((e) => e.patientId !== patientId);
  return true;
}

function enrichPatientList() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return db.patients.map((p) => {
    const medications = getPatientMedications(p.id);
    const check = canDeletePatient(p.id);
    const activeCount = medications.filter((m) => !isMedicationCourseFinished(m)).length;

    return {
      ...p,
      medicationCount: medications.length,
      activeMedicationCount: activeCount,
      treatmentStatus:
        medications.length === 0
          ? 'no_medication'
          : activeCount > 0
            ? 'in_treatment'
            : 'finished',
      canDelete: check.canDelete,
      deleteReason: check.reason,
    };
  });
}

module.exports = {
  canDeletePatient,
  deletePatientAndRelated,
  enrichPatientList,
  getPatientMedications,
  isMedicationCourseFinished,
};
