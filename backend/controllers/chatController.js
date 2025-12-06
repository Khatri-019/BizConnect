import * as chatService from "../services/chatService.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

/**
 * Create or get conversation between user and expert
 * POST /api/chat/conversations
 */
export const createConversation = asyncHandler(async (req, res) => {
  const { expertId } = req.body;
  const userId = req.user.id;

  const conversation = await chatService.createOrGetConversation(userId, expertId);
  return res.status(200).json(conversation);
});

/**
 * Get all conversations for logged-in user
 * GET /api/chat/conversations
 */
export const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const conversations = await chatService.getUserConversations(userId);
  return res.status(200).json(conversations);
});

/**
 * Get a single conversation by ID
 * GET /api/chat/conversations/:conversationId
 */
export const getConversationById = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.id;

  const conversation = await chatService.getConversationById(conversationId, userId);
  return res.status(200).json(conversation);
});

/**
 * Get messages for a conversation
 * GET /api/chat/conversations/:conversationId/messages
 */
export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.id;

  const messages = await chatService.getConversationMessages(conversationId, userId);
  return res.status(200).json(messages);
});

/**
 * Update user's language preference in conversation
 * PUT /api/chat/conversations/:conversationId/language
 */
export const updateLanguagePreference = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { preferredLanguage } = req.body;
  const userId = req.user.id;

  await chatService.updateLanguagePreference(conversationId, userId, preferredLanguage);
  return res.status(200).json({ message: "Language preference updated" });
});

/**
 * Send a message
 * POST /api/chat/conversations/:conversationId/messages
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  const message = await chatService.sendMessage(conversationId, userId, userRole, content);
  return res.status(201).json(message);
});

/**
 * Delete all conversations and messages for the logged-in user
 * DELETE /api/chat/conversations/all
 */
export const deleteAllConversations = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await chatService.deleteAllUserConversations(userId);
  
  console.log(`[Delete All] Deleted ${result.deletedConversations} conversations and ${result.deletedMessages} messages for user ${userId}`);

  return res.status(200).json({
    message: "All conversations and messages deleted successfully",
    deletedConversations: result.deletedConversations,
    deletedMessages: result.deletedMessages,
  });
});

/**
 * Translate a message
 * POST /api/chat/messages/:messageId/translate
 */
export const translateMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { targetLanguage } = req.body;
  const userId = req.user.id;

  const message = await chatService.translateMessage(messageId, userId, targetLanguage);
  return res.status(200).json(message);
});

