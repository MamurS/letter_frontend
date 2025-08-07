// --- Configuration ---
// IMPORTANT: Replace this with your actual Render backend URL
const API_BASE_URL = 'https://letter-app-24x3.onrender.com';

// --- API Service ---
const apiService = {
  /**
   * A general-purpose request function to handle all API calls.
   * It automatically adds the auth token and handles JSON parsing.
   * @param {string} endpoint - The API endpoint to call (e.g., '/api/letters/').
   * @param {object} options - The options for the fetch request (method, body, etc.).
   * @returns {Promise<any>} - The JSON response from the server.
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      // Try to parse the error response, but provide a fallback
      const errorData = await response.json().catch(() => ({ detail: 'An unknown server error occurred.' }));
      throw new Error(errorData.detail || errorData.error || JSON.stringify(errorData));
    }

    // **FIX for "Unexpected end of JSON input" error**
    // Check if the response has content before trying to parse it as JSON.
    const contentLength = response.headers.get('content-length');
    if (response.status === 204 || contentLength === '0') {
      return null; // Return null for empty success responses (e.g., from cancel/restore)
    }

    return response.json();
  },

  // --- Authentication Endpoints ---
  login: (username, password) => apiService.request('/api/token/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),

  signup: (email) => apiService.request('/api/signup/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  requestPasswordReset: (email) => apiService.request('/api/password-reset/', {
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

// Export the service so it can be imported in other files
export default apiService;