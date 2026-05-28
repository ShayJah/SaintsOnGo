// Dashboard / Track screen — Saints on Go
// Live map with animated bus marker + draggable bottom sheet.

function TrackScreen({ embedded }) {
  const mapRef = useRef(null);
  const mapEl = useRef(null);
  const markersRef = useRef({});
  const routeLineRef = useRef(null);
  const routesRef = useRef({});           // street-following geometries from OSRM, keyed by bus id
  const progressRef = useRef({ B1: 0.05, B2: 0.0, B3: 0.0 });
  const [focusedBus, setFocusedBus] = useState('B1');
  const [buses, setBuses] = useState(() => window.SOG_DATA.buses.map(b => ({ ...b })));
  const [sheetState, setSheetState] = useState('mid'); // mid | full
  const [pulseId, setPulseId] = useState(null);

  // ─── Init map ───
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const L = window.L;
    const map = L.map(mapEl.current, {
      center: [49.2680, -123.1500],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      tap: true,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);
    mapRef.current = map;

    // School marker
    const schoolCoords = window.SOG_DATA.school.coords;
    const schoolIcon = L.divIcon({
      className: 'sog-school-marker',
      html: `<div class="sog-school-pin"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-6 9 6v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><div class="sog-school-label">Saint George's</div>`,
      iconSize: [120, 50],
      iconAnchor: [60, 28],
    });
    L.marker(schoolCoords, { icon: schoolIcon, interactive: false }).addTo(map);

    // Bus markers
    window.SOG_DATA.buses.forEach(b => {
      const startPt = interp(getRoute(b.id), progressRef.current[b.id]);
      const ico = busDivIcon(b.number, b.id === focusedBus);
      const m = L.marker(startPt, { icon: ico }).addTo(map);
      m.on('click', () => focusBus(b.id));
      markersRef.current[b.id] = m;
    });

    // Initial route line
    drawRoute(focusedBus);

    // Fit bounds initially
    setTimeout(() => {
      const fb = window.SOG_DATA.buses.find(b => b.id === focusedBus);
      if (fb) {
        map.flyTo(interp(getRoute(fb.id), progressRef.current[fb.id]), 13, { duration: 0.8 });
      }
    }, 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ─── Animate buses ───
  useEffect(() => {
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      // Speeds per bus (fraction of route per second). Slow.
      const speeds = { B1: 0.012, B2: 0.008, B3: 0.006 };
      const newProg = { ...progressRef.current };
      let changed = false;
      window.SOG_DATA.buses.forEach(b => {
        newProg[b.id] = (newProg[b.id] + speeds[b.id] * dt) % 1;
        if (newProg[b.id] !== progressRef.current[b.id]) changed = true;
        const pt = interp(getRoute(b.id), newProg[b.id]);
        const m = markersRef.current[b.id];
        if (m) m.setLatLng(pt);
      });
      progressRef.current = newProg;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ─── ETA tick (visual countdown) ───
  useEffect(() => {
    const id = setInterval(() => {
      setBuses(prev => prev.map(b => {
        const startEta = window.SOG_DATA.buses.find(x => x.id === b.id).eta;
        // ETA derived from remaining route progress
        const remaining = 1 - progressRef.current[b.id];
        const eta = Math.max(1, Math.round(remaining * startEta * 1.6));
        return { ...b, eta };
      }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ─── Fetch real street-following routes from OSRM (public demo server) ───
  // Runs once on mount. Falls back gracefully to the straight polylines if the
  // request fails (offline, CORS, rate-limited, etc.).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const b of window.SOG_DATA.buses) {
        try {
          const coordStr = b.polyline.map(p => `${p[1]},${p[0]}`).join(';');
          const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          if (!res.ok) continue;
          const json = await res.json();
          const geom = json && json.routes && json.routes[0] && json.routes[0].geometry;
          if (geom && geom.coordinates && geom.coordinates.length > 1) {
            routesRef.current[b.id] = geom.coordinates.map(([lon, lat]) => [lat, lon]);
            // Redraw the focused route once it lands.
            if (!cancelled && b.id === focusedBus) drawRoute(focusedBus);
          }
        } catch (e) {
          // swallow — fall back to straight polyline
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Update marker styles when focus changes ───
  useEffect(() => {
    const L = window.L;
    window.SOG_DATA.buses.forEach(b => {
      const m = markersRef.current[b.id];
      if (m) m.setIcon(busDivIcon(b.number, b.id === focusedBus));
    });
    drawRoute(focusedBus);
  }, [focusedBus]);

  const drawRoute = (busId) => {
    const L = window.L;
    const map = mapRef.current;
    if (!map) return;
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }
    const b = window.SOG_DATA.buses.find(x => x.id === busId);
    if (!b) return;
    routeLineRef.current = L.polyline(getRoute(busId), {
      color: SOG_RED,
      weight: 4,
      opacity: 0.55,
      dashArray: '2 8',
      lineCap: 'round',
    }).addTo(map);
  };

  // Helper — return street-following geometry if loaded, else fall back to straight polyline.
  const getRoute = (busId) => {
    return routesRef.current[busId] || window.SOG_DATA.buses.find(b => b.id === busId).polyline;
  };

  const focusBus = (id) => {
    setFocusedBus(id);
    setPulseId(id);
    setTimeout(() => setPulseId(null), 800);
    const b = window.SOG_DATA.buses.find(x => x.id === id);
    if (!b || !mapRef.current) return;
    const pt = interp(getRoute(id), progressRef.current[id]);
    mapRef.current.flyTo(pt, 14, { duration: 0.9 });
    setSheetState('mid');
  };

  const recenterUser = () => {
    // Mock: pretend user is near the school
    if (mapRef.current) {
      mapRef.current.flyTo([49.2530, -123.1500], 13, { duration: 0.7 });
    }
  };

  return (
    <div className="sog-track">
      <div ref={mapEl} className="sog-map"/>

      {/* top-of-map status pill */}
      <div className="sog-top-pill sog-anim-fade-down">
        <span className="sog-live-dot"/>
        <span><strong>Live</strong> · Tracking {buses.length} buses</span>
      </div>

      {/* recenter button */}
      <button className="sog-locate-btn" onClick={recenterUser} aria-label="Recenter">
        <Icon.Locate size={22} color={SOG_RED}/>
      </button>

      {/* bottom sheet */}
      <div className={`sog-sheet sog-sheet-${sheetState}`}>
        <div
          className="sog-sheet-grab"
          onClick={() => setSheetState(s => s === 'mid' ? 'full' : 'mid')}
        >
          <div className="sog-sheet-handle"/>
        </div>
        <div className="sog-sheet-head">
          <div>
            <div className="sog-sheet-title">Active Buses</div>
            <div className="sog-sheet-sub">{buses.length} en route · updated just now</div>
          </div>
          <button
            className="sog-sheet-toggle"
            onClick={() => setSheetState(s => s === 'mid' ? 'full' : 'mid')}
          >
            <Icon.Chevron dir={sheetState === 'full' ? 'down' : 'up'} color="#6B7280"/>
          </button>
        </div>

        <div className="sog-sheet-body">
          {buses.map((b, i) => (
            <BusCard
              key={b.id}
              bus={b}
              active={focusedBus === b.id}
              pulse={pulseId === b.id}
              onClick={() => focusBus(b.id)}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}

          {/* Route detail (visible in 'full') */}
          <FocusedRouteDetail busId={focusedBus}/>
        </div>
      </div>
    </div>
  );
}

function BusCard({ bus, active, pulse, onClick, style }) {
  const etaTone = bus.eta <= 5 ? 'urgent' : bus.eta <= 12 ? 'soon' : 'ok';
  return (
    <button
      className={`sog-bus-card sog-anim-fade-up ${active ? 'is-active' : ''} ${pulse ? 'is-pulse' : ''}`}
      style={style}
      onClick={onClick}
    >
      <div className="sog-bus-ico-wrap">
        <div className="sog-bus-ico"><Icon.Bus size={22} color="white"/></div>
        <div className="sog-bus-num">{bus.number.replace('Bus ', '')}</div>
      </div>
      <div className="sog-bus-meta">
        <div className="sog-bus-route">{bus.route}</div>
        <div className="sog-bus-line">
          <span className={`sog-status sog-status-${bus.status}`}>
            <span className="sog-status-dot"/>
            {bus.status === 'on-route' ? 'On route' : 'Departing'}
          </span>
          <span className="sog-bus-onboard">{bus.onboard}/{bus.capacity}</span>
        </div>
      </div>
      <div className={`sog-bus-eta sog-eta-${etaTone}`}>
        <div className="sog-eta-num">{bus.eta}</div>
        <div className="sog-eta-unit">min</div>
      </div>
    </button>
  );
}

function FocusedRouteDetail({ busId }) {
  const b = window.SOG_DATA.buses.find(x => x.id === busId);
  if (!b) return null;
  return (
    <div className="sog-route-detail">
      <div className="sog-route-detail-head">
        <span>Stops · {b.number}</span>
        <span>{b.driver}</span>
      </div>
      <div className="sog-stops">
        {b.stops.map((s, i) => (
          <div key={i} className={`sog-stop ${s.done ? 'is-done' : ''} ${s.next ? 'is-next' : ''}`}>
            <div className="sog-stop-rail">
              <div className="sog-stop-dot"/>
              {i < b.stops.length - 1 && <div className="sog-stop-line"/>}
            </div>
            <div className="sog-stop-info">
              <div className="sog-stop-name">{s.name}</div>
              {s.next && <div className="sog-stop-tag">Next stop</div>}
            </div>
            <div className="sog-stop-time">{s.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bus marker icon factory ───
function busDivIcon(label, active) {
  const num = String(label).replace('Bus ', '');
  return window.L.divIcon({
    className: 'sog-bus-marker-wrap',
    html: `
      <div class="sog-bus-marker ${active ? 'is-active' : ''}">
        ${active ? '<div class="sog-bus-pulse"></div>' : ''}
        <div class="sog-bus-marker-body">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 17V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v11"/>
            <path d="M3 17h18v2h-3v-1H6v1H3z"/>
            <line x1="5" y1="11" x2="19" y2="11"/>
          </svg>
          <span>${num}</span>
        </div>
        <div class="sog-bus-marker-tail"></div>
      </div>`,
    iconSize: [56, 64],
    iconAnchor: [28, 56],
  });
}

// ─── Linear interpolation along polyline by fraction t ∈ [0,1] ───
function interp(pts, t) {
  if (t <= 0) return pts[0];
  if (t >= 1) return pts[pts.length - 1];
  // total length (in degrees, fine for short routes)
  const segs = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segs.push(d);
    total += d;
  }
  let target = t * total;
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i]) {
      const frac = segs[i] === 0 ? 0 : target / segs[i];
      const a = pts[i], b = pts[i + 1];
      return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac];
    }
    target -= segs[i];
  }
  return pts[pts.length - 1];
}

Object.assign(window, { TrackScreen });
