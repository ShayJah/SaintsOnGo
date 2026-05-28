// Settings screen — Saints on Go

function SettingsScreen({ onSignOut }) {
  const s = window.SOG_DATA.student;
  const [name, setName] = useState(s.name);
  const [grade, setGrade] = useState(s.grade);
  const [pickup, setPickup] = useState(s.pickup);
  const [notif, setNotif] = useState(true);
  const [busAlerts, setBusAlerts] = useState(false);
  const [delays, setDelays] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="sog-screen sog-settings">
      <div className="sog-screen-head">
        <h1>Settings</h1>
        <p>Manage your child's profile and alerts.</p>
      </div>

      <div className="sog-profile-card sog-anim-fade-up">
        <div className="sog-avatar">{s.name.split(' ').map(n => n[0]).join('')}</div>
        <div className="sog-profile-meta">
          <div className="sog-profile-name">{s.name}</div>
          <div className="sog-profile-sub">{s.grade} · {s.bus}</div>
        </div>
        <button className="sog-link">Edit</button>
      </div>

      <div className="sog-section-title">Student Information</div>
      <div className="sog-form sog-anim-fade-up">
        <div className="sog-field sog-field-lg">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="sog-field sog-field-lg">
          <label>Grade</label>
          <input value={grade} onChange={(e) => setGrade(e.target.value)}/>
        </div>
        <div className="sog-field sog-field-lg">
          <label>Pickup Stop</label>
          <input value={pickup} onChange={(e) => setPickup(e.target.value)}/>
        </div>
      </div>

      <div className="sog-section-title">Notifications</div>
      <div className="sog-card sog-anim-fade-up">
        <div className="sog-row">
          <div>
            <div className="sog-row-title">Enable Notifications</div>
            <div className="sog-row-sub">Receive all bus updates</div>
          </div>
          <Toggle checked={notif} onChange={setNotif}/>
        </div>
        <div className="sog-row">
          <div>
            <div className="sog-row-title">Bus Approaching Alerts</div>
            <div className="sog-row-sub">Ping when bus is 5 min away</div>
          </div>
          <Toggle checked={busAlerts} onChange={setBusAlerts}/>
        </div>
        <div className="sog-row" style={{ borderBottom: 'none' }}>
          <div>
            <div className="sog-row-title">Delay & Route Changes</div>
            <div className="sog-row-sub">Get notified on route detours</div>
          </div>
          <Toggle checked={delays} onChange={setDelays}/>
        </div>
      </div>

      <div className="sog-section-title">About</div>
      <div className="sog-card sog-anim-fade-up">
        <div className="sog-row">
          <div className="sog-row-title">Help & Support</div>
          <Icon.Chevron color="#C4C4C8"/>
        </div>
        <div className="sog-row">
          <div className="sog-row-title">Privacy Policy</div>
          <Icon.Chevron color="#C4C4C8"/>
        </div>
        <div className="sog-row" style={{ borderBottom: 'none' }}>
          <div className="sog-row-title">Version</div>
          <div className="sog-row-detail">1.2.0</div>
        </div>
      </div>

      <div className="sog-signout-wrap">
        <PillButton variant="outline" full onClick={() => setConfirmOpen(true)}>
          Sign Out
        </PillButton>
      </div>

      {confirmOpen && (
        <SignOutModal
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => { setConfirmOpen(false); onSignOut(); }}
        />
      )}
    </div>
  );
}

function SignOutModal({ onCancel, onConfirm }) {
  return (
    <div className="sog-modal-bg" onClick={onCancel}>
      <div className="sog-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sog-modal-crest">
          <SaintsCrest size={56}/>
        </div>
        <h3>Sign out of Saints on Go?</h3>
        <p>You'll need to log in again to track your child's bus.</p>
        <div className="sog-modal-actions">
          <button className="sog-btn sog-btn-ghost" onClick={onCancel}>Stay signed in</button>
          <button className="sog-btn sog-btn-primary" onClick={onConfirm}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}

window.SettingsScreen = SettingsScreen;
