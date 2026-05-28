// Mock auth — shaped exactly like Firebase Auth so a real Firebase wire-up
// is a one-line swap. Replace `signIn` with:
//   import { signInWithEmailAndPassword } from 'firebase/auth';
//   signIn = (email, pw) => signInWithEmailAndPassword(auth, email, pw);

(function () {
  const DEMO_EMAIL = 'transportation@stgeorges.bc.ca';
  const DEMO_PASSWORD = 'Test123';

  // Persist signed-in user across reloads (mirrors Firebase's onAuthStateChanged behaviour).
  const STORAGE_KEY = 'sog.demo.user';

  function readUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
  function writeUser(u) {
    try {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  const listeners = new Set();
  let current = readUser();

  window.SOG_AUTH = {
    get currentUser() { return current; },

    onAuthStateChanged(cb) {
      listeners.add(cb);
      cb(current);
      return () => listeners.delete(cb);
    },

    // Returns same shape as firebase.signInWithEmailAndPassword
    async signIn(email, password) {
      await new Promise(r => setTimeout(r, 650)); // simulate network
      const e = String(email || '').trim().toLowerCase();
      if (e === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const user = { uid: 'demo-uid-001', email: DEMO_EMAIL, displayName: 'Transport Office' };
        current = user;
        writeUser(user);
        listeners.forEach(cb => cb(current));
        return { user };
      }
      const err = new Error(
        e === DEMO_EMAIL
          ? 'Wrong password. Please try again.'
          : 'No account found for that email.'
      );
      err.code = e === DEMO_EMAIL ? 'auth/wrong-password' : 'auth/user-not-found';
      throw err;
    },

    async signOut() {
      await new Promise(r => setTimeout(r, 200));
      current = null;
      writeUser(null);
      listeners.forEach(cb => cb(null));
    },

    DEMO_EMAIL, DEMO_PASSWORD,
  };
})();
