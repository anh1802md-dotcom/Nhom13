/**
 * COD1-41: Đặt lịch khám
 */
import { useState } from 'react';
import { apiFetch, getCurrentPatientId } from './api';
import {
  FigmaPage,
  FigmaCard,
  FigmaAlert,
  FigmaField,
  FigmaInput,
  FigmaSubmit,
} from './extras/figma/FigmaUI';

export default function COD1_41_BookAppointment() {
  const [form, setForm] = useState({
    patientId: getCurrentPatientId(),
    doctorName: 'BS. Nguyễn Văn A',
    clinic: 'Phòng khám Đa khoa',
    date: '2026-06-15',
    time: '10:00',
    reason: '',
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');
    try {
      await apiFetch('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setMsg('Đã đặt lịch khám thành công!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    ['doctorName', 'Bác sĩ'],
    ['clinic', 'Cơ sở khám'],
    ['date', 'Ngày'],
    ['time', 'Giờ'],
    ['reason', 'Lý do khám'],
  ];

  return (
    <FigmaPage cod="41" title="Đặt lịch khám" subtitle="Đăng ký lịch tái khám cho bệnh nhân.">
      <FigmaAlert type="success">{msg}</FigmaAlert>
      <FigmaAlert type="error">{error}</FigmaAlert>
      <FigmaCard title="Lịch khám mới">
        <form onSubmit={handleSubmit}>
          <div className="fm-form-grid">
            {fields.map(([key, label]) => (
              <FigmaField key={key} label={label}>
                <FigmaInput
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                  required={key === 'date' || key === 'time'}
                />
              </FigmaField>
            ))}
          </div>
          <FigmaSubmit loading={loading} label="Xác nhận đặt lịch" />
        </form>
      </FigmaCard>
    </FigmaPage>
  );
}
