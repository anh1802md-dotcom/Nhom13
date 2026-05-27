/**
 * Bổ sung: Thêm bệnh nhân — giao diện kiểu Figma
 */
import { useEffect, useState } from 'react';
import { apiFetch } from './api';
import { getActivePatientId, setActivePatientId } from './extras/patientStore';
import {
  FigmaPageHeader,
  FigmaCard,
  FigmaAlert,
  FigmaButton,
  FigmaPatientAvatar,
  FigmaEmpty,
  FigmaLinkButton,
} from './extras/figma/FigmaUI';

const emptyForm = {
  fullName: '',
  dateOfBirth: '',
  gender: 'Nam',
  phone: '',
  address: '',
  bloodType: '',
  allergies: '',
  medicalHistory: '',
};

export default function COD1_Bonus_AddPatient() {
  const [form, setForm] = useState(emptyForm);
  const [patients, setPatients] = useState([]);
  const [activeId, setActiveId] = useState(getActivePatientId());
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function loadPatients() {
    apiFetch('/api/bonus/patients')
      .then((r) => setPatients(r.data))
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    loadPatients();
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');
    try {
      const result = await apiFetch('/api/bonus/patients', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setMsg(`Đã thêm: ${result.data.fullName} (Mã ${result.data.id})`);
      setForm(emptyForm);
      setActivePatientId(result.data.id);
      setActiveId(result.data.id);
      loadPatients();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(id) {
    setActivePatientId(id);
    setActiveId(id);
    setMsg(`Đang quản lý bệnh nhân: ${id}`);
  }

  const fields = [
    ['fullName', 'Họ tên', true],
    ['dateOfBirth', 'Ngày sinh', false],
    ['gender', 'Giới tính', false, 'select'],
    ['phone', 'Số điện thoại', false],
    ['address', 'Địa chỉ', false],
    ['bloodType', 'Nhóm máu', false],
    ['allergies', 'Dị ứng', false],
    ['medicalHistory', 'Tiền sử bệnh', false],
  ];

  return (
    <>
      <FigmaPageHeader
        eyebrow="Bổ sung · Thêm BN"
        title="Thêm bệnh nhân mới"
        subtitle="Tạo hồ sơ bệnh nhân mới dành cho bác sĩ và quản trị viên."
      />

      <FigmaCard highlight>
        <strong>Đang quản lý:</strong>{' '}
        <span className="fm-badge fm-badge--active">{activeId}</span>
        <span style={{ marginLeft: '0.75rem' }}>
          <FigmaLinkButton to="/quan-ly-benh-nhan">← Quản lý tất cả BN</FigmaLinkButton>
        </span>
      </FigmaCard>

      <FigmaAlert type="success">{msg}</FigmaAlert>
      <FigmaAlert type="error">{error}</FigmaAlert>

      <FigmaCard title="Form đăng ký bệnh nhân">
        <form onSubmit={handleSubmit}>
          <div className="fm-form-grid">
            {fields.map(([key, label, required, type]) => (
              <div key={key} className="fm-field">
                <label>{label}</label>
                {type === 'select' || key === 'gender' ? (
                  <select value={form.gender} onChange={(e) => updateField('gender', e.target.value)}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                ) : (
                  <input
                    value={form[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    required={required}
                    placeholder={label}
                  />
                )}
              </div>
            ))}
          </div>
          <button type="submit" className="fm-btn fm-btn--primary" disabled={loading} style={{ marginTop: '1.25rem' }}>
            {loading ? 'Đang lưu...' : '✓ Thêm bệnh nhân'}
          </button>
        </form>
      </FigmaCard>

      <FigmaCard title={`Bệnh nhân trong hệ thống (${patients.length})`}>
        {patients.length === 0 ? (
          <FigmaEmpty icon="📂" message="Chưa có bệnh nhân" />
        ) : (
          <div className="fm-patient-grid">
            {patients.map((p) => (
              <div
                key={p.id}
                className={`fm-patient ${activeId === p.id ? 'fm-patient--selected' : ''}`}
              >
                <div className="fm-patient__main">
                  <FigmaPatientAvatar name={p.fullName} />
                  <div>
                    <div className="fm-patient__name">{p.fullName}</div>
                    <div className="fm-patient__meta">
                      {p.id} · {p.gender} · {p.phone || '—'}
                    </div>
                  </div>
                </div>
                <FigmaButton
                  variant={activeId === p.id ? 'success' : 'secondary'}
                  onClick={() => handleSelect(p.id)}
                >
                  {activeId === p.id ? '✓ Đang quản lý' : 'Chọn'}
                </FigmaButton>
              </div>
            ))}
          </div>
        )}
      </FigmaCard>
    </>
  );
}
