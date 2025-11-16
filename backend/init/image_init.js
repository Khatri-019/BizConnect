import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const localDir = path.resolve("init/images");
const folder = process.env.CLOUDINARY_FOLDER;

// Utility: delete all images from Cloudinary folder
async function clearCloudinaryFolder() {
  const res = await cloudinary.api.delete_resources_by_prefix(`${folder}/`);
  console.log(`Deleted existing images from folder: ${folder}`);
  return res;
}

// Utility: upload all images from local folder
async function uploadImages() {
  const files = fs.readdirSync(localDir);
  const imageMap = [];

  for (const file of files) {
    const filePath = path.join(localDir, file);
    const id = nanoid();

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: id, // use nanoid, not filename
      use_filename: false,
      overwrite: true,
    });

    imageMap.push({
      filename: file,
      nanoId: id,
      url: result.secure_url,
      public_id: result.public_id,
    });

    console.log(`Uploaded: ${file} → ${result.secure_url}`);
  }

  // Save mapping for data_init.js to use
  fs.writeFileSync("image_map.json", JSON.stringify(imageMap, null, 2));
  console.log("Saved image_map.json");
}

(async () => {
  await clearCloudinaryFolder();
  await uploadImages();
  console.log("Image initialization complete!");
})();
