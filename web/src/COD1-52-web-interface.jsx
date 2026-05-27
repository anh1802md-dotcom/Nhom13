/**
 * COD1-52: Dashboard — Giao diện quản lý phòng khám
 */
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { apiFetch, getCurrentPatientId } from './api';
import {
  FigmaPage,
  FigmaStats,
  FigmaStat,
  FigmaCard,
  FigmaShortcutGrid,
  FigmaWelcome,
} from './extras/figma/FigmaUI';

export default function COD1_52_WebInterface() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ patients: 0, meds: 0, appointments: 0, exams: 0 });

  useEffect(() => {
    Promise.all([
      apiFetch('/api/patients'),
      apiFetch(`/api/medications?patientId=${getCurrentPatientId()}`),
      apiFetch(`/api/appointments?patientId=${getCurrentPatientId()}`),
      apiFetch(`/api/examinations?patientId=${getCurrentPatientId()}`),
    ])
      .then(([p, m, a, e]) => {
        setStats({
          patients: p.data.length,
          meds: m.data.length,
          appointments: a.data.length,
          exams: e.data.length,
        });
      })
      .catch(() => {});
  }, []);

  const shortcuts = [
    { to: '/ho-so', label: 'Hồ sơ bệnh nhân', desc: 'Xem & cập nhật', icon: '👤' },
    { to: '/them-thuoc', label: 'Kê đơn thuốc', desc: 'Thêm thuốc mới', icon: '💊' },
    { to: '/dat-lich', label: 'Đặt lịch khám', desc: 'Lịch hẹn mới', icon: '📅' },
    { to: '/quan-ly-benh-nhan', label: 'Quản lý BN', desc: 'Tất cả bệnh nhân', icon: '👥' },
    { to: '/thong-bao', label: 'Nhắc thuốc', desc: 'Thông báo', icon: '🔔' },
  ];

  return (
    <FigmaPage title="Dashboard" subtitle="Tổng quan hoạt động phòng khám hôm nay.">
      <FigmaWelcome
        title={`Xin chào, ${user?.fullName || 'Bác sĩ'} 👋`}
        subtitle="Theo dõi bệnh nhân, đơn thuốc và lịch khám ngay trên bảng điều khiển."
      />
      <FigmaStats>
        <FigmaStat value={stats.patients} label="Bệnh nhân" icon="👥" tone="teal" />
        <FigmaStat value={stats.meds} label="Đơn thuốc" icon="💊" tone="blue" />
        <FigmaStat value={stats.appointments} label="Lịch hẹn" icon="📅" tone="orange" />
        <FigmaStat value={stats.exams} label="Lần khám" icon="🏥" tone="purple" />
      </FigmaStats>
      <FigmaCard title="Truy cập nhanh">
        <FigmaShortcutGrid items={shortcuts} />
      </FigmaCard>
    </FigmaPage>
  );
}
