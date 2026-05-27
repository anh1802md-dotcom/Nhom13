/**
 * COD1-38: Cập nhật hồ sơ bệnh nhân
 */
import { useEffect, useState } from 'react';
import { apiFetch, getCurrentPatientId } from './api';
import {
  FigmaPage,
  FigmaCard,
  FigmaAlert,
  FigmaLoading,
  FigmaField,
  FigmaInput,
  FigmaSubmit,
} from './extras/figma/FigmaUI';

export default function COD1_38_UpdatePatientProfile() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch(`/api/patients/${getCurrentPatientId()}`)
      .then((r) => setForm(r.data))
      .catch((e) => setError(e.message));
  }, []);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');
    try {
      await apiFetch(`/api/patients/${form.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setMsg('Đã cập nhật hồ sơ bệnh nhân thành công!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!form) return <FigmaLoading />;

  const fields = [
    ['fullName', 'Họ tên'],
    ['dateOfBirth', 'Ngày sinh'],
    ['gender', 'Giới tính'],
    ['phone', 'Số điện thoại'],
    ['address', 'Địa chỉ'],
    ['bloodType', 'Nhóm máu'],
    ['allergies', 'Dị ứng'],
    ['medicalHistory', 'Tiền sử bệnh'],
  ];

  return (
    <FigmaPage cod="38" title="Cập nhật hồ sơ" subtitle="Chỉnh sửa thông tin bệnh nhân.">
      <FigmaAlert type="success">{msg}</FigmaAlert>
      <FigmaAlert type="error">{error}</FigmaAlert>
      <FigmaCard title="Thông tin bệnh nhân">
        <form onSubmit={handleSave}>
          <div className="fm-form-grid">
            {fields.map(([key, label]) => (
              <FigmaField key={key} label={label}>
                <FigmaInput value={form[key] || ''} onChange={(e) => update(key, e.target.value)} />
              </FigmaField>
            ))}
          </div>
          <FigmaSubmit loading={loading} label="Lưu thay đổi" loadingLabel="Đang lưu..." />
        </form>
      </FigmaCard>
    </FigmaPage>
  );
}
