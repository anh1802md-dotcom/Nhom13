/**
 * COD1-57: Nhận thông báo thuốc
 */
import { useEffect, useState } from 'react';
import { apiFetch, getCurrentPatientId } from './api';
import {
  FigmaPage,
  FigmaCard,
  FigmaAlert,
  FigmaButton,
  FigmaListCard,
} from './extras/figma/FigmaUI';

export default function COD1_57_MedicationNotifications() {
  const [medications, setMedications] = useState([]);
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const [msg, setMsg] = useState('');

  useEffect(() => {
    apiFetch(`/api/medications?patientId=${getCurrentPatientId()}`)
      .then((r) => setMedications(r.data))
      .catch(() => setMedications([]));
  }, []);

  async function requestPermission() {
    if (typeof Notification === 'undefined') {
      setMsg('Trình duyệt không hỗ trợ thông báo');
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    setMsg(result === 'granted' ? 'Đã cấp quyền thông báo' : 'Từ chối quyền thông báo');
  }

  function sendTest() {
    if (permission !== 'granted') {
      setMsg('Hãy cấp quyền thông báo trước');
      return;
    }
    new Notification('Nhắc uống thuốc (thử)', {
      body: 'Đây là thông báo thử — kiểm tra hoạt động',
    });
    setMsg('Đã gửi thông báo thử');
  }

  function remindNow(med) {
    if (permission !== 'granted') {
      setMsg('Hãy cấp quyền thông báo trước');
      return;
    }
    new Notification('Nhắc uống thuốc', {
      body: `${med.drugName} — ${med.dosage || 'theo chỉ định'}`,
    });
    setMsg(`Đã nhắc: ${med.drugName}`);
  }

  function scheduleReminder(med, time) {
    if (permission !== 'granted') {
      setMsg('Hãy cấp quyền thông báo trước');
      return;
    }
    const [h, m] = time.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const delay = target.getTime() - now.getTime();
    setTimeout(() => {
      new Notification('Nhắc uống thuốc', { body: `${med.drugName} — ${med.dosage}` });
    }, delay);
    setMsg(`Sẽ nhắc ${med.drugName} lúc ${time}`);
  }

  return (
    <FigmaPage cod="57" title="Nhắc uống thuốc" subtitle="Thông báo trình duyệt theo lịch uống thuốc.">
      <FigmaAlert type="success">{msg}</FigmaAlert>
      <FigmaCard title="Quyền thông báo">
        <p className="fm-patient__meta">Trạng thái: {permission}</p>
        <div className="fm-btn-group" style={{ marginTop: '0.75rem' }}>
          <FigmaButton variant="primary" onClick={requestPermission}>
            Cấp quyền
          </FigmaButton>
          <FigmaButton variant="secondary" onClick={sendTest}>
            Gửi thử
          </FigmaButton>
        </div>
      </FigmaCard>
      {medications.map((med) => (
        <FigmaCard key={med.id} title={med.drugName}>
          <FigmaListCard
            meta={`Giờ nhắc: ${(med.reminderTimes || []).join(', ') || 'Chưa có'}`}
          />
          <div className="fm-btn-group" style={{ marginTop: '0.75rem' }}>
            <FigmaButton variant="success" onClick={() => remindNow(med)}>
              Nhắc ngay
            </FigmaButton>
            {(med.reminderTimes || []).map((time) => (
              <FigmaButton key={time} variant="ghost" onClick={() => scheduleReminder(med, time)}>
                Đặt {time}
              </FigmaButton>
            ))}
          </div>
        </FigmaCard>
      ))}
    </FigmaPage>
  );
}
