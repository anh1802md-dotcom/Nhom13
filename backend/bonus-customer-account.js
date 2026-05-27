/**
 * Logic tạo tài khoản khách hàng + hồ sơ bệnh nhân liên kết
 */
const bcrypt = require('bcryptjs');
const { db, nextId } = require('./db');

async function createCustomerAccount(data) {
  const {
    username,
    password,
    fullName,
    phone,
    dateOfBirth = '',
    gender = '',
    address = '',
  } = data;

  if (!username || !password || !fullName) {
    const err = new Error('Username, mật khẩu và họ tên là bắt buộc');
    err.status = 400;
    throw err;
  }

  if (db.users.some((u) => u.username === username)) {
    const err = new Error('Username đã tồn tại');
    err.status = 409;
    throw err;
  }

  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: nextId('u', db.users),
    username,
    password: hash,
    role: 'customer',
    fullName,
    phone: phone || '',
  };

  const patient = {
    id: nextId('p', db.patients),
    fullName,
    dateOfBirth,
    gender,
    phone: phone || '',
    address,
    bloodType: '',
    allergies: '',
    medicalHistory: 'Khách hàng mua thuốc tại phòng khám',
    userId: user.id,
    customerUserId: user.id,
  };

  user.patientId = patient.id;

  db.users.push(user);
  db.patients.push(patient);

  const { password: _, ...safeUser } = user;
  return { user: safeUser, patient };
}

module.exports = { createCustomerAccount };
