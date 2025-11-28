import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        userId: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          enum: ["user", "expert"],
          required: true,
        },
        preferredLanguage: {
          type: String,
          default: "en",
        },
      },
    ],
    initiatorId: {
      type: String,
      ref: "User",
      required: false, // Optional for backward compatibility
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
conversationSchema.index({ "participants.userId": 1 });
conversationSchema.index({ lastMessageAt: -1 });

export default conversationSchema;

