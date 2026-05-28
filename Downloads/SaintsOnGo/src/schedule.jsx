// Schedule screen — Saints on Go

function ScheduleScreen() {
  const [activeDay, setActiveDay] = useState(0);
  const days = window.SOG_DATA.scheduleDays;
  const day = days[activeDay];

  const statusColor = (s) => {
    if (s === 'In transit') return { bg: '#FCEEEC', fg: '#C9362F' };
    if (s === 'Departing') return { bg: '#FEF3C7', fg: '#92400E' };
    return { bg: '#EFF6FF', fg: '#1D4ED8' };
  };

  return (
    <div className="sog-screen sog-schedule">
      <div className="sog-screen-head">
        <h1>Schedule</h1>
        <p>Today's runs and what's coming up next.</p>
      </div>

      <div className="sog-segmented">
        {days.map((d, i) => (
          <button
            key={d.label}
            className={`sog-seg ${i === activeDay ? 'is-active' : ''}`}
            onClick={() => setActiveDay(i)}
          >
            <span className="sog-seg-label">{d.label}</span>
            <span className="sog-seg-date">{d.date}</span>
          </button>
        ))}
      </div>

      <div className="sog-timeline">
        {day.runs.map((r, i) => {
          const col = statusColor(r.status);
          return (
            <div key={i} className="sog-tl-row sog-anim-fade-up" style={{ animationDelay: `${i * 35}ms` }}>
              <div className="sog-tl-time">
                <div className="sog-tl-hour">{r.time.split(' ')[0]}</div>
                <div className="sog-tl-ampm">{r.time.split(' ')[1]}</div>
              </div>
              <div className="sog-tl-rail">
                <div className="sog-tl-dot"/>
                {i < day.runs.length - 1 && <div className="sog-tl-line"/>}
              </div>
              <div className="sog-tl-card">
                <div className="sog-tl-bus">
                  <span className="sog-tl-bus-ico"><Icon.Bus size={16} color={SOG_RED}/></span>
                  <strong>{r.bus}</strong>
                  <span className="sog-tl-route">· {r.route}</span>
                </div>
                <div className="sog-tl-status" style={{ background: col.bg, color: col.fg }}>
                  {r.status}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.ScheduleScreen = ScheduleScreen;
