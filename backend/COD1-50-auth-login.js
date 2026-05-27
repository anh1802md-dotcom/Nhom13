/**
 * COD1-50: Tạo API đăng nhập
 * POST /api/auth/login
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('./db');
const { JWT_SECRET } = require('./middleware/auth');
const { toPublicUser } = require('./COD1-bonus-customer-utils');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập username và password' });
  }

  const user = db.users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Đăng nhập thành công',
    token,
    user: toPublicUser(user),
  });
});

module.exports = router;
