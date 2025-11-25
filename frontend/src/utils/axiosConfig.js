import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // --- FIX: Prevent Infinite Loop ---
    // If the URL that failed is the refresh endpoint itself, reject immediately.
    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        await axios.post("http://localhost:5000/api/auth/refresh");
        
        // If successful, retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, user is truly logged out. 
        // Optionally: Redirect to login page here if you want
        // window.location.href = '/'; 
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);