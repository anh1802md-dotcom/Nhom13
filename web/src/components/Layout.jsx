import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BONUS_NAV } from '../extras/navigation';

const STAFF_NAV_GROUPS = [
  {
    title: 'Tổng quan',
    items: [{ to: '/', label: 'Dashboard', icon: '📊', end: true }],
  },
  {
    title: 'Bệnh nhân',
    items: [
      { to: '/ho-so', label: 'Hồ sơ bệnh nhân', icon: '👤', task: '37' },
      { to: '/cap-nhat-ho-so', label: 'Cập nhật hồ sơ', icon: '✏️', task: '38' },
    ],
  },
  {
    title: 'Thuốc & điều trị',
    items: [
      { to: '/them-thuoc', label: 'Kê đơn thuốc', icon: '💊', task: '39' },
      { to: '/lich-su-thuoc', label: 'Lịch sử thuốc', icon: '📋', task: '40' },
      { to: '/man-hinh-thuoc', label: 'Chi tiết thuốc', icon: '🧾', task: '53' },
      { to: '/thong-bao', label: 'Nhắc uống thuốc', icon: '🔔', task: '57' },
    ],
  },
  {
    title: 'Lịch khám',
    items: [
      { to: '/dat-lich', label: 'Đặt lịch', icon: '📅', task: '41' },
      { to: '/lich-kham', label: 'Lịch hẹn', icon: '🗓️', task: '42' },
      { to: '/lich-su-kham', label: 'Lịch sử khám', icon: '🏥', task: '54' },
    ],
  },
];

const CUSTOMER_NAV_GROUPS = [
  {
    title: 'Khách hàng',
    items: [{ to: '/', label: 'Trang chủ', icon: '📊', end: true }],
  },
  {
    title: 'Hồ sơ & thuốc',
    items: [
      { to: '/ho-so', label: 'Hồ sơ của tôi', icon: '👤' },
      { to: '/lich-su-thuoc', label: 'Lịch sử thuốc', icon: '💊' },
      { to: '/thong-bao', label: 'Nhắc uống thuốc', icon: '🔔' },
    ],
  },
  {
    title: 'Lịch khám',
    items: [
      { to: '/dat-lich', label: 'Đặt lịch', icon: '📅' },
      { to: '/lich-kham', label: 'Lịch hẹn', icon: '🗓️' },
      { to: '/lich-su-kham', label: 'Lịch sử khám', icon: '🏥' },
    ],
  },
];

const ROLE_LABELS = {
  admin: 'Quản trị viên',
  doctor: 'Bác sĩ',
  customer: 'Khách hàng',
};

export default function Layout() {
  const { user, logout, isAdmin, isCustomer } = useAuth();
  const canAddPatient = user?.role === 'admin' || user?.role === 'doctor';
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bonusGroup = canAddPatient
    ? {
        title: 'Quản lý phòng khám',
        items: BONUS_NAV.map((n) => ({
          to: n.to,
          label: n.label.replace('Quản lý tất cả BN', 'Tất cả bệnh nhân').replace('Thêm bệnh nhân', 'Thêm BN mới'),
          icon: n.icon,
          task: 'BN',
        })),
      }
    : null;

  const systemGroup = isAdmin
    ? {
        title: 'Hệ thống',
        items: [{ to: '/admin', label: 'Người dùng', icon: '⚙️', task: '46' }],
      }
    : null;

  const groups = isCustomer
    ? CUSTOMER_NAV_GROUPS
    : [...STAFF_NAV_GROUPS, ...(bonusGroup ? [bonusGroup] : []), ...(systemGroup ? [systemGroup] : [])];

  function handleLogout() {
    logout();
    navigate('/dang-nhap');
  }

  const initial = (user?.fullName || user?.username || 'U').charAt(0).toUpperCase();
  const brandSubtitle = isCustomer ? 'Theo dõi thuốc & lịch khám' : 'Quản lý bệnh nhân & thuốc';

  return (
    <div className="fm-shell">
      <div className={`fm-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`fm-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="fm-sidebar__brand">
          <div className="fm-logo">+</div>
          <div>
            <h1>Phòng khám</h1>
            <p>{brandSubtitle}</p>
          </div>
        </div>
        <nav className="fm-sidebar__nav">
          {groups.map((group) => (
            <div key={group.title} className="fm-nav-group">
              <div className="fm-nav-group__title">{group.title}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `fm-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="fm-nav-link__icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.task && <small>{item.task}</small>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="fm-sidebar__footer">
          <button type="button" className="fm-btn fm-btn--danger" style={{ width: '100%' }} onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="fm-main">
        <header className="fm-topbar">
          <div className="fm-topbar__left">
            <button type="button" className="fm-menu-btn" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
            <div>
              <div className="fm-topbar__breadcrumb">
                Phòng khám / <strong>{location.pathname === '/' ? (isCustomer ? 'Trang chủ' : 'Dashboard') : 'Quản lý'}</strong>
              </div>
            </div>
          </div>
          <div className="fm-topbar__search">
            {isCustomer ? '🔍 Tìm thuốc, lịch khám...' : '🔍 Tìm kiếm bệnh nhân, thuốc...'}
          </div>
          <div className="fm-topbar__right">
            <div className="fm-topbar__bell" title="Thông báo">
              🔔
            </div>
            <div className="fm-topbar__userbox">
              <div className="fm-topbar__avatar">{initial}</div>
              <div>
                <span className="fm-topbar__user">{user?.fullName || user?.username}</span>
                <span className="fm-topbar__role">{ROLE_LABELS[user?.role] || user?.role}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="fm-page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
