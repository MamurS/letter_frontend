// IMPORTANT: Replace this with your actual Render backend URL
const API_BASE_URL = 'https://letter-app-24x3.onrender.com';

export const apiService = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred.' }));
      throw new Error(errorData.detail || errorData.error || JSON.stringify(errorData));
    }
    if (response.status === 204 || (response.status === 200 && options.method === 'POST' && !response.headers.get('content-length'))) {
        return null;
    }
    return response.json();
  },
  login: (username, password) => apiService.request('/api/token/', { method: 'POST', body: JSON.stringify({ username, password }) }),
  signup: (email) => apiService.request('/api/signup/', { method: 'POST', body: JSON.stringify({ email }) }),
  requestPasswordReset: (email) => apiService.request('/api/password-reset/', { method: 'POST', body: JSON.stringify({ email }) }),
  getLetters: () => apiService.request('/api/letters/'),
  registerNewLetter: (subject, addressee) => apiService.request('/api/letters/', { method: 'POST', body: JSON.stringify({ subject, addressee }) }),
  cancelLetter: (letterId) => apiService.request(`/api/letters/${letterId}/cancel/`, { method: 'POST' }),
  restoreLetter: (letterId) => apiService.request(`/api/letters/${letterId}/restore/`, { method: 'POST' }),
};
