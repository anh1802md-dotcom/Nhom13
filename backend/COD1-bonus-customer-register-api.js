/**
 * Bổ sung: Đăng ký tài khoản khách hàng (công khai)
 * POST /api/auth/register
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const { createCustomerAccount, toPublicUser } = require('./COD1-bonus-customer-utils');
const { JWT_SECRET } = require('./middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    username,
    password,
    confirmPassword,
    fullName,
    phone,
    dateOfBirth,
    gender,
    address,
  } = req.body;

  if (!username || !password || !fullName) {
    return res.status(400).json({ message: 'Vui lòng nhập họ tên, tên đăng nhập và mật khẩu' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu tối thiểu 6 ký tự' });
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
  }

  try {
    const { user } = await createCustomerAccount({
      username,
      password,
      fullName,
      phone,
      dateOfBirth,
      gender,
      address,
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Đăng ký thành công. Bạn có thể theo dõi lịch dùng thuốc sau khi mua tại phòng khám.',
      token,
      user: toPublicUser({ ...user, role: 'customer' }),
    });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Đăng ký thất bại' });
  }
});

module.exports = router;
