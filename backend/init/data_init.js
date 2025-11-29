import db from '../config/db.js';
import dotenv from "dotenv";
import fs from "fs";
import Expert from "../models/expert.js";
import User from "../models/user.js";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import data from "./data.js"

dotenv.config();

const mongoUri = process.env.MONGO_URI;

async function initData() {

  // Connect database
  await db.connectDB();

  console.log("Starting complete database reset...");

  // Delete all messages first (they reference conversations)
  const deletedMessages = await Message.deleteMany({});
  console.log(`Deleted ${deletedMessages.deletedCount} messages`);

  // Delete all conversations (they reference users/experts)
  const deletedConversations = await Conversation.deleteMany({});
  console.log(`Deleted ${deletedConversations.deletedCount} conversations`);

  // Delete all experts
  const deletedExperts = await Expert.deleteMany({});
  console.log(`Deleted ${deletedExperts.deletedCount} experts`);

  // Delete all users
  const deletedUsers = await User.deleteMany({});
  console.log(`Deleted ${deletedUsers.deletedCount} users`);

  console.log("All existing data cleared successfully!");

  // Load image mappings
  const imageMap = JSON.parse(fs.readFileSync("image_map.json", "utf-8"));

  // Combine expert data with image URLs & IDs
  const mergedData = data.map((expert, index) => {
    const image = imageMap[index % imageMap.length]; // safely map
    return {
      ...expert,
      _id: image.nanoId, 
      img: image.url,
    };
  });

  // Insert fresh dummy expert data
  await Expert.insertMany(mergedData);
  console.log(`Inserted ${mergedData.length} fresh expert profiles`);

  console.log("Database initialization complete!");

  // Disconnect Database 
  await db.disconnectDB();

}

initData().catch(console.error);
