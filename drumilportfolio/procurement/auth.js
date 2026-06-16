/**
 * auth.js — Shared authentication utility for AI Procurement Hub
 *
 * Provides:
 *  - ProcureAuth.saveSession(data, remember) → persist JWT + user info
 *  - ProcureAuth.getSession()                → return session object or null
 *  - ProcureAuth.clearSession()              → logout
 *  - ProcureAuth.requireAuth(redirectTo)     → redirect if not logged in
 *  - ProcureAuth.renderNavUser(options)      → inject user badge into nav
 *  - ProcureAuth.getAuthHeader()             → { Authorization: 'Bearer ...' }
 */
const ProcureAuth = (() => {
  const SESSION_KEY = 'procure_session';

  /* ── Persist / read ── */
  function saveSession(data, remember = false) {
    const session = {
      token:     data.token,
      user_id:   data.user_id,
      org_id:    data.org_id,
      full_name: data.full_name,
      email:     data.email,
      role:      data.role,
      org_name:  data.org_name,
      saved_at:  Date.now(),
    };
    const store = remember ? localStorage : sessionStorage;
    store.setItem(SESSION_KEY, JSON.stringify(session));
    // Mirror to the other store so getSession works across tabs
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function getSession() {
    const raw =
      sessionStorage.getItem(SESSION_KEY) ||
      localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  /* ── Guard ── */
  function requireAuth(redirectTo = 'login.html') {
    if (!getSession()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }

  /* ── Auth header for fetch() ── */
  function getAuthHeader() {
    const s = getSession();
    if (!s) return {};
    return { Authorization: `Bearer ${s.token}` };
  }

  /* ── Role label helper ── */
  function roleLabel(role) {
    return { owner: 'Owner', manager: 'Manager', executive: 'Coordinator' }[role] || role;
  }

  /* ── Nav user badge ── */
  function renderNavUser({
    containerSelector = '#nav-user',
    logoutRedirect    = 'login.html',
    loginLink         = 'login.html',
    signupLink        = 'signup.html',
  } = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const session = getSession();

    if (!session) {
      // Show login / sign up buttons
      container.innerHTML = `
        <a href="${loginLink}"  id="nav-login-btn"  style="font-family:inherit;font-size:0.85rem;font-weight:600;color:rgba(255,255,255,0.8);background:none;border:1px solid rgba(255,255,255,0.2);border-radius:8px;padding:0.45rem 1rem;cursor:pointer;text-decoration:none;transition:all 0.2s;">Sign in</a>
        <a href="${signupLink}" id="nav-signup-btn" style="font-family:inherit;font-size:0.88rem;font-weight:700;color:#fff;background:#f97316;border:none;border-radius:8px;padding:0.5rem 1.25rem;cursor:pointer;text-decoration:none;transition:all 0.2s;display:inline-flex;align-items:center;gap:0.4rem;">Get Started</a>
      `;
      return;
    }

    const initials = session.full_name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();

    container.innerHTML = `
      <div id="user-menu-wrap" style="position:relative;">
        <button id="user-menu-btn" style="display:flex;align-items:center;gap:0.6rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0.35rem 0.75rem 0.35rem 0.4rem;cursor:pointer;color:#fff;font-family:inherit;transition:all 0.2s;" aria-haspopup="true" aria-expanded="false">
          <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#f97316,#d97706);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:800;color:#fff;flex-shrink:0;">${initials}</div>
          <div style="text-align:left;line-height:1.2;">
            <div style="font-size:0.8rem;font-weight:700;">${session.full_name.split(' ')[0]}</div>
            <div style="font-size:0.65rem;color:rgba(255,255,255,0.45);">${roleLabel(session.role)}</div>
          </div>
          <span style="font-size:0.6rem;color:rgba(255,255,255,0.4);margin-left:2px;">▼</span>
        </button>

        <div id="user-dropdown" style="display:none;position:absolute;top:calc(100% + 8px);right:0;width:220px;background:rgba(14,20,34,0.97);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:0.5rem;box-shadow:0 16px 40px rgba(0,0,0,0.6);backdrop-filter:blur(16px);z-index:500;">
          <div style="padding:0.6rem 0.75rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:0.35rem;">
            <div style="font-size:0.8rem;font-weight:700;color:#fff;">${session.full_name}</div>
            <div style="font-size:0.72rem;color:rgba(255,255,255,0.4);">${session.email}</div>
            <div style="margin-top:0.3rem;font-size:0.65rem;background:rgba(249,115,22,0.12);border:1px solid rgba(249,115,22,0.25);border-radius:4px;padding:0.15rem 0.4rem;display:inline-block;color:#f97316;font-weight:700;">${session.org_name}</div>
          </div>
          <a href="index.html"       style="${_ddItemStyle()}">📊 Dashboard</a>
          <a href="operations.html"  style="${_ddItemStyle()}">⚙ Operations Console</a>
          <div style="height:1px;background:rgba(255,255,255,0.07);margin:0.35rem 0;"></div>
          <button id="logout-btn" style="${_ddItemStyle(true)}border:none;cursor:pointer;font-family:inherit;width:100%;text-align:left;color:#fca5a5;">🚪 Sign out</button>
        </div>
      </div>
    `;

    // Toggle dropdown
    const btn  = document.getElementById('user-menu-btn');
    const drop = document.getElementById('user-dropdown');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = drop.style.display === 'block';
      drop.style.display = open ? 'none' : 'block';
      btn.setAttribute('aria-expanded', !open);
    });

    document.addEventListener('click', () => { drop.style.display = 'none'; btn.setAttribute('aria-expanded', 'false'); });

    document.getElementById('logout-btn').addEventListener('click', () => {
      clearSession();
      window.location.href = logoutRedirect;
    });
  }

  function _ddItemStyle(isBtn = false) {
    return `display:block;padding:0.5rem 0.75rem;font-size:0.82rem;font-weight:500;color:rgba(255,255,255,0.75);text-decoration:none;border-radius:7px;transition:background 0.15s;background:none;${isBtn ? '' : ''}`;
  }

  return { saveSession, getSession, clearSession, requireAuth, getAuthHeader, renderNavUser };
})();
