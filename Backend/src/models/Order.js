import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    wilaya: {
      type: String,
      trim: true,
    },
    items: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          productName: String,
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true,
            min: 0,
          },
          size: String,
          color: String,
        },
      ],
      required: true,
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryType: {
      type: String,
      default: 'bureau',
      enum: ['bureau', 'domicile'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'deleted'],
      default: 'pending',
    },
    scheduledDeleteAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ scheduledDeleteAt: 1 });

// Auto-delete functionality
orderSchema.statics.deleteOldOrders = async function() {
  const now = new Date();
  
  // Find orders that should be deleted
  const ordersToDelete = await this.find({
    $or: [
      { status: 'deleted', scheduledDeleteAt: { $lte: now } },
      { status: 'confirmed', scheduledDeleteAt: { $lte: now } },
    ],
  });

  if (ordersToDelete.length > 0) {
    const result = await this.deleteMany({
      _id: { $in: ordersToDelete.map(o => o._id) },
    });
    return result.deletedCount;
  }
  
  return 0;
};

const Order = mongoose.model('Order', orderSchema);

export default Order;

