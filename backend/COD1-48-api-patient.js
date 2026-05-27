/**
 * COD1-48: Tạo API bệnh nhân (CRUD)
 */
const express = require('express');
const { db, nextId } = require('./db');
const { authRequired } = require('./middleware/auth');

const router = express.Router();

router.use(authRequired);

router.get('/', (req, res) => {
  res.json({ data: db.patients });
});

router.get('/:id', (req, res) => {
  const patient = db.patients.find((p) => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
  }
  res.json({ data: patient });
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
  res.status(201).json({ message: 'Tạo hồ sơ bệnh nhân thành công', data: patient });
});

router.put('/:id', (req, res) => {
  const index = db.patients.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
  }

  db.patients[index] = { ...db.patients[index], ...req.body, id: req.params.id };
  res.json({ message: 'Cập nhật hồ sơ thành công', data: db.patients[index] });
});

router.delete('/:id', (req, res) => {
  const index = db.patients.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
  }
  db.patients.splice(index, 1);
  res.json({ message: 'Xóa hồ sơ thành công' });
});

module.exports = router;
