import { verifyAccessToken } from "../utils/token.js";
import User from "../models/user.js";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import * as chatService from "../services/chatService.js";

// Store active users by socket ID
const activeUsers = new Map(); // socketId -> { userId, conversationIds: Set }

/**
 * Authenticate socket connection using JWT from cookies
 */
const authenticateSocket = async (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
      return next(new Error("Authentication error: No cookies"));
    }

    // Extract access token from cookies
    const cookiePairs = cookies.split(";").map(c => c.trim());
    const accessTokenCookie = cookiePairs.find(c => c.startsWith("accessToken="));
    
    if (!accessTokenCookie) {
      return next(new Error("Authentication error: No access token"));
    }

    const token = accessTokenCookie.split("=")[1];
    const decoded = verifyAccessToken(token);
    
    const user = await User.findById(decoded.id).select("-password -refreshTokens");
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    socket.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
};

/**
 * Initialize Socket.IO handlers
 */
export const initializeSocketHandlers = (io) => {
  // Authentication middleware
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    console.log(`User ${userId} connected via Socket.IO`);

    // Track active user
    activeUsers.set(socket.id, {
      userId,
      conversationIds: new Set(),
    });

    // Join user's personal room for direct messages
    socket.join(`user:${userId}`);

    // Handle joining conversation rooms
    socket.on("join_conversation", async (conversationId) => {
      try {
        // Verify user is part of conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit("error", { message: "Conversation not found" });
          return;
        }

        const isParticipant = conversation.participants.some(
          (p) => p.userId.toString() === userId
        );

        if (!isParticipant) {
          socket.emit("error", { message: "Not authorized" });
          return;
        }

        // Join conversation room
        socket.join(`conversation:${conversationId}`);
        
        // Track conversation
        const userData = activeUsers.get(socket.id);
        if (userData) {
          userData.conversationIds.add(conversationId);
        }

        console.log(`User ${userId} joined conversation ${conversationId}`);
      } catch (error) {
        console.error("Error joining conversation:", error);
        socket.emit("error", { message: "Failed to join conversation" });
      }
    });

    // Handle leaving conversation rooms
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      
      const userData = activeUsers.get(socket.id);
      if (userData) {
        userData.conversationIds.delete(conversationId);
      }

      console.log(`User ${userId} left conversation ${conversationId}`);
    });

    // Handle sending messages
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, content } = data;

        if (!conversationId || !content) {
          socket.emit("error", { message: "Conversation ID and content required" });
          return;
        }

        // Create message using service
        const message = await chatService.sendMessage(
          conversationId,
          userId,
          socket.user.role,
          content
        );

        // Get conversation to find other participant
        const conversation = await Conversation.findById(conversationId);
        const otherParticipant = conversation.participants.find(
          (p) => p.userId.toString() !== userId
        );

        // Emit to conversation room (all participants including sender)
        // This ensures both sender and receiver get the message in real-time
        io.to(`conversation:${conversationId}`).emit("new_message", {
          conversationId: String(conversationId),
          message: {
            id: String(message._id),
            _id: String(message._id),
            senderId: String(message.senderId),
            senderRole: message.senderRole,
            content: message.content,
            translatedContent: message.translatedContent || "",
            isTranslated: message.isTranslated || false,
            originalLanguage: message.originalLanguage || "en",
            translatedLanguage: message.translatedLanguage || "en",
            createdAt: message.createdAt,
          },
        });

        // Emit conversation update to both participants
        const updatedConversation = await chatService.getConversationById(conversationId, userId);
        io.to(`user:${userId}`).emit("conversation_updated", updatedConversation);
        
        if (otherParticipant) {
          io.to(`user:${otherParticipant.userId}`).emit("conversation_updated", {
            ...updatedConversation,
            myPreferredLanguage: otherParticipant.preferredLanguage || "en",
            otherPreferredLanguage: conversation.participants.find(
              (p) => p.userId.toString() === userId
            )?.preferredLanguage || "en",
          });
        }

        console.log(`Message sent in conversation ${conversationId} by user ${userId}`);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: error.message || "Failed to send message" });
      }
    });

    // Handle user activity ping
    socket.on("user_active", (data) => {
      const { conversationId } = data;
      if (conversationId) {
        // Notify other participants in the conversation
        socket.to(`conversation:${conversationId}`).emit("user_active", {
          userId,
          conversationId,
        });
      }
    });

    // Handle typing indicator
    socket.on("typing", (data) => {
      const { conversationId, isTyping } = data;
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit("typing", {
          userId,
          conversationId,
          isTyping,
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
      activeUsers.delete(socket.id);
    });
  });
};

