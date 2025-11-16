import db from '../config/db.js';
import dotenv from "dotenv";
import fs from "fs";
import Expert from "../models/expert.js";
import data from "./data.js"

dotenv.config();

const mongoUri = process.env.MONGO_URI;

async function initData() {

  // Connect database
  await db.connectDB();

  // Clear existing data
  await Expert.deleteMany({});
  console.log("Cleared existing expert data");

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

  await Expert.insertMany(mergedData);
  console.log(`Inserted ${mergedData.length} experts`);

  // Disconnect Database 
  await db.disconnectDB();

}

initData().catch(console.error);
