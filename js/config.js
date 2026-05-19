// Site configuration — update these values before deployment
window.SM3D_CONFIG = {
  API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : 'https://api.spaceman3d.com',
  GOOGLE_CLIENT_ID: '',  // Set to your Google OAuth Client ID
};
