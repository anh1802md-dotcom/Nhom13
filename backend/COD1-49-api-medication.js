/**
 * COD1-49: Tạo API lịch sử thuốc (CRUD)
 */
const express = require('express');
const { db, nextId } = require('./db');
const { authRequired } = require('./middleware/auth');

const router = express.Router();

router.use(authRequired);

router.get('/', (req, res) => {
  const { patientId } = req.query;
  let list = db.medications;
  if (patientId) {
    list = list.filter((m) => m.patientId === patientId);
  }
  res.json({ data: list });
});

router.get('/:id', (req, res) => {
  const item = db.medications.find((m) => m.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Không tìm thấy lịch sử thuốc' });
  }
  res.json({ data: item });
});

router.post('/', (req, res) => {
  const { patientId, drugName, dosage, frequency, startDate, endDate, notes, reminderTimes } =
    req.body;

  if (!patientId || !drugName) {
    return res.status(400).json({ message: 'patientId và tên thuốc là bắt buộc' });
  }

  const medication = {
    id: nextId('m', db.medications),
    patientId,
    drugName,
    dosage: dosage || '',
    frequency: frequency || '',
    startDate: startDate || '',
    endDate: endDate || '',
    notes: notes || '',
    reminderTimes: reminderTimes || [],
  };

  db.medications.push(medication);
  res.status(201).json({ message: 'Thêm lịch sử thuốc thành công', data: medication });
});

router.put('/:id', (req, res) => {
  const index = db.medications.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy lịch sử thuốc' });
  }
  db.medications[index] = { ...db.medications[index], ...req.body, id: req.params.id };
  res.json({ message: 'Cập nhật thành công', data: db.medications[index] });
});

router.delete('/:id', (req, res) => {
  const index = db.medications.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy lịch sử thuốc' });
  }
  db.medications.splice(index, 1);
  res.json({ message: 'Xóa thành công' });
});

module.exports = router;
