/**
 * COD1-50: Đăng nhập — Giao diện quản lý phòng khám
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from './api';
import { useAuth } from './context/AuthContext';
import { FigmaAlert, FigmaField, FigmaInput } from './extras/figma/FigmaUI';

export default function COD1_50_LoginScreen() {
  const [username, setUsername] = useState('bacsi');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      login(result.user, result.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fm-login-wrap">
      <div className="fm-login-hero">
        <div className="fm-login-hero__logo">+</div>
        <h1>Hệ thống quản lý phòng khám</h1>
        <p>
          Quản lý hồ sơ bệnh nhân, lịch sử thuốc và lịch khám trên một nền tảng thống nhất — thiết kế
          theo mẫu Figma Community.
        </p>
        <div className="fm-login-hero__features">
          <div className="fm-login-hero__feat">✓ Hồ sơ bệnh nhân điện tử</div>
          <div className="fm-login-hero__feat">✓ Quản lý đơn thuốc &amp; nhắc uống</div>
          <div className="fm-login-hero__feat">✓ Đặt lịch &amp; lịch sử khám</div>
        </div>
      </div>
      <div className="fm-login-panel">
        <form className="fm-login-card" onSubmit={handleSubmit}>
          <h2>Đăng nhập</h2>
          <p className="fm-login-sub">Chào mừng trở lại! Vui lòng đăng nhập tài khoản.</p>
          <FigmaAlert type="error">{error}</FigmaAlert>
          <FigmaField label="Tên đăng nhập">
            <FigmaInput value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="bacsi" />
          </FigmaField>
          <FigmaField label="Mật khẩu">
            <FigmaInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </FigmaField>
          <button type="submit" className="fm-btn fm-btn--primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }} disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
          <p className="fm-login-hint" style={{ marginTop: '1rem', textAlign: 'center' }}>
            Khách hàng mua thuốc?{' '}
            <Link to="/dang-ky">Đăng ký tài khoản</Link>
          </p>
          <div className="fm-login-hint">
            <strong>Demo:</strong> bacsi / user123 · admin / admin123
          </div>
        </form>
      </div>
    </div>
  );
}
