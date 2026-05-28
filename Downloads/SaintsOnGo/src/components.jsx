// Shared visual atoms for Saints on Go

const SOG_RED = '#E5443D';
const SOG_RED_DARK = '#C9362F';
const SOG_RED_LIGHT = '#FCEEEC';

// ─── Saint George's crest (provided asset) ───
function SaintsCrest({ size = 96 }) {
  return (
    <img
      src="assets/crest.png"
      alt="Saint George's School crest"
      width={size}
      height={size * (382/680) * (680/382)}
      style={{
        display: 'block',
        height: 'auto',
        width: size,
        filter: 'drop-shadow(0 6px 16px rgba(201,54,47,0.18))',
        userSelect: 'none',
        WebkitUserDrag: 'none',
      }}
      draggable={false}
    />
  );
}

// ─── Tiny icons (line, 24px viewBox) ───
const Icon = {
  Navigation: ({ size = 22, color = 'currentColor', filled = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l19-9-9 19-2-8-8-2z"/>
    </svg>
  ),
  Clock: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  ),
  Settings: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Bus: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v11"/>
      <path d="M3 17h18v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
      <line x1="5" y1="11" x2="19" y2="11"/>
      <circle cx="8" cy="15" r="0.5" fill={color}/>
      <circle cx="16" cy="15" r="0.5" fill={color}/>
    </svg>
  ),
  Locate: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="5"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="5" y2="12"/>
      <line x1="19" y1="12" x2="22" y2="12"/>
      <circle cx="12" cy="12" r="7"/>
      <circle cx="12" cy="12" r="2" fill={color} stroke="none"/>
    </svg>
  ),
  Chevron: ({ size = 18, color = 'currentColor', dir = 'right' }) => {
    const rot = { right: 0, down: 90, left: 180, up: 270 }[dir];
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rot}deg)` }}>
        <polyline points="9 6 15 12 9 18"/>
      </svg>
    );
  },
  User: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>
    </svg>
  ),
  Bell: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>
    </svg>
  ),
  Eye: ({ size = 18, color = 'currentColor', off = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
      <circle cx="12" cy="12" r="3"/>
      {off && <line x1="3" y1="3" x2="21" y2="21"/>}
    </svg>
  ),
  Signal: ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M2 17c4-4 8-4 12 0M5 14c3-3 6-3 9 0M8 11c1.5-1.5 3-1.5 4.5 0"/>
      <circle cx="11" cy="20" r="1.5" fill={color} stroke="none"/>
    </svg>
  ),
  Check: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ArrowLeft: ({ size = 22, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
};

// ─── Bottom tab bar ───
function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'track', label: 'Track', Ico: Icon.Navigation },
    { id: 'schedule', label: 'Schedule', Ico: Icon.Clock },
    { id: 'settings', label: 'Settings', Ico: Icon.Settings },
  ];
  return (
    <div className="sog-tabbar">
      {tabs.map(({ id, label, Ico }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="sog-tab"
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={`sog-tab-ico ${isActive ? 'is-active' : ''}`}>
              <Ico size={22} color={isActive ? SOG_RED : '#9CA3AF'} filled={isActive && id === 'track'}/>
            </span>
            <span className={`sog-tab-label ${isActive ? 'is-active' : ''}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Toggle switch ───
function Toggle({ checked, onChange, color = SOG_RED }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="sog-toggle"
      style={{ background: checked ? color : '#E5E7EB' }}
      aria-pressed={checked}
    >
      <span className="sog-toggle-knob" style={{ transform: `translateX(${checked ? 22 : 2}px)` }}/>
    </button>
  );
}

// ─── Pill button ───
function PillButton({ children, onClick, variant = 'primary', disabled, loading, full }) {
  const cls = `sog-btn sog-btn-${variant} ${full ? 'is-full' : ''} ${loading ? 'is-loading' : ''}`;
  return (
    <button className={cls} onClick={onClick} disabled={disabled || loading}>
      {loading ? <span className="sog-spinner"/> : children}
    </button>
  );
}

Object.assign(window, {
  SOG_RED, SOG_RED_DARK, SOG_RED_LIGHT,
  SaintsCrest, Icon, BottomNav, Toggle, PillButton,
});
