/**
 * Bổ sung: Đăng ký tài khoản khách hàng (công khai)
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from './api';
import { useAuth } from './context/AuthContext';
import { FigmaAlert, FigmaField, FigmaInput, FigmaSelect } from './extras/figma/FigmaUI';

export default function COD1_Bonus_CustomerRegister() {
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMsg('');
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      login(result.user, result.token);
      setMsg(result.message);
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fm-login-wrap">
      <div className="fm-login-hero">
        <div className="fm-login-hero__logo">💊</div>
        <h1>Đăng ký khách hàng</h1>
        <p>
          Tạo tài khoản để theo dõi lịch uống thuốc sau khi mua tại phòng khám. Bác sĩ sẽ cập nhật đơn
          thuốc vào hồ sơ của bạn.
        </p>
        <div className="fm-login-hero__features">
          <div className="fm-login-hero__feat">✓ Xem lịch sử &amp; nhắc uống thuốc</div>
          <div className="fm-login-hero__feat">✓ Hồ sơ cá nhân liên kết tự động</div>
          <div className="fm-login-hero__feat">✓ Đăng nhập mọi lúc trên web</div>
        </div>
      </div>
      <div className="fm-login-panel">
        <form className="fm-login-card" onSubmit={handleSubmit}>
          <h2>Tạo tài khoản</h2>
          <p className="fm-login-sub">Dành cho khách hàng chưa có tài khoản.</p>
          <FigmaAlert type="error">{error}</FigmaAlert>
          <FigmaAlert type="success">{msg}</FigmaAlert>
          <FigmaField label="Họ và tên *">
            <FigmaInput
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              required
            />
          </FigmaField>
          <FigmaField label="Tên đăng nhập *">
            <FigmaInput
              value={form.username}
              onChange={(e) => update('username', e.target.value)}
              required
              placeholder="vd: nguyenvana"
            />
          </FigmaField>
          <FigmaField label="Số điện thoại">
            <FigmaInput value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </FigmaField>
          <FigmaField label="Ngày sinh">
            <FigmaInput
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => update('dateOfBirth', e.target.value)}
            />
          </FigmaField>
          <FigmaField label="Giới tính">
            <FigmaSelect value={form.gender} onChange={(e) => update('gender', e.target.value)}>
              <option value="">— Chọn —</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </FigmaSelect>
          </FigmaField>
          <FigmaField label="Địa chỉ">
            <FigmaInput value={form.address} onChange={(e) => update('address', e.target.value)} />
          </FigmaField>
          <FigmaField label="Mật khẩu * (tối thiểu 6 ký tự)">
            <FigmaInput
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
              minLength={6}
            />
          </FigmaField>
          <FigmaField label="Xác nhận mật khẩu *">
            <FigmaInput
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              required
            />
          </FigmaField>
          <button
            type="submit"
            className="fm-btn fm-btn--primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
          <p className="fm-login-hint" style={{ marginTop: '1rem', textAlign: 'center' }}>
            Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
