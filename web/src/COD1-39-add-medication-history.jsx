/**
 * COD1-39: Thêm lịch sử thuốc
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

const initial = {
  patientId: getCurrentPatientId(),
  drugName: '',
  dosage: '',
  frequency: '',
  startDate: '',
  endDate: '',
  notes: '',
  reminderTimes: '08:00,20:00',
};

export default function COD1_39_AddMedicationHistory() {
  const [form, setForm] = useState(initial);
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
      await apiFetch('/api/medications', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          reminderTimes: form.reminderTimes
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      setMsg('Đã thêm lịch sử thuốc thành công!');
      setForm(initial);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    ['drugName', 'Tên thuốc *', true],
    ['dosage', 'Liều lượng', false],
    ['frequency', 'Tần suất', false],
    ['startDate', 'Ngày bắt đầu', false],
    ['endDate', 'Ngày kết thúc', false],
    ['notes', 'Ghi chú', false],
    ['reminderTimes', 'Giờ nhắc (08:00,20:00)', false],
  ];

  return (
    <FigmaPage cod="39" title="Thêm lịch sử thuốc" subtitle={`Bệnh nhân: ${getCurrentPatientId()}`}>
      <FigmaAlert type="success">{msg}</FigmaAlert>
      <FigmaAlert type="error">{error}</FigmaAlert>
      <FigmaCard title="Đơn thuốc mới">
        <form onSubmit={handleSubmit}>
          <div className="fm-form-grid">
            {fields.map(([key, label, req]) => (
              <FigmaField key={key} label={label}>
                <FigmaInput
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                  required={req}
                />
              </FigmaField>
            ))}
          </div>
          <FigmaSubmit loading={loading} label="Thêm thuốc" />
        </form>
      </FigmaCard>
    </FigmaPage>
  );
}
