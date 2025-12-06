import { io } from "socket.io-client";

// Base URL for Socket.IO connection
const isProduction = import.meta.env.MODE === 'production';
const SOCKET_URL = isProduction 
  ? (import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000')
  : 'http://localhost:5000';

let socket = null;

/**
 * Initialize Socket.IO connection
 */
export const initializeSocket = () => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket.IO connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket.IO disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error);
  });

  return socket;
};

/**
 * Get current socket instance
 */
export const getSocket = () => {
  if (!socket || !socket.connected) {
    return initializeSocket();
  }
  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Join a conversation room
 */
export const joinConversation = (conversationId) => {
  const s = getSocket();
  s.emit('join_conversation', conversationId);
};

/**
 * Leave a conversation room
 */
export const leaveConversation = (conversationId) => {
  const s = getSocket();
  s.emit('leave_conversation', conversationId);
};

/**
 * Send a message via Socket.IO
 */
export const sendMessageViaSocket = (conversationId, content) => {
  const s = getSocket();
  s.emit('send_message', { conversationId, content });
};

/**
 * Emit user activity
 */
export const emitUserActive = (conversationId) => {
  const s = getSocket();
  s.emit('user_active', { conversationId });
};

/**
 * Emit typing indicator
 */
export const emitTyping = (conversationId, isTyping) => {
  const s = getSocket();
  s.emit('typing', { conversationId, isTyping });
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  sendMessageViaSocket,
  emitUserActive,
  emitTyping,
};

