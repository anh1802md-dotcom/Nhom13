/**
 * Bổ sung: Quản lý tất cả bệnh nhân — giao diện kiểu Figma
 */
import { useEffect, useState, useMemo } from 'react';
import { apiFetch } from './api';
import { getActivePatientId, setActivePatientId } from './extras/patientStore';
import {
  FigmaPageHeader,
  FigmaStats,
  FigmaStat,
  FigmaCard,
  FigmaAlert,
  FigmaButton,
  FigmaSearch,
  FigmaBadge,
  FigmaPatientAvatar,
  FigmaEmpty,
  FigmaLinkButton,
} from './extras/figma/FigmaUI';

export default function COD1_Bonus_ManageAllPatients() {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeId, setActiveId] = useState(getActivePatientId());
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  function loadList() {
    setLoading(true);
    apiFetch('/api/bonus/manage/patients')
      .then((r) => setPatients(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  async function loadDetail(id) {
    try {
      const r = await apiFetch(`/api/bonus/manage/patients/${id}`);
      setSelected(r.data);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.fullName?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        p.phone?.includes(q)
    );
  }, [patients, search]);

  const stats = useMemo(
    () => ({
      total: patients.length,
      treatment: patients.filter((p) => p.treatmentStatus === 'in_treatment').length,
      canDelete: patients.filter((p) => p.canDelete).length,
    }),
    [patients]
  );

  function handleSelect(id) {
    setActivePatientId(id);
    setActiveId(id);
    setMsg(`Đang quản lý bệnh nhân: ${id}`);
    loadDetail(id);
  }

  async function handleDelete(p) {
    if (!p.canDelete) {
      setError(p.deleteReason || 'Không thể xóa bệnh nhân này');
      return;
    }
    const ok = window.confirm(
      `Xóa bệnh nhân "${p.fullName}" (${p.id})?\nChỉ xóa khi đã hết quá trình dùng thuốc.`
    );
    if (!ok) return;

    setDeletingId(p.id);
    setError('');
    setMsg('');
    try {
      await apiFetch(`/api/bonus/manage/patients/${p.id}`, { method: 'DELETE' });
      setMsg(`Đã xóa bệnh nhân ${p.fullName}`);
      if (activeId === p.id) {
        setActivePatientId('p1');
        setActiveId('p1');
      }
      if (selected?.patient?.id === p.id) setSelected(null);
      loadList();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <FigmaPageHeader
        eyebrow="Bổ sung · Quản lý BN"
        title="Quản lý tất cả bệnh nhân"
        subtitle="Bác sĩ và Admin xem toàn bộ hồ sơ, chọn bệnh nhân đang theo dõi, xóa khi đã hết liệu trình thuốc."
      />

      <FigmaStats>
        <FigmaStat value={stats.total} label="Tổng bệnh nhân" />
        <FigmaStat value={stats.treatment} label="Đang điều trị" />
        <FigmaStat value={stats.canDelete} label="Có thể xóa" />
      </FigmaStats>

      <FigmaCard highlight>
        <strong>Đang quản lý:</strong>{' '}
        <span className="fm-badge fm-badge--active">{activeId}</span>
        <span style={{ marginLeft: '0.75rem' }}>
          <FigmaLinkButton to="/them-benh-nhan">+ Thêm bệnh nhân</FigmaLinkButton>
        </span>
      </FigmaCard>

      <FigmaAlert type="success">{msg}</FigmaAlert>
      <FigmaAlert type="error">{error}</FigmaAlert>

      <FigmaCard title={`Danh sách (${filtered.length})`}>
        <div className="fm-toolbar">
          <FigmaSearch value={search} onChange={setSearch} />
          <FigmaButton variant="secondary" onClick={loadList} disabled={loading}>
            ↻ Làm mới
          </FigmaButton>
        </div>

        {loading ? (
          <p className="fm-loading">Đang tải dữ liệu...</p>
        ) : filtered.length === 0 ? (
          <FigmaEmpty icon="👥" message="Không tìm thấy bệnh nhân" />
        ) : (
          <div className="fm-patient-grid">
            {filtered.map((p) => (
              <div
                key={p.id}
                className={`fm-patient ${activeId === p.id ? 'fm-patient--selected' : ''}`}
              >
                <div className="fm-patient__main">
                  <FigmaPatientAvatar name={p.fullName} />
                  <div>
                    <div className="fm-patient__name">{p.fullName}</div>
                    <div className="fm-patient__meta">
                      {p.id} · {p.phone || 'Chưa có SĐT'} · {p.medicationCount} đơn thuốc
                    </div>
                    <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <FigmaBadge status={p.treatmentStatus} />
                      {activeId === p.id && (
                        <span className="fm-badge fm-badge--active">Đang chọn</span>
                      )}
                    </div>
                    <p className="fm-patient__meta" style={{ marginTop: '0.35rem' }}>
                      {p.deleteReason}
                    </p>
                  </div>
                </div>
                <div className="fm-btn-group" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <FigmaButton
                    variant={activeId === p.id ? 'success' : 'secondary'}
                    onClick={() => handleSelect(p.id)}
                  >
                    {activeId === p.id ? '✓ Đang quản lý' : 'Chọn'}
                  </FigmaButton>
                  <FigmaButton variant="ghost" onClick={() => loadDetail(p.id)}>
                    Chi tiết
                  </FigmaButton>
                  <FigmaButton
                    variant="danger"
                    disabled={!p.canDelete || deletingId === p.id}
                    onClick={() => handleDelete(p)}
                    title={p.deleteReason}
                  >
                    {deletingId === p.id ? '...' : 'Xóa'}
                  </FigmaButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </FigmaCard>

      {selected && (
        <FigmaCard title={`Chi tiết · ${selected.patient.fullName}`} className="fm-detail">
          <p className="fm-patient__meta">Mã hồ sơ: {selected.patient.id}</p>
          <p style={{ marginTop: '0.5rem' }}>
            {selected.canDelete ? (
              <span style={{ color: 'var(--fm-success)', fontWeight: 600 }}>
                ✓ Có thể xóa — {selected.deleteReason}
              </span>
            ) : (
              <span style={{ color: 'var(--fm-danger)', fontWeight: 600 }}>
                ✕ Không thể xóa — {selected.deleteReason}
              </span>
            )}
          </p>

          <div className="fm-detail__section">
            <h3 className="fm-card__title">Đơn thuốc ({selected.medications.length})</h3>
            <div className="fm-pill-list">
              {selected.medications.length === 0 ? (
                <p className="fm-patient__meta">Chưa có thuốc</p>
              ) : (
                selected.medications.map((m) => (
                  <div key={m.id} className="fm-pill">
                    <strong>{m.drugName}</strong>
                    <br />
                    <span className="fm-patient__meta">
                      {m.startDate} → {m.endDate || 'chưa kết thúc'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="fm-detail__section">
            <h3 className="fm-card__title">Lịch khám ({selected.appointments.length})</h3>
            <div className="fm-pill-list">
              {selected.appointments.map((a) => (
                <div key={a.id} className="fm-pill">
                  {a.date} {a.time} — {a.reason}
                </div>
              ))}
            </div>
          </div>

          <div className="fm-detail__section">
            <h3 className="fm-card__title">Lịch sử khám ({selected.examinations.length})</h3>
            <div className="fm-pill-list">
              {selected.examinations.map((e) => (
                <div key={e.id} className="fm-pill">
                  {e.date} — {e.diagnosis}
                </div>
              ))}
            </div>
          </div>
        </FigmaCard>
      )}
    </>
  );
}
