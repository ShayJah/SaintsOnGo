// App shell — routes between Splash → Login → Main (Track/Schedule/Settings)

const { useState, useEffect, useRef, useMemo, useCallback } = React;

function App() {
  const [page, setPage] = useState('splash');        // splash | login | main
  const [tab, setTab] = useState('track');           // track | schedule | settings
  const [signingOut, setSigningOut] = useState(false);

  // splash → login
  useEffect(() => {
    if (page === 'splash') {
      const t = setTimeout(() => setPage('login'), 1500);
      return () => clearTimeout(t);
    }
  }, [page]);

  const handleLogin = () => setPage('main');
  const handleSignOut = async () => {
    setSigningOut(true);
    try { await window.SOG_AUTH.signOut(); } catch {}
    setTimeout(() => {
      setSigningOut(false);
      setTab('track');
      setPage('login');
    }, 500);
  };

  // Skip login if already signed in (mock auth persists across reloads)
  useEffect(() => {
    if (page === 'login' && window.SOG_AUTH && window.SOG_AUTH.currentUser) {
      setPage('main');
    }
  }, [page]);

  let body;
  if (page === 'splash') {
    body = <SplashScreen/>;
  } else if (page === 'login') {
    body = <LoginScreen onLogin={handleLogin}/>;
  } else {
    body = (
      <div className="sog-main">
        <div className="sog-pane" key={tab}>
          {tab === 'track' && <TrackScreen/>}
          {tab === 'schedule' && <ScheduleScreen/>}
          {tab === 'settings' && <SettingsScreen onSignOut={handleSignOut}/>}
        </div>
        <BottomNav active={tab} onChange={setTab}/>
        {signingOut && <SigningOutOverlay/>}
      </div>
    );
  }

  return (
    <DeviceShell>
      <div className="sog-app" data-page={page}>
        {body}
      </div>
    </DeviceShell>
  );
}

function SplashScreen() {
  return (
    <div className="sog-splash">
      <div className="sog-splash-inner">
        <div className="sog-splash-crest">
          <SaintsCrest size={104}/>
        </div>
        <div className="sog-splash-word">Saint George's School</div>
        <div className="sog-splash-tag">Saints on Go</div>
        <div className="sog-splash-dots">
          <span/><span/><span/>
        </div>
      </div>
    </div>
  );
}

function SigningOutOverlay() {
  return (
    <div className="sog-signout-overlay">
      <div className="sog-spinner sog-spinner-lg"/>
      <div>Signing out…</div>
    </div>
  );
}

// ─── Device shell: iOS frame on desktop, full-bleed on mobile ───
function DeviceShell({ children }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 520);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 520);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (isMobile) {
    return <div className="sog-mobile-root">{children}</div>;
  }
  return (
    <div className="sog-desktop-stage">
      <div className="sog-desktop-bg"/>
      <div className="sog-desktop-frame">
        <IOSDevice width={402} height={874}>
          {children}
        </IOSDevice>
      </div>
      <div className="sog-desktop-caption">
        <div className="sog-desktop-caption-title">Saints on Go</div>
        <div className="sog-desktop-caption-sub">Mobile prototype · iPhone preview</div>
      </div>
    </div>
  );
}

window.App = App;
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
