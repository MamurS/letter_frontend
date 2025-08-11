// --- Configuration ---
// IMPORTANT: Replace this with your actual Render backend URL
const API_BASE_URL = 'https://letter-app-24x3.onrender.com';

// A variable to prevent infinite refresh loops
let isRefreshing = false;

// --- API Service ---
export const apiService = {
  /**
   * A general-purpose request function to handle all API calls.
   * It automatically adds the auth token and handles JSON parsing.
   * @param {string} endpoint - The API endpoint to call (e.g., '/api/letters/').
   * @param {object} options - The options for the fetch request (method, body, etc.).
   * @returns {Promise<any>} - The JSON response from the server.
   */
  async request(endpoint, options = {}) {
    let response = await this.fetchWithAuth(endpoint, options);

    // If the token is expired (401 error), try to refresh it and retry the request
    if (response.status === 401 && !options.isRetry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await this.refreshToken();
          localStorage.setItem('authToken', refreshResponse.access);
          isRefreshing = false;
          // Retry the original request with the new token
          return this.request(endpoint, { ...options, isRetry: true });
        } catch (refreshError) {
          isRefreshing = false;
          // If refresh fails, log the user out
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('username');
          window.location.reload(); // Reload the page to show the login screen
          return Promise.reject(refreshError);
        }
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An unknown server error occurred.' }));
      throw new Error(errorData.detail || errorData.error || JSON.stringify(errorData));
    }

    const contentLength = response.headers.get('content-length');
    if (response.status === 204 || contentLength === '0') {
      return null;
    }

    return response.json();
  },

  /**
   * A helper function to attach the auth token to fetch requests.
   */
  fetchWithAuth: (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, { ...options, headers });
  },

  // --- Authentication Endpoints ---
  login: (username, password) => apiService.request('/api/token/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),

  refreshToken: () => apiService.request('/api/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh: localStorage.getItem('refreshToken') }),
  }),

  signup: (email) => apiService.request('/api/signup/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  // --- Letter Management Endpoints ---
  getLetters: () => apiService.request('/api/letters/'),

  registerNewLetter: (subject, addressee) => apiService.request('/api/letters/', {
    method: 'POST',
    body: JSON.stringify({ subject, addressee }),
  }),

  cancelLetter: (letterId) => apiService.request(`/api/letters/${letterId}/cancel/`, {
    method: 'POST',
  }),

  restoreLetter: (letterId) => apiService.request(`/api/letters/${letterId}/restore/`, {
    method: 'POST',
  }),
};
