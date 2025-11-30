import axios from "axios";

// Base API configuration - use production URL in production, localhost in development
// Similar to backend/app.js logic: if NODE_ENV=production use production links, else localhost
const isProduction = import.meta.env.MODE === 'production';
const API_BASE_URL = isProduction ? (import.meta.env.VITE_API_URL): "http://localhost:5000/api";

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Always send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip interceptor for auth check and refresh endpoints
    const skipUrls = ["/auth/refresh", "/auth/me", "/auth/login", "/auth/logout"];
    if (skipUrls.some(url => originalRequest.url.includes(url))) {
      return Promise.reject(error);
    }

    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - user needs to login again
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============ AUTH API ============

export const authAPI = {
  // Check if username is available
  checkUsername: async (username) => {
    const response = await api.post("/auth/check-username", { username });
    return response.data;
  },

  // Register expert (combines user + expert profile)
  registerExpert: async (data) => {
    const response = await api.post("/auth/expert-register", data);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Get current user from token
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },
};

// ============ EXPERTS API ============

export const expertsAPI = {
  // Get all experts
  getAll: async () => {
    const response = await api.get("/experts");
    return response.data;
  },

  // Get expert by ID
  getById: async (id) => {
    const response = await api.get(`/experts/${id}`);
    return response.data;
  },

  // Update expert profile
  updateProfile: async (id, data) => {
    const response = await api.put(`/experts/${id}`, data);
    return response.data;
  },

  // Delete expert profile (deletes user, expert, and Cloudinary image)
  deleteProfile: async (id) => {
    const response = await api.delete(`/experts/${id}/profile`);
    return response.data;
  },
};

// ============ CHAT API ============

export const chatAPI = {
  // Create or get conversation with expert
  createConversation: async (expertId) => {
    const response = await api.post("/chat/conversations", { expertId });
    return response.data;
  },

  // Get all conversations for logged-in user
  getConversations: async () => {
    const response = await api.get("/chat/conversations");
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId) => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`);
    return response.data;
  },

  // Send a message
  sendMessage: async (conversationId, content, translate = false, targetLanguage = "en") => {
    const response = await api.post(`/chat/conversations/${conversationId}/messages`, {
      content,
      translate,
      targetLanguage,
    });
    return response.data;
  },

  // Translate a message
  translateMessage: async (messageId, targetLanguage) => {
    const response = await api.post(`/chat/messages/${messageId}/translate`, {
      targetLanguage,
    });
    return response.data;
  },
};

// Export the axios instance for custom requests
export default api;

