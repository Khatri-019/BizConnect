import axios from "axios";

// Base API configuration
const API_BASE_URL = "http://localhost:5000/api";

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
        // Refresh failed - redirect to login
        window.location.href = "http://localhost:5173";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============ AUTH API ============

export const authAPI = {
  // Get current user from token
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
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

  // Get a single conversation by ID
  getConversationById: async (conversationId) => {
    const response = await api.get(`/chat/conversations/${conversationId}`);
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

  // Update language preference for conversation
  updateLanguagePreference: async (conversationId, preferredLanguage) => {
    const response = await api.put(`/chat/conversations/${conversationId}/language`, {
      preferredLanguage,
    });
    return response.data;
  },

  // Delete all conversations and messages
  deleteAllConversations: async () => {
    const response = await api.delete("/chat/conversations/all");
    return response.data;
  },
};

// ============ ACTIVE USERS API ============

export const activeUsersAPI = {
  // Ping to update user activity
  ping: async (conversationId) => {
    const response = await api.post("/active/ping", { conversationId });
    return response.data;
  },

  // Check if user is active in conversation
  checkActive: async (userId, conversationId) => {
    const response = await api.get(`/active/${userId}/active/${conversationId}`);
    return response.data;
  },
};

export default api;

