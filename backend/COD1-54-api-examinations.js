/**
 * API lịch sử khám (hỗ trợ COD1-54)
 */
const express = require('express');
const { db } = require('./db');
const { authRequired } = require('./middleware/auth');

const router = express.Router();

router.use(authRequired);

router.get('/', (req, res) => {
  const { patientId } = req.query;
  let list = db.examinations;
  if (patientId) list = list.filter((e) => e.patientId === patientId);
  res.json({ data: list });
});

module.exports = router;
