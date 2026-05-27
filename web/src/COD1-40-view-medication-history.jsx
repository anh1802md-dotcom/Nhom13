/**
 * COD1-40: Xem lịch sử thuốc
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
  FigmaListCard,
} from './extras/figma/FigmaUI';

export default function COD1_40_ViewMedicationHistory() {
  const [list, setList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    apiFetch(`/api/medications?patientId=${getCurrentPatientId()}`)
      .then((r) => setList(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <FigmaPage
      cod="40"
      title="Lịch sử thuốc"
      subtitle={`Danh sách đơn thuốc — BN ${getCurrentPatientId()}`}
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
          <FigmaEmpty icon="💊" message="Chưa có lịch sử thuốc" />
        ) : (
          <div className="fm-pill-list">
            {list.map((item) => (
              <FigmaListCard
                key={item.id}
                title={item.drugName}
                meta={`${item.dosage} — ${item.frequency} · ${item.startDate} → ${item.endDate || 'hiện tại'}`}
                accent
              >
                {item.notes && <p style={{ marginTop: '0.35rem' }}>{item.notes}</p>}
                {item.reminderTimes?.length > 0 && (
                  <p style={{ color: 'var(--fm-success)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                    ⏰ {item.reminderTimes.join(', ')}
                  </p>
                )}
              </FigmaListCard>
            ))}
          </div>
        )}
      </FigmaCard>
    </FigmaPage>
  );
}
