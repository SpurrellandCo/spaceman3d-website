/**
 * auth-nav.js — Drop into any page that has <div id="auth-nav-slot"></div>.
 * Shows "Sign In" when logged out, or a "My Account" dropdown when logged in.
 */
(function () {
  const API_URL = window.SM3D_CONFIG?.API_URL || 'https://api.spaceman3d.com';
  const SLOT_ID = 'auth-nav-slot';

  // ── Inject styles once ─────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .an-btn {
      display: inline-flex; align-items: center; gap: 7px;
      font-family: 'Orbitron', var(--font-display, sans-serif);
      font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
      padding: 7px 16px; border-radius: 99px; cursor: pointer;
      text-decoration: none; white-space: nowrap; border: none; background: none;
      transition: all 150ms ease-out;
    }
    .an-signin {
      background: rgba(41,121,255,0.12);
      border: 1.5px solid rgba(41,121,255,0.4);
      color: #5B9BFF;
    }
    .an-signin:hover {
      background: rgba(41,121,255,0.22);
      border-color: #2979FF;
      color: #fff;
      box-shadow: 0 0 12px rgba(41,121,255,0.25);
    }
    .an-account-wrap { position: relative; }
    .an-account-btn {
      background: rgba(41,121,255,0.08);
      border: 1.5px solid rgba(41,121,255,0.25);
      color: #90BAFF;
    }
    .an-account-btn:hover {
      background: rgba(41,121,255,0.16);
      border-color: rgba(41,121,255,0.5);
      color: #fff;
    }
    .an-avatar {
      width: 22px; height: 22px; border-radius: 50%;
      background: rgba(41,121,255,0.25);
      border: 1.5px solid rgba(41,121,255,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; color: #5B9BFF; font-weight: 800; flex-shrink: 0;
    }
    .an-chevron { transition: transform 150ms ease-out; flex-shrink: 0; }
    .an-account-wrap.open .an-chevron { transform: rotate(180deg); }
    .an-dropdown {
      display: none;
      position: absolute; top: calc(100% + 10px); right: 0;
      min-width: 180px;
      background: #0F1020; border: 1px solid rgba(41,121,255,0.2);
      border-radius: 10px; overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(41,121,255,0.1);
      z-index: 9999;
    }
    .an-account-wrap.open .an-dropdown { display: block; }
    .an-dropdown-name {
      padding: 10px 16px 8px;
      font-family: 'Inter', var(--font-body, sans-serif);
      font-size: 12px; color: #5B9BFF; font-weight: 600;
      border-bottom: 1px solid rgba(41,121,255,0.12);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .an-dropdown a, .an-dropdown button {
      display: flex; align-items: center; gap: 9px; width: 100%;
      padding: 10px 16px;
      font-family: 'Inter', var(--font-body, sans-serif);
      font-size: 13px; font-weight: 500; color: #B0BBCC;
      text-decoration: none; background: none; border: none;
      cursor: pointer; text-align: left;
      transition: background 120ms, color 120ms;
    }
    .an-dropdown a:hover, .an-dropdown button:hover {
      background: rgba(41,121,255,0.08); color: #fff;
    }
    .an-dropdown .an-signout { color: #8892A4; margin-top: 2px; border-top: 1px solid rgba(255,255,255,0.05); }
    .an-dropdown .an-signout:hover { color: #f87171; background: rgba(248,113,113,0.08); }
    .an-icon { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
  `;
  document.head.appendChild(style);

  // ── Helpers ────────────────────────────────────────────────────────────────
  function clearAuth() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('an_display_name');
  }

  async function doLogout() {
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({}),
      });
    } catch {}
    clearAuth();
    window.location.href = '/login.html';
  }

  // ── Render logged-out state ────────────────────────────────────────────────
  function renderSignIn(slot) {
    const redirect = encodeURIComponent(window.location.href);
    const a = document.createElement('a');
    a.href = `/login.html?redirect=${redirect}`;
    a.className = 'an-btn an-signin';
    a.innerHTML = `
      <svg class="an-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      Sign In
    `;
    slot.appendChild(a);
  }

  // ── Render logged-in state ─────────────────────────────────────────────────
  function renderAccount(slot, displayName) {
    const initial = displayName.charAt(0).toUpperCase();
    const shortName = displayName.length > 16 ? displayName.slice(0, 15) + '…' : displayName;

    slot.innerHTML = `
      <div class="an-account-wrap" id="an-wrap">
        <button class="an-btn an-account-btn" id="an-trigger" type="button">
          <span class="an-avatar" id="an-avatar">${initial}</span>
          <span id="an-name">${shortName}</span>
          <svg class="an-icon an-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="an-dropdown" id="an-dropdown">
          <div class="an-dropdown-name" id="an-dropdown-name">${shortName}</div>
          <a href="/dashboard.html">
            <svg class="an-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a href="/orders.html">
            <svg class="an-icon" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Orders
          </a>
          <a href="/exports.html">
            <svg class="an-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            My Exports
          </a>
          <button class="an-signout" id="an-logout" type="button">
            <svg class="an-icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </div>
    `;

    const wrap = document.getElementById('an-wrap');
    const trigger = document.getElementById('an-trigger');
    const dropdown = document.getElementById('an-dropdown');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      wrap.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });
    document.getElementById('an-logout').addEventListener('click', doLogout);
  }

  // ── Update display name after API fetch ────────────────────────────────────
  function updateName(name) {
    const el = document.getElementById('an-name');
    const drop = document.getElementById('an-dropdown-name');
    const avatar = document.getElementById('an-avatar');
    const short = name.length > 16 ? name.slice(0, 15) + '…' : name;
    if (el) el.textContent = short;
    if (drop) drop.textContent = short;
    if (avatar) avatar.textContent = name.charAt(0).toUpperCase();
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  function init() {
    const slot = document.getElementById(SLOT_ID);
    if (!slot) return;

    const token = localStorage.getItem('access_token');

    if (!token) {
      renderSignIn(slot);
      return;
    }

    // Render immediately with cached name (or "Account" fallback)
    const cached = localStorage.getItem('an_display_name') || 'Account';
    renderAccount(slot, cached);

    // Fetch real name in background and update
    fetch(`${API_URL}/user/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((user) => {
        if (!user) return;
        const name = user.firstName || user.email || 'Account';
        localStorage.setItem('an_display_name', name);
        updateName(name);
      })
      .catch(() => {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
