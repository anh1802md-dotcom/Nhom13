/**
 * Bổ sung: Dashboard khách hàng — cùng giao diện Figma với bác sĩ
 */
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { apiFetch } from './api';
import {
  FigmaPage,
  FigmaStats,
  FigmaStat,
  FigmaCard,
  FigmaShortcutGrid,
  FigmaWelcome,
  FigmaAlert,
} from './extras/figma/FigmaUI';

export default function COD1_Bonus_CustomerPortal() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ meds: 0, appointments: 0, exams: 0 });
  const [patientId, setPatientId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/customer/profile')
      .then((r) => {
        const pid = r.data?.patient?.id || user?.patientId || '';
        setPatientId(pid);
        return Promise.all([
          apiFetch('/api/customer/medications'),
          pid
            ? apiFetch(`/api/appointments?patientId=${pid}`).catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
          pid
            ? apiFetch(`/api/examinations?patientId=${pid}`).catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
        ]);
      })
      .then(([medsRes, aptsRes, examsRes]) => {
        setStats({
          meds: medsRes.data?.length ?? 0,
          appointments: aptsRes.data?.length ?? 0,
          exams: examsRes.data?.length ?? 0,
        });
      })
      .catch((e) => setError(e.message));
  }, [user?.patientId]);

  const shortcuts = [
    { to: '/ho-so', label: 'Hồ sơ của tôi', desc: 'Thông tin cá nhân', icon: '👤' },
    { to: '/lich-su-thuoc', label: 'Lịch sử thuốc', desc: 'Đơn đã mua', icon: '💊' },
    { to: '/thong-bao', label: 'Nhắc uống thuốc', desc: 'Bật thông báo', icon: '🔔' },
    { to: '/dat-lich', label: 'Đặt lịch khám', desc: 'Lịch hẹn mới', icon: '📅' },
    { to: '/lich-kham', label: 'Lịch hẹn', desc: 'Xem lịch đã đặt', icon: '🗓️' },
    { to: '/lich-su-kham', label: 'Lịch sử khám', desc: 'Các lần khám', icon: '🏥' },
  ];

  return (
    <FigmaPage title="Trang khách hàng" subtitle="Theo dõi thuốc và lịch khám sau khi mua tại phòng khám.">
      <FigmaAlert type="error">{error}</FigmaAlert>
      <FigmaWelcome
        title={`Xin chào, ${user?.fullName || 'Khách hàng'} 👋`}
        subtitle={
          patientId
            ? `Mã hồ sơ: ${patientId} — xem lịch dùng thuốc và nhắc uống bên dưới.`
            : 'Liên hệ quầy thuốc nếu chưa thấy đơn thuốc trên hệ thống.'
        }
      />
      <FigmaStats>
        <FigmaStat value={stats.meds} label="Đơn thuốc" icon="💊" tone="teal" />
        <FigmaStat value={stats.appointments} label="Lịch hẹn" icon="📅" tone="orange" />
        <FigmaStat value={stats.exams} label="Lần khám" icon="🏥" tone="purple" />
      </FigmaStats>
      <FigmaCard title="Truy cập nhanh">
        <FigmaShortcutGrid items={shortcuts} />
      </FigmaCard>
    </FigmaPage>
  );
}
