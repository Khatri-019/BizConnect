import express from "express";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// In-memory store for active users (in production, use Redis or similar)
const activeUsers = new Map(); // userId -> { lastActive: Date, conversationIds: Set }

// Update user activity
router.post("/ping", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.body;

    const userActivity = activeUsers.get(userId) || { lastActive: new Date(), conversationIds: new Set() };
    userActivity.lastActive = new Date();
    if (conversationId) {
      userActivity.conversationIds.add(conversationId);
    }
    activeUsers.set(userId, userActivity);

    // Clean up inactive users (inactive for more than 5 minutes)
    const now = new Date();
    for (const [uid, activity] of activeUsers.entries()) {
      const inactiveTime = now - activity.lastActive;
      if (inactiveTime > 5 * 60 * 1000) { // 5 minutes
        activeUsers.delete(uid);
      }
    }

    return res.status(200).json({ message: "Activity updated" });
  } catch (error) {
    console.error("Error updating activity:", error);
    return res.status(500).json({ message: "Failed to update activity" });
  }
});

// Check if user is active in a conversation
router.get("/:userId/active/:conversationId", protect, async (req, res) => {
  try {
    const { userId, conversationId } = req.params;
    const userActivity = activeUsers.get(userId);

    if (!userActivity) {
      return res.status(200).json({ isActive: false });
    }

    const isActive = 
      userActivity.conversationIds.has(conversationId) &&
      (new Date() - userActivity.lastActive) < 2 * 60 * 1000; // Active if last activity was within 2 minutes

    return res.status(200).json({ isActive });
  } catch (error) {
    console.error("Error checking activity:", error);
    return res.status(500).json({ message: "Failed to check activity" });
  }
});

export default router;

