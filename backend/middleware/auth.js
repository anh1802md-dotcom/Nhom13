const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dacnpm-secret-key-2026';

function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Thiếu token xác thực' });
  }
  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
}

function adminRequired(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Chỉ admin mới được phép' });
  }
  next();
}

module.exports = { authRequired, adminRequired, JWT_SECRET };
