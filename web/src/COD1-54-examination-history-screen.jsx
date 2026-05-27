/**
 * COD1-54: Lịch sử khám
 */
import { useEffect, useState } from 'react';
import { apiFetch, getCurrentPatientId } from './api';
import {
  FigmaPage,
  FigmaCard,
  FigmaAlert,
  FigmaLoading,
  FigmaEmpty,
  FigmaListCard,
} from './extras/figma/FigmaUI';

export default function COD1_54_ExaminationHistoryScreen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/api/examinations?patientId=${getCurrentPatientId()}`)
      .then((r) => setList(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <FigmaPage cod="54" title="Lịch sử khám bệnh" subtitle="Các lần khám và chẩn đoán trước đây.">
      <FigmaAlert type="error">{error}</FigmaAlert>
      <FigmaCard>
        {loading ? (
          <FigmaLoading />
        ) : list.length === 0 ? (
          <FigmaEmpty icon="🏥" message="Chưa có lịch sử khám" />
        ) : (
          <div className="fm-pill-list">
            {list.map((item) => (
              <FigmaListCard
                key={item.id}
                title={item.date}
                meta={`${item.doctorName} · ${item.clinic}`}
                accent
              >
                <div
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.65rem',
                    background: 'var(--fm-success-soft)',
                    borderRadius: 'var(--fm-radius-md)',
                  }}
                >
                  <small className="fm-patient__meta">Chẩn đoán</small>
                  <p style={{ fontWeight: 500 }}>{item.diagnosis}</p>
                </div>
                {item.notes && <p className="fm-patient__meta" style={{ marginTop: '0.5rem' }}>{item.notes}</p>}
              </FigmaListCard>
            ))}
          </div>
        )}
      </FigmaCard>
    </FigmaPage>
  );
}
