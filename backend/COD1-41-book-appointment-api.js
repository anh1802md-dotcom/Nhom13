/**
 * COD1-41: Đặt lịch khám — API POST /api/appointments
 */
const express = require('express');
const { db, nextId } = require('./db');
const { authRequired } = require('./middleware/auth');

const router = express.Router();

router.use(authRequired);

router.post('/', (req, res) => {
  const { patientId, doctorName, clinic, date, time, reason } = req.body;
  if (!patientId || !date || !time) {
    return res.status(400).json({ message: 'patientId, ngày và giờ là bắt buộc' });
  }

  const appointment = {
    id: nextId('a', db.appointments),
    patientId,
    doctorName: doctorName || '',
    clinic: clinic || '',
    date,
    time,
    reason: reason || '',
    status: 'scheduled',
  };

  db.appointments.push(appointment);
  res.status(201).json({ message: 'Đặt lịch khám thành công', data: appointment });
});

module.exports = router;
