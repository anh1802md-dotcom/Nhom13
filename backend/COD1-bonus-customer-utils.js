/**
 * Bổ sung: tiện ích tài khoản khách hàng (customer) + hồ sơ bệnh nhân liên kết
 */
const bcrypt = require('bcryptjs');
const { db, nextId } = require('./db');

const ALLOWED_ROLES = ['admin', 'doctor', 'customer'];

async function createCustomerAccount({
  username,
  password,
  fullName,
  phone,
  dateOfBirth,
  gender,
  address,
}) {
  if (!username || !password) {
    const err = new Error('Username và password là bắt buộc');
    err.status = 400;
    throw err;
  }
  if (!fullName) {
    const err = new Error('Họ tên là bắt buộc');
    err.status = 400;
    throw err;
  }
  if (db.users.some((u) => u.username === username)) {
    const err = new Error('Username đã tồn tại');
    err.status = 409;
    throw err;
  }

  const hash = await bcrypt.hash(password, 10);
  const userId = nextId('u', db.users);
  const patientId = nextId('p', db.patients);

  const user = {
    id: userId,
    username,
    password: hash,
    role: 'customer',
    fullName,
    patientId,
  };

  const patient = {
    id: patientId,
    fullName,
    dateOfBirth: dateOfBirth || '',
    gender: gender || '',
    phone: phone || '',
    address: address || '',
    bloodType: '',
    allergies: '',
    medicalHistory: '',
    customerUserId: userId,
    userId: null,
  };

  db.users.push(user);
  db.patients.push(patient);

  const { password: _, ...safe } = user;
  return { user: safe, patient };
}

function findPatientForCustomer(userId) {
  return db.patients.find((p) => p.customerUserId === userId);
}

function getCustomerPatientId(user) {
  if (user.patientId) return user.patientId;
  const p = findPatientForCustomer(user.id);
  return p?.id || null;
}

function deleteCustomerLinkedData(userId) {
  const patient = findPatientForCustomer(userId);
  if (!patient) return;
  const pid = patient.id;
  db.medications = db.medications.filter((m) => m.patientId !== pid);
  db.appointments = db.appointments.filter((a) => a.patientId !== pid);
  db.examinations = db.examinations.filter((e) => e.patientId !== pid);
  const index = db.patients.findIndex((p) => p.id === pid);
  if (index !== -1) db.patients.splice(index, 1);
}

function toPublicUser(user) {
  const patientId = getCustomerPatientId(user);
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    fullName: user.fullName,
    patientId: user.role === 'customer' ? patientId : undefined,
  };
}

module.exports = {
  ALLOWED_ROLES,
  createCustomerAccount,
  findPatientForCustomer,
  getCustomerPatientId,
  deleteCustomerLinkedData,
  toPublicUser,
};
