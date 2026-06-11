import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: false,
});

export const attachToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An error occurred';
    if (error.response) {
      // Server responded with error
      message = error.response.data?.message || error.response.statusText || 'Server error';
      // Handle validation errors
      if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
        message = error.response.data.errors.join(', ');
      }
    } else if (error.request) {
      // Request made but no response
      message = 'Network error. Please check if the server is running.';
    } else {
      // Something else happened
      message = error.message || 'An unexpected error occurred';
    }
    console.error('API Error:', { message, error: error.response?.data || error.message });
    return Promise.reject(new Error(message));
  }
);

export default apiClient;

