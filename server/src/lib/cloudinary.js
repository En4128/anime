import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

if (env.cloudinaryUrl) {
  cloudinary.config({ secure: true });
}

export const uploadToCloudinary = async (filePath, folder = 'animeverse') => {
  if (!env.cloudinaryUrl) return null;
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return result.secure_url;
};

