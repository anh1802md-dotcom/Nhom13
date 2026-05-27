/**
 * COD1-42: Xem lịch khám
 */
import { useEffect, useState } from 'react';
import { apiFetch, getCurrentPatientId } from './api';
import {
  FigmaPage,
  FigmaCard,
  FigmaAlert,
  FigmaButton,
  FigmaLoading,
  FigmaEmpty,
  FigmaBadge,
  FigmaListCard,
} from './extras/figma/FigmaUI';

export default function COD1_42_ViewAppointments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    apiFetch(`/api/appointments?patientId=${getCurrentPatientId()}`)
      .then((r) => setList(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <FigmaPage
      cod="42"
      title="Lịch khám"
      subtitle="Các cuộc hẹn đã đặt"
      actions={
        <FigmaButton variant="secondary" onClick={load} disabled={loading}>
          ↻ Làm mới
        </FigmaButton>
      }
    >
      <FigmaAlert type="error">{error}</FigmaAlert>
      <FigmaCard>
        {loading ? (
          <FigmaLoading />
        ) : list.length === 0 ? (
          <FigmaEmpty icon="📅" message="Chưa có lịch khám" />
        ) : (
          <div className="fm-pill-list">
            {list.map((item) => (
              <FigmaListCard
                key={item.id}
                title={`${item.date} — ${item.time}`}
                meta={`${item.doctorName} · ${item.clinic}`}
                accent
              >
                <p style={{ marginTop: '0.35rem' }}>Lý do: {item.reason}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  <FigmaBadge text={item.status} />
                </div>
              </FigmaListCard>
            ))}
          </div>
        )}
      </FigmaCard>
    </FigmaPage>
  );
}
