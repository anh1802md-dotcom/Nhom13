/**
 * COD1-42: Xem lịch khám — API GET /api/appointments
 */
const express = require('express');
const { db } = require('./db');
const { authRequired } = require('./middleware/auth');

const router = express.Router();

router.use(authRequired);

router.get('/', (req, res) => {
  const { patientId } = req.query;
  let list = db.appointments;
  if (patientId) list = list.filter((a) => a.patientId === patientId);
  res.json({ data: list });
});

module.exports = router;
