/**
 * Bổ sung: API thêm bệnh nhân (chỉ bác sĩ & admin)
 * POST /api/bonus/patients
 * Không sửa COD1-48-api-patient.js
 */
const express = require('express');
const { db, nextId } = require('./db');
const { authRequired } = require('./middleware/auth');

const router = express.Router();

router.use(authRequired);

function doctorOrAdmin(req, res, next) {
  const role = req.user?.role;
  if (role === 'admin' || role === 'doctor') {
    return next();
  }
  return res.status(403).json({ message: 'Chỉ bác sĩ hoặc admin mới được thêm bệnh nhân' });
}

router.use(doctorOrAdmin);

router.get('/', (_req, res) => {
  res.json({ data: db.patients });
});

router.post('/', (req, res) => {
  const { fullName, dateOfBirth, gender, phone, address, bloodType, allergies, medicalHistory } =
    req.body;

  if (!fullName) {
    return res.status(400).json({ message: 'Họ tên là bắt buộc' });
  }

  const patient = {
    id: nextId('p', db.patients),
    fullName,
    dateOfBirth: dateOfBirth || '',
    gender: gender || '',
    phone: phone || '',
    address: address || '',
    bloodType: bloodType || '',
    allergies: allergies || '',
    medicalHistory: medicalHistory || '',
    userId: req.user.id,
  };

  db.patients.push(patient);
  res.status(201).json({ message: 'Thêm bệnh nhân thành công', data: patient });
});

module.exports = router;
