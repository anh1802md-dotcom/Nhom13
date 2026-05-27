/**
 * Bổ sung: API cổng khách hàng — xem hồ sơ & lịch thuốc của chính mình
 */
const express = require('express');
const { db } = require('./db');
const { authRequired } = require('./middleware/auth');
const { findPatientForCustomer, getCustomerPatientId } = require('./COD1-bonus-customer-utils');

const router = express.Router();

router.use(authRequired);

function customerOnly(req, res, next) {
  if (req.user?.role !== 'customer') {
    return res.status(403).json({ message: 'Chỉ tài khoản khách hàng mới truy cập được' });
  }
  next();
}

router.use(customerOnly);

function resolvePatient(req) {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return null;
  const patientId = getCustomerPatientId(user);
  if (!patientId) return null;
  return db.patients.find((p) => p.id === patientId) || findPatientForCustomer(req.user.id);
}

router.get('/profile', (req, res) => {
  const patient = resolvePatient(req);
  if (!patient) {
    return res.status(404).json({ message: 'Chưa có hồ sơ bệnh nhân liên kết' });
  }
  const user = db.users.find((u) => u.id === req.user.id);
  res.json({
    data: {
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
      patient,
    },
  });
});

router.get('/medications', (req, res) => {
  const patient = resolvePatient(req);
  if (!patient) {
    return res.json({ data: [], patient: null });
  }
  const list = db.medications.filter((m) => m.patientId === patient.id);
  res.json({ data: list, patient });
});

module.exports = router;
