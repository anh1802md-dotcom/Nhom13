/**
 * COD1-37: Xem hồ sơ bệnh nhân
 */
import { useEffect, useState } from 'react';
import { apiFetch, getCurrentPatientId } from './api';
import {
  FigmaPage,
  FigmaCard,
  FigmaAlert,
  FigmaLoading,
  FigmaInfoGrid,
  FigmaLinkButton,
  FigmaPatientAvatar,
} from './extras/figma/FigmaUI';

export default function COD1_37_ViewPatientProfile() {
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/patients/${getCurrentPatientId()}`)
      .then((r) => setPatient(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FigmaLoading />;
  if (error) return <FigmaAlert type="error">{error}</FigmaAlert>;

  const fields = patient
    ? [
        ['Họ tên', patient.fullName],
        ['Ngày sinh', patient.dateOfBirth],
        ['Giới tính', patient.gender],
        ['Số điện thoại', patient.phone],
        ['Địa chỉ', patient.address],
        ['Nhóm máu', patient.bloodType],
        ['Dị ứng', patient.allergies],
        ['Tiền sử bệnh', patient.medicalHistory],
      ]
    : [];

  return (
    <FigmaPage cod="37" title="Hồ sơ bệnh nhân" subtitle={`Mã bệnh nhân demo: ${getCurrentPatientId()}`}>
      {!patient ? (
        <FigmaAlert type="error">Không có dữ liệu</FigmaAlert>
      ) : (
        <FigmaCard>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <FigmaPatientAvatar name={patient.fullName} />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{patient.fullName}</h2>
              <p className="fm-patient__meta">#{patient.id}</p>
            </div>
          </div>
          <FigmaInfoGrid items={fields} />
          <FigmaLinkButton to="/cap-nhat-ho-so">✏️ Chỉnh sửa hồ sơ</FigmaLinkButton>
        </FigmaCard>
      )}
    </FigmaPage>
  );
}
