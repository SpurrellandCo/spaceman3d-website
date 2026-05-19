// API client with automatic Bearer token injection and 401 refresh handling

const getApiUrl = () => window.SM3D_CONFIG?.API_URL || 'https://api.spaceman3d.com';

const storage = {
  getAccessToken:  () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  getUserId:       () => localStorage.getItem('user_id'),
  setTokens(accessToken, refreshToken, userId) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    if (userId) localStorage.setItem('user_id', userId);
  },
  clear() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
  },
};

let isRefreshing = false;
let refreshQueue = [];

async function attemptRefresh() {
  const userId = storage.getUserId();
  const refreshToken = storage.getRefreshToken();
  if (!userId || !refreshToken) return false;

  try {
    const res = await fetch(`${getApiUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    storage.setTokens(data.accessToken, data.refreshToken, null);
    return true;
  } catch {
    return false;
  }
}

async function request(path, options = {}) {
  const url = `${getApiUrl()}${path}`;
  const accessToken = storage.getAccessToken();

  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 && !options._retried) {
    if (!isRefreshing) {
      isRefreshing = true;
      const ok = await attemptRefresh();
      isRefreshing = false;
      refreshQueue.forEach((fn) => fn(ok));
      refreshQueue = [];
      if (!ok) {
        storage.clear();
        window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.href)}`;
        return;
      }
    } else {
      const ok = await new Promise((resolve) => refreshQueue.push(resolve));
      if (!ok) {
        storage.clear();
        window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.href)}`;
        return;
      }
    }
    return request(path, { ...options, _retried: true });
  }

  return res;
}

const api = {
  async get(path) {
    const res = await request(path, { method: 'GET' });
    return res.json();
  },
  async post(path, body) {
    const res = await request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return res.json();
  },
  async patch(path, body) {
    const res = await request(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return res.json();
  },
  // Returns the raw Response so callers can check status
  async rawPost(path, body) {
    return request(path, { method: 'POST', body: JSON.stringify(body) });
  },
  async rawPatch(path, body) {
    return request(path, { method: 'PATCH', body: JSON.stringify(body) });
  },
  storage,
};

window.api = api;
