/**
 * COD1-46: Quản lý người dùng admin
 */
import { useEffect, useState } from 'react';
import { apiFetch } from './api';
import { useAuth } from './context/AuthContext';
import {
  FigmaPage,
  FigmaCard,
  FigmaAlert,
  FigmaField,
  FigmaInput,
  FigmaSelect,
  FigmaPatientAvatar,
  FigmaBadge,
} from './extras/figma/FigmaUI';

const ROLE_LABELS = {
  admin: 'Quản trị',
  doctor: 'Bác sĩ',
  customer: 'Khách hàng',
};

export default function COD1_46_AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('doctor');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  function load() {
    apiFetch('/api/admin/users')
      .then((r) => setUsers(r.data))
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      await apiFetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
          fullName,
          role,
          phone: role === 'customer' ? phone : undefined,
        }),
      });
      setUsername('');
      setPassword('');
      setFullName('');
      setPhone('');
      setMsg(
        role === 'customer'
          ? 'Đã tạo tài khoản khách hàng (có hồ sơ theo dõi thuốc)'
          : 'Đã tạo người dùng mới'
      );
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(u) {
    if (u.id === currentUser?.id) {
      setError('Không thể xóa chính tài khoản đang đăng nhập');
      return;
    }
    const label = ROLE_LABELS[u.role] || u.role;
    if (
      !window.confirm(
        `Xóa tài khoản "${u.fullName}" (@${u.username}) — vai trò ${label}?\nThao tác không hoàn tác.`
      )
    ) {
      return;
    }
    setDeletingId(u.id);
    setMsg('');
    setError('');
    try {
      await apiFetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
      setMsg(`Đã xóa @${u.username}`);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <FigmaPage cod="46" title="Quản lý người dùng" subtitle="Chỉ dành cho tài khoản Admin.">
      <FigmaAlert type="success">{msg}</FigmaAlert>
      <FigmaAlert type="error">{error}</FigmaAlert>
      <FigmaCard title="Thêm người dùng">
        <form onSubmit={handleCreate}>
          <div className="fm-form-grid">
            <FigmaField label="Username">
              <FigmaInput value={username} onChange={(e) => setUsername(e.target.value)} required />
            </FigmaField>
            <FigmaField label="Password">
              <FigmaInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FigmaField>
            <FigmaField label="Họ tên">
              <FigmaInput value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </FigmaField>
            <FigmaField label="Vai trò">
              <FigmaSelect value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="doctor">Bác sĩ</option>
                <option value="customer">Khách hàng (mua thuốc / theo dõi lịch)</option>
                <option value="admin">Quản trị viên</option>
              </FigmaSelect>
            </FigmaField>
            {role === 'customer' && (
              <FigmaField label="Số điện thoại">
                <FigmaInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="090..." />
              </FigmaField>
            )}
          </div>
          <button type="submit" className="fm-btn fm-btn--primary" style={{ marginTop: '1rem' }}>
            Tạo tài khoản
          </button>
        </form>
      </FigmaCard>
      <FigmaCard title={`Danh sách (${users.length})`}>
        <div className="fm-patient-grid">
          {users.map((u) => (
            <div key={u.id} className="fm-patient">
              <div className="fm-patient__main">
                <FigmaPatientAvatar name={u.fullName} />
                <div>
                  <div className="fm-patient__name">{u.fullName}</div>
                  <div className="fm-patient__meta">@{u.username}</div>
                  <FigmaBadge text={ROLE_LABELS[u.role] || u.role} />
                  {u.role === 'customer' && u.patientId && (
                    <div className="fm-patient__meta" style={{ marginTop: '0.25rem' }}>
                      Mã hồ sơ: {u.patientId}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="fm-btn fm-btn--danger"
                disabled={deletingId === u.id || u.id === currentUser?.id}
                onClick={() => handleDelete(u)}
                title={u.id === currentUser?.id ? 'Không thể xóa chính mình' : 'Xóa người dùng'}
              >
                {deletingId === u.id ? '...' : 'Xóa'}
              </button>
            </div>
          ))}
        </div>
      </FigmaCard>
    </FigmaPage>
  );
}
