import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || 'dfcgrzmwi',
  api_key: process.env.CLOUDINARY_KEY || '126439983297122',
  api_secret: process.env.CLOUDINARY_SECRET || 'Hs0VY34dnggG5op-VVc0heAkOkQ',
  secure: true,
});

// Upload image to Cloudinary (no file size limit - Cloudinary handles large files)
export const uploadImageToCloudinary = async (fileBuffer, folder = 'morsli-sport-shop') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        // No file size limit - Cloudinary can handle files up to 100MB
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(fileBuffer);
  });
};

// Delete image from Cloudinary by URL
export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = filename.split('.')[0];
    
    // Get folder structure if exists
    const folderIndex = urlParts.findIndex(part => part === 'image' || part === 'upload');
    let fullPublicId = publicId;
    
    if (folderIndex !== -1 && urlParts[folderIndex + 1]) {
      // Check if there's a version number
      const versionMatch = urlParts[urlParts.length - 2];
      if (versionMatch && /^\d+$/.test(versionMatch)) {
        // Version exists, extract folder from path
        const pathParts = urlParts.slice(folderIndex + 2, -2);
        if (pathParts.length > 0) {
          fullPublicId = `${pathParts.join('/')}/${publicId}`;
        }
      } else {
        // No version, extract folder from path
        const pathParts = urlParts.slice(folderIndex + 1, -1);
        if (pathParts.length > 0) {
          fullPublicId = `${pathParts.join('/')}/${publicId}`;
        }
      }
    }

    const result = await cloudinary.uploader.destroy(fullPublicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    // Don't throw error, just log it (image might not be from Cloudinary)
    return { result: 'ok' };
  }
};

export default cloudinary;

