import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: String,
      required: true,
      ref: "User",
    },
    senderRole: {
      type: String,
      enum: ["user", "expert"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    translatedContent: {
      type: String,
      default: "",
    },
    originalLanguage: {
      type: String,
      default: "en",
    },
    translatedLanguage: {
      type: String,
      default: "en",
    },
    isTranslated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

export default messageSchema;

