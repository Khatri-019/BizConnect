import express from "express";
import {
  createConversation,
  getConversations,
  getConversationById,
  getMessages,
  updateLanguagePreference,
  sendMessage,
  deleteAllConversations,
  translateMessage,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

/**
 * Create or get conversation between user and expert
 * POST /api/chat/conversations
 */
router.post("/conversations", protect, createConversation);

/**
 * Get all conversations for logged-in user
 * GET /api/chat/conversations
 * IMPORTANT: This route must come BEFORE /conversations/:conversationId to avoid route conflicts
 */
router.get("/conversations", protect, getConversations);

/**
 * Get a single conversation by ID
 * GET /api/chat/conversations/:conversationId
 * IMPORTANT: This route must come AFTER /conversations to avoid route conflicts
 */
router.get("/conversations/:conversationId", protect, getConversationById);

/**
 * Get messages for a conversation
 * GET /api/chat/conversations/:conversationId/messages
 */
router.get("/conversations/:conversationId/messages", protect, getMessages);

/**
 * Update user's language preference in conversation
 * PUT /api/chat/conversations/:conversationId/language
 */
router.put("/conversations/:conversationId/language", protect, updateLanguagePreference);

/**
 * Send a message
 * POST /api/chat/conversations/:conversationId/messages
 */
router.post("/conversations/:conversationId/messages", protect, sendMessage);

/**
 * Delete all conversations and messages for the logged-in user
 * DELETE /api/chat/conversations/all
 */
router.delete("/conversations/all", protect, deleteAllConversations);

/**
 * Translate a message
 * POST /api/chat/messages/:messageId/translate
 */
router.post("/messages/:messageId/translate", protect, translateMessage);

export default router;

