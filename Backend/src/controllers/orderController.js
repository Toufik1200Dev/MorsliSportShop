import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.productId', 'Product_name Product_img')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private/Admin
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res, next) => {
  try {
    const {
      clientName,
      email,
      phone,
      address,
      city,
      wilaya,
      items,
      subtotal,
      deliveryPrice,
      total,
      deliveryType,
    } = req.body;

    // Validate required fields
    if (!clientName || !phone || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Client name, phone, and items are required',
      });
    }

    // Verify products exist
    for (const item of items) {
      if (item.productId) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            error: `Product with ID ${item.productId} not found`,
          });
        }
      }
    }

    const order = await Order.create({
      clientName: String(clientName).trim(),
      email: String(email || '').trim(),
      phone: String(phone).trim(),
      address: String(address || '').trim(),
      city: String(city || '').trim(),
      wilaya: String(wilaya || '').trim(),
      items: Array.isArray(items) ? items : [],
      subtotal: parseFloat(subtotal) || 0,
      deliveryPrice: parseFloat(deliveryPrice) || 0,
      total: parseFloat(total) || 0,
      deliveryType: String(deliveryType || 'bureau').trim(),
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'deleted'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: pending, confirmed, or deleted',
      });
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    // Calculate scheduled deletion time
    let scheduledDeleteAt = null;
    const now = new Date();
    
    if (status === 'deleted') {
      // Delete after 1 day
      scheduledDeleteAt = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    } else if (status === 'confirmed') {
      // Delete after 3 days
      scheduledDeleteAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    }

    order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        scheduledDeleteAt,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete old orders
// @route   DELETE /api/orders/cleanup
// @access  Private/Admin
export const deleteOldOrders = async (req, res, next) => {
  try {
    const deletedCount = await Order.deleteOldOrders();
    
    res.status(200).json({
      success: true,
      message: `Deleted ${deletedCount} old orders`,
      deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

