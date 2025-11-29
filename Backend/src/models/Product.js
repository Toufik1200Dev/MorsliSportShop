import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    Product_name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    Product_desctiption: {
      type: String,
      default: '',
      trim: true,
    },
    Product_price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },
    Product_img: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          return v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    Product_category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Football', 'Sport de Combat', 'Gym'],
      default: 'Gym',
    },
    Product_sizes: {
      type: [String],
      default: [],
    },
    Product_color: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
  },
  {
    timestamps: true, // Creates createdAt and updatedAt automatically
  }
);

// Index for better query performance
productSchema.index({ Product_category: 1, createdAt: -1 });
productSchema.index({ Product_name: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;

