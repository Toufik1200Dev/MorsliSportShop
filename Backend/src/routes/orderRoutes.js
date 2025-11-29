import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  deleteOldOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public route - anyone can create an order
router.post('/', createOrder);

// Admin routes - require authentication
router.get('/', protect, admin, getOrders);
router.get('/:id', protect, admin, getOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);
router.delete('/cleanup/old', protect, admin, deleteOldOrders);

export default router;

