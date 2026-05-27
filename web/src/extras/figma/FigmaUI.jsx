/**
 * Component UI kiểu Figma — toàn ứng dụng
 */
import { Link } from 'react-router-dom';

export function FigmaPageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="fm-header">
      {eyebrow && <span className="fm-header__eyebrow">{eyebrow}</span>}
      <h1 className="fm-header__title">{title}</h1>
      {subtitle && <p className="fm-header__sub">{subtitle}</p>}
    </header>
  );
}

export function FigmaPage({ cod, title, subtitle, children, actions }) {
  return (
    <div className="figma-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <FigmaPageHeader
          eyebrow={cod ? `COD1-${cod}` : undefined}
          title={title}
          subtitle={subtitle}
        />
        {actions}
      </div>
      {children}
    </div>
  );
}

export function FigmaStat({ value, label, icon, tone = 'teal' }) {
  if (icon) {
    return (
      <div className="fm-stat fm-stat--icon">
        <div>
          <div className="fm-stat__label">{label}</div>
          <div className="fm-stat__value">{value}</div>
        </div>
        <div className={`fm-stat__icon fm-stat__icon--${tone}`}>{icon}</div>
      </div>
    );
  }
  return (
    <div className="fm-stat">
      <div className="fm-stat__value">{value}</div>
      <div className="fm-stat__label">{label}</div>
    </div>
  );
}

export function FigmaWelcome({ title, subtitle }) {
  return (
    <div className="fm-welcome">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

export function FigmaStats({ children }) {
  return <div className="fm-stats">{children}</div>;
}

export function FigmaCard({ title, children, highlight, className = '' }) {
  return (
    <div className={`fm-card ${highlight ? 'fm-card--highlight' : ''} ${className}`}>
      {title && <h2 className="fm-card__title">{title}</h2>}
      {children}
    </div>
  );
}

export function FigmaAlert({ type, children }) {
  if (!children) return null;
  const icon = type === 'success' ? '✓' : '⚠';
  return (
    <div className={`fm-alert fm-alert--${type}`}>
      <span>{icon}</span>
      <span>{children}</span>
    </div>
  );
}

export function FigmaButton({ variant = 'primary', children, className = '', ...props }) {
  return (
    <button type="button" className={`fm-btn fm-btn--${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function FigmaSearch({ value, onChange, placeholder = 'Tìm kiếm...' }) {
  return (
    <div className="fm-search">
      <span className="fm-search__icon">🔍</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function FigmaBadge({ status, text }) {
  if (text) return <span className="fm-badge fm-badge--active">{text}</span>;
  const map = {
    in_treatment: { cls: 'treatment', label: 'Đang điều trị' },
    finished: { cls: 'finished', label: 'Hết liệu trình' },
    no_medication: { cls: 'none', label: 'Chưa có thuốc' },
  };
  const s = map[status] || map.no_medication;
  return <span className={`fm-badge fm-badge--${s.cls}`}>{s.label}</span>;
}

export function FigmaPatientAvatar({ name }) {
  const letter = (name || '?').charAt(0).toUpperCase();
  return <div className="fm-patient__avatar">{letter}</div>;
}

export function FigmaEmpty({ icon = '📋', message }) {
  return (
    <div className="fm-empty">
      <div className="fm-empty__icon">{icon}</div>
      <p>{message}</p>
    </div>
  );
}

export function FigmaLinkButton({ to, children }) {
  return (
    <Link to={to} className="fm-btn fm-btn--ghost">
      {children}
    </Link>
  );
}

export function FigmaLoading() {
  return <p className="fm-loading">Đang tải dữ liệu...</p>;
}

export function FigmaField({ label, children }) {
  return (
    <div className="fm-field">
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}

export function FigmaInput(props) {
  return <input {...props} />;
}

export function FigmaSelect({ children, ...props }) {
  return <select {...props}>{children}</select>;
}

export function FigmaInfoGrid({ items }) {
  return (
    <div className="fm-form-grid">
      {items.map(([label, value]) => (
        <div key={label} className="fm-field">
          <label>{label}</label>
          <p style={{ fontWeight: 500, marginTop: '0.15rem' }}>{value || '—'}</p>
        </div>
      ))}
    </div>
  );
}

export function FigmaListCard({ title, meta, children, accent }) {
  return (
    <div className="fm-pill" style={accent ? { borderLeft: '3px solid var(--fm-primary)' } : {}}>
      {title && <strong>{title}</strong>}
      {meta && <div className="fm-patient__meta">{meta}</div>}
      {children}
    </div>
  );
}

export function FigmaShortcutGrid({ items }) {
  return (
    <div className="fm-shortcut-grid">
      {items.map((s) => (
        <Link key={s.to} to={s.to} className="fm-shortcut">
          <h3>{s.icon ? `${s.icon} ` : ''}{s.label}</h3>
          <span>{s.desc}</span>
        </Link>
      ))}
    </div>
  );
}

export function FigmaSubmit({ loading, label, loadingLabel = 'Đang xử lý...' }) {
  return (
    <button type="submit" className="fm-btn fm-btn--primary" disabled={loading} style={{ marginTop: '1rem' }}>
      {loading ? loadingLabel : label}
    </button>
  );
}
