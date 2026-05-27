/**
 * COD1-46: Quản lý người dùng admin
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const { db, nextId } = require('./db');
const { authRequired, adminRequired } = require('./middleware/auth');
const {
  ALLOWED_ROLES,
  createCustomerAccount,
  deleteCustomerLinkedData,
  toPublicUser,
} = require('./COD1-bonus-customer-utils');

const router = express.Router();

router.use(authRequired, adminRequired);

router.get('/', (_req, res) => {
  const users = db.users.map((u) => toPublicUser(u));
  res.json({ data: users });
});

router.post('/', async (req, res) => {
  const { username, password, role, fullName, phone, dateOfBirth, gender, address } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username và password là bắt buộc' });
  }

  const chosenRole = role || 'doctor';
  if (!ALLOWED_ROLES.includes(chosenRole)) {
    return res.status(400).json({ message: 'Vai trò không hợp lệ' });
  }

  if (chosenRole === 'customer') {
    try {
      const { user } = await createCustomerAccount({
        username,
        password,
        fullName: fullName || username,
        phone,
        dateOfBirth,
        gender,
        address,
      });
      return res.status(201).json({
        message: 'Tạo tài khoản khách hàng thành công',
        data: toPublicUser(user),
      });
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }

  if (db.users.some((u) => u.username === username)) {
    return res.status(409).json({ message: 'Username đã tồn tại' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: nextId('u', db.users),
    username,
    password: hash,
    role: chosenRole,
    fullName: fullName || username,
  };

  db.users.push(user);
  res.status(201).json({ message: 'Tạo người dùng thành công', data: toPublicUser(user) });
});

router.put('/:id', async (req, res) => {
  const index = db.users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  }

  const { fullName, role, password } = req.body;
  if (fullName) db.users[index].fullName = fullName;
  if (role && ALLOWED_ROLES.includes(role)) db.users[index].role = role;
  if (password) db.users[index].password = await bcrypt.hash(password, 10);

  res.json({ message: 'Cập nhật thành công', data: toPublicUser(db.users[index]) });
});

router.delete('/:id', (req, res) => {
  const index = db.users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  }

  if (db.users[index].id === req.user.id) {
    return res.status(400).json({ message: 'Không thể xóa chính tài khoản đang đăng nhập' });
  }

  if (db.users[index].role === 'admin' && db.users.filter((u) => u.role === 'admin').length === 1) {
    return res.status(400).json({ message: 'Không thể xóa admin cuối cùng' });
  }

  if (db.users[index].role === 'customer') {
    deleteCustomerLinkedData(db.users[index].id);
  }

  db.users.splice(index, 1);
  res.json({ message: 'Xóa người dùng thành công' });
});

module.exports = router;
