import multer from 'multer';
import { uploadImageToCloudinary } from '../config/cloudinary.js';

// Configure multer for memory storage (we'll upload directly to Cloudinary)
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(file.mimetype.toLowerCase());
  
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Configure multer (no file size limit - Cloudinary will handle large files)
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit per file (Cloudinary's max)
    files: 10, // Max 10 files per request
  },
  fileFilter: fileFilter,
});

// Middleware to upload images to Cloudinary and attach URLs to req.body
export const uploadToCloudinary = async (req, res, next) => {
  try {
    // Parse JSON strings from form data
    if (req.body.Product_sizes && typeof req.body.Product_sizes === 'string') {
      try {
        req.body.Product_sizes = JSON.parse(req.body.Product_sizes);
      } catch (e) {
        req.body.Product_sizes = [];
      }
    }
    
    if (req.body.Product_color && typeof req.body.Product_color === 'string') {
      try {
        req.body.Product_color = JSON.parse(req.body.Product_color);
      } catch (e) {
        req.body.Product_color = [];
      }
    }
    
    if (req.body.existingImages && typeof req.body.existingImages === 'string') {
      try {
        req.body.existingImages = JSON.parse(req.body.existingImages);
      } catch (e) {
        req.body.existingImages = [];
      }
    }
    
    if (req.body.removedImages && typeof req.body.removedImages === 'string') {
      try {
        req.body.removedImages = JSON.parse(req.body.removedImages);
      } catch (e) {
        req.body.removedImages = [];
      }
    }
    
    // Upload new files to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadedUrls = [];
      
      // Upload each file to Cloudinary
      for (const file of req.files) {
        const imageUrl = await uploadImageToCloudinary(file.buffer, 'morsli-sport-shop/products');
        uploadedUrls.push(imageUrl);
      }
      
      // Store new uploaded URLs in req.body.images (will be merged with existing in controller)
      req.body.uploadedImages = uploadedUrls;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

