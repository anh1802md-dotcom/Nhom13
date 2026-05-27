/**
 * Bổ sung: Quản lý tất cả bệnh nhân + xóa khi hết liệu trình thuốc
 * GET    /api/bonus/manage/patients
 * GET    /api/bonus/manage/patients/:id
 * GET    /api/bonus/manage/patients/:id/can-delete
 * DELETE /api/bonus/manage/patients/:id
 */
const express = require('express');
const { db } = require('./db');
const { authRequired } = require('./middleware/auth');
const {
  canDeletePatient,
  deletePatientAndRelated,
  enrichPatientList,
  getPatientMedications,
} = require('./COD1-bonus-patient-utils');

const router = express.Router();

router.use(authRequired);

function doctorOrAdmin(req, res, next) {
  const role = req.user?.role;
  if (role === 'admin' || role === 'doctor') {
    return next();
  }
  return res.status(403).json({ message: 'Chỉ bác sĩ hoặc admin mới được quản lý bệnh nhân' });
}

router.use(doctorOrAdmin);

router.get('/', (_req, res) => {
  res.json({
    message: 'Danh sách tất cả bệnh nhân',
    data: enrichPatientList(),
  });
});

router.get('/:id/can-delete', (req, res) => {
  const check = canDeletePatient(req.params.id);
  if (!db.patients.find((p) => p.id === req.params.id)) {
    return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
  }
  res.json(check);
});

router.get('/:id', (req, res) => {
  const patient = db.patients.find((p) => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
  }

  const medications = getPatientMedications(patient.id);
  const appointments = db.appointments.filter((a) => a.patientId === patient.id);
  const examinations = db.examinations.filter((e) => e.patientId === patient.id);
  const deleteCheck = canDeletePatient(patient.id);

  res.json({
    data: {
      patient,
      medications,
      appointments,
      examinations,
      canDelete: deleteCheck.canDelete,
      deleteReason: deleteCheck.reason,
    },
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const check = canDeletePatient(id);

  if (!db.patients.find((p) => p.id === id)) {
    return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
  }

  if (!check.canDelete) {
    return res.status(400).json({
      message: check.reason,
      activeMedications: check.activeMedications || [],
    });
  }

  deletePatientAndRelated(id);
  res.json({ message: 'Đã xóa bệnh nhân và dữ liệu liên quan', patientId: id });
});

module.exports = router;
