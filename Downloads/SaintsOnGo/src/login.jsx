// Login screen — Saints on Go
// Uses SOG_AUTH (mock auth, Firebase-shaped) to validate credentials.

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // Helper: shake form on error
  const bump = () => {
    setShake(true);
    setTimeout(() => setShake(false), 380);
  };

  const submit = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      bump();
      return;
    }
    setLoading(true);
    try {
      await window.SOG_AUTH.signIn(email, password);
      // Small delay to let the success state breathe before transitioning
      setTimeout(() => {
        setLoading(false);
        onLogin();
      }, 180);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Unable to sign in. Please try again.');
      bump();
    }
  };

  const fillDemo = () => {
    setEmail(window.SOG_AUTH.DEMO_EMAIL);
    setPassword(window.SOG_AUTH.DEMO_PASSWORD);
    setError('');
  };

  const onKey = (e) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className="sog-screen sog-login">
      <div className="sog-login-inner">
        <div className="sog-crest-wrap sog-anim-pop">
          <SaintsCrest size={92}/>
        </div>

        <div className="sog-login-titles sog-anim-fade-up">
          <div className="sog-login-school">Saint George's School</div>
          <div className="sog-login-product">Saints on Go · Transport Portal</div>
        </div>

        <div className={`sog-login-form sog-anim-fade-up ${shake ? 'is-shake' : ''}`}>
          <div className="sog-field">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <input
              type="email"
              placeholder="School email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              onKeyDown={onKey}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="email"
            />
          </div>
          <div className="sog-field">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              onKeyDown={onKey}
              autoComplete="current-password"
            />
            <button
              className="sog-field-trail"
              onClick={() => setShowPw(s => !s)}
              type="button"
              aria-label="Toggle password visibility"
              tabIndex={-1}
            >
              <Icon.Eye size={18} color="#9CA3AF" off={showPw}/>
            </button>
          </div>

          <div className={`sog-login-error ${error ? 'is-visible' : ''}`}>
            {error || ' '}
          </div>

          <div className="sog-login-meta">
            <label className="sog-check">
              <input type="checkbox" defaultChecked/>
              <span>Stay signed in</span>
            </label>
            <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
          </div>

          <PillButton onClick={submit} full loading={loading}>
            {loading ? '' : 'Sign in'}
          </PillButton>

          <button className="sog-demo-chip" type="button" onClick={fillDemo}>
            <span className="sog-demo-dot"/>
            <span>Use demo credentials</span>
          </button>
        </div>

        <div className="sog-login-footer">
          <span>Need access? </span>
          <a href="#" onClick={(e) => e.preventDefault()}>Contact your school</a>
        </div>
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
