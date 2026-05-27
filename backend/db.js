/**
 * Cơ sở dữ liệu trong bộ nhớ (có thể mở rộng lưu file JSON).
 */
const bcrypt = require('bcryptjs');

const db = {
  users: [],
  patients: [],
  medications: [],
  appointments: [],
  examinations: [],
};

async function seed() {
  if (db.users.length > 0) return;

  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  db.users.push(
    {
      id: 'u1',
      username: 'admin',
      password: adminHash,
      role: 'admin',
      fullName: 'Quản trị viên',
    },
    {
      id: 'u2',
      username: 'bacsi',
      password: userHash,
      role: 'doctor',
      fullName: 'Bác sĩ Nguyễn Văn A',
    }
  );

  db.patients.push({
    id: 'p1',
    fullName: 'Trần Thị B',
    dateOfBirth: '1990-05-15',
    gender: 'Nữ',
    phone: '0901234567',
    address: 'Hà Nội',
    bloodType: 'O+',
    allergies: 'Penicillin',
    medicalHistory: 'Tiểu đường type 2',
    userId: 'u2',
  });

  db.medications.push({
    id: 'm1',
    patientId: 'p1',
    drugName: 'Metformin 500mg',
    dosage: '1 viên',
    frequency: '2 lần/ngày',
    startDate: '2025-01-01',
    endDate: '2025-06-01',
    notes: 'Uống sau bữa ăn',
    reminderTimes: ['08:00', '20:00'],
  });

  db.appointments.push({
    id: 'a1',
    patientId: 'p1',
    doctorName: 'BS. Nguyễn Văn A',
    clinic: 'Phòng khám Đa khoa',
    date: '2026-06-01',
    time: '09:00',
    reason: 'Tái khám tiểu đường',
    status: 'scheduled',
  });

  db.examinations.push({
    id: 'e1',
    patientId: 'p1',
    date: '2025-12-10',
    doctorName: 'BS. Nguyễn Văn A',
    clinic: 'Phòng khám Đa khoa',
    diagnosis: 'Tiểu đường ổn định',
    notes: 'Tiếp tục điều trị',
  });
}

function nextId(prefix, list) {
  const num = list.length + 1;
  return `${prefix}${num}`;
}

module.exports = { db, seed, nextId };
