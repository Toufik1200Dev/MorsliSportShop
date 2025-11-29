import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected admin routes
router.post(
  '/',
  protect,
  admin,
  upload.array('images', 10), // Allow up to 10 images
  uploadToCloudinary,
  createProduct
);
router.put(
  '/:id',
  protect,
  admin,
  upload.array('images', 10), // Allow up to 10 images
  uploadToCloudinary,
  updateProduct
);
router.delete('/:id', protect, admin, deleteProduct);

export default router;

