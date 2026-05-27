/**
 * COD1-53: Màn hình lịch sử thuốc chi tiết
 */
import { useEffect, useState } from 'react';
import { apiFetch, getCurrentPatientId } from './api';
import { FigmaPage, FigmaCard, FigmaLoading, FigmaEmpty, FigmaListCard } from './extras/figma/FigmaUI';

export default function COD1_53_MedicationHistoryScreen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/medications?patientId=${getCurrentPatientId()}`)
      .then((r) => setList(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <FigmaPage cod="53" title="Màn hình lịch sử thuốc" subtitle="Chi tiết từng đơn thuốc theo thời gian.">
      <FigmaCard highlight>
        <strong>Bệnh nhân:</strong> {getCurrentPatientId()} · <strong>{list.length}</strong> đơn thuốc
      </FigmaCard>
      {loading ? (
        <FigmaLoading />
      ) : list.length === 0 ? (
        <FigmaEmpty icon="📋" message="Chưa có dữ liệu" />
      ) : (
        list.map((item, i) => (
          <FigmaCard key={item.id} title={`#${i + 1} — ${item.drugName}`}>
            <p>
              {item.dosage} — {item.frequency}
            </p>
            <FigmaListCard
              title="Thời gian điều trị"
              meta={`${item.startDate} đến ${item.endDate || 'hiện tại'}`}
            />
            {item.reminderTimes?.length > 0 && (
              <p style={{ color: 'var(--fm-success)', marginTop: '0.5rem' }}>
                ⏰ Nhắc: {item.reminderTimes.join(', ')}
              </p>
            )}
          </FigmaCard>
        ))
      )}
    </FigmaPage>
  );
}
