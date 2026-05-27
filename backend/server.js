/**
 * Server chính - kết nối tất cả API theo từng task COD1
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { seed } = require('./db');

const authLoginRouter = require('./COD1-50-auth-login');
const patientApiRouter = require('./COD1-48-api-patient');
const medicationApiRouter = require('./COD1-49-api-medication');
const adminUsersRouter = require('./COD1-46-admin-users');
const appointmentBookRouter = require('./COD1-41-book-appointment-api');
const appointmentViewRouter = require('./COD1-42-view-appointments-api');
const examinationsRouter = require('./COD1-54-api-examinations');
const bonusPatientRouter = require('./COD1-bonus-add-patient');
const bonusManagePatientsRouter = require('./COD1-bonus-manage-all-patients');
const bonusCustomerRegisterRouter = require('./COD1-bonus-customer-register-api');
const bonusCustomerPortalRouter = require('./COD1-bonus-customer-portal-api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Hệ thống đang hoạt động' });
});

app.use('/api/auth', authLoginRouter);
app.use('/api/auth', bonusCustomerRegisterRouter);
app.use('/api/customer', bonusCustomerPortalRouter);
app.use('/api/patients', patientApiRouter);
app.use('/api/medications', medicationApiRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/appointments', appointmentBookRouter);
app.use('/api/appointments', appointmentViewRouter);
app.use('/api/examinations', examinationsRouter);
app.use('/api/bonus/patients', bonusPatientRouter);
app.use('/api/bonus/manage/patients', bonusManagePatientsRouter);

// Phục vụ giao diện web (sau khi build: npm run build --prefix web)
const webDist = path.join(__dirname, '../web/dist');
if (fs.existsSync(webDist)) {
  app.use(express.static(webDist));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(webDist, 'index.html'));
  });
}

let server;

async function start() {
  await seed();
  if (server) return server;
  server = app.listen(PORT, () => {
    const hasWeb = fs.existsSync(webDist);
    console.log(`Server chạy tại http://localhost:${PORT}`);
    if (hasWeb) {
      console.log(`Trang web: http://localhost:${PORT}`);
    } else {
      console.log('Chưa có web build — chạy: npm run build --prefix web');
    }
    console.log('Tài khoản demo: admin/admin123 hoặc bacsi/user123');
  });
  return server;
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
