import Product from '../models/Product.js';
import { validationResult } from 'express-validator';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    
    // Build query
    let query = {};
    if (category && category !== 'all') {
      query.Product_category = category;
    }
    if (search) {
      query.Product_name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .select('-Product_desctiption'); // Exclude description for list view

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const {
      Product_name,
      Product_desctiption,
      Product_price,
      Product_img,
      Product_category,
      Product_sizes,
      Product_color,
      stock,
    } = req.body;

    // Validate required fields
    if (!Product_name || !Product_price) {
      return res.status(400).json({
        success: false,
        error: 'Product name and price are required',
      });
    }

    // Get uploaded images from middleware
    let imageUrls = [];
    if (req.body.uploadedImages && Array.isArray(req.body.uploadedImages)) {
      imageUrls = req.body.uploadedImages;
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one image is required',
      });
    }

    // Ensure category is valid
    const validCategories = ['Football', 'Sport de Combat', 'Gym'];
    const category = validCategories.includes(Product_category) ? Product_category : 'Gym';

    // Parse sizes and colors if they come as JSON strings
    let sizes = [];
    let colors = [];
    try {
      sizes = Array.isArray(Product_sizes) 
        ? Product_sizes 
        : (typeof Product_sizes === 'string' ? JSON.parse(Product_sizes) : []);
      colors = Array.isArray(Product_color) 
        ? Product_color 
        : (typeof Product_color === 'string' ? JSON.parse(Product_color) : []);
    } catch (e) {
      sizes = [];
      colors = [];
    }

    const product = await Product.create({
      Product_name: String(Product_name).trim(),
      Product_desctiption: String(Product_desctiption || '').trim(),
      Product_price: parseInt(Product_price) || 0,
      Product_img: imageUrls,
      Product_category: category,
      Product_sizes: sizes,
      Product_color: colors,
      stock: parseInt(stock) || 0,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const {
      Product_name,
      Product_desctiption,
      Product_price,
      Product_img,
      Product_category,
      Product_sizes,
      Product_color,
      stock,
      existingImages,
      removedImages,
    } = req.body;

    // Validate required fields
    if (!Product_name || !Product_price) {
      return res.status(400).json({
        success: false,
        error: 'Product name and price are required',
      });
    }

    // Handle image URLs - combine existing and new
    let imageUrls = [];
    
    // Add existing images (if provided)
    if (existingImages && Array.isArray(existingImages)) {
      imageUrls.push(...existingImages);
    }
    
    // Add new images from upload middleware
    if (req.body.uploadedImages && Array.isArray(req.body.uploadedImages)) {
      imageUrls.push(...req.body.uploadedImages);
    }

    // Remove deleted images from Cloudinary
    if (removedImages && Array.isArray(removedImages)) {
      for (const imageUrl of removedImages) {
        if (typeof imageUrl === 'string' && imageUrl.includes('cloudinary.com')) {
          await deleteImageFromCloudinary(imageUrl);
        }
      }
      // Filter out removed images from URLs
      imageUrls = imageUrls.filter(url => !removedImages.includes(url));
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one image is required',
      });
    }

    // Ensure category is valid
    const validCategories = ['Football', 'Sport de Combat', 'Gym'];
    const category = validCategories.includes(Product_category) ? Product_category : 'Gym';

    // Parse sizes and colors if they come as JSON strings
    let sizes = [];
    let colors = [];
    try {
      sizes = Array.isArray(Product_sizes) 
        ? Product_sizes 
        : (typeof Product_sizes === 'string' ? JSON.parse(Product_sizes) : []);
      colors = Array.isArray(Product_color) 
        ? Product_color 
        : (typeof Product_color === 'string' ? JSON.parse(Product_color) : []);
    } catch (e) {
      sizes = product.Product_sizes || [];
      colors = product.Product_color || [];
    }

    // Store old images to delete if they're being replaced
    const oldImages = product.Product_img || [];
    const imagesToDelete = oldImages.filter(img => !imageUrls.includes(img));

    // Delete old images from Cloudinary that are no longer used
    for (const imageUrl of imagesToDelete) {
      if (typeof imageUrl === 'string' && imageUrl.includes('cloudinary.com')) {
        await deleteImageFromCloudinary(imageUrl);
      }
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        Product_name: String(Product_name).trim(),
        Product_desctiption: String(Product_desctiption || '').trim(),
        Product_price: parseInt(Product_price) || 0,
        Product_img: imageUrls,
        Product_category: category,
        Product_sizes: sizes,
        Product_color: colors,
        stock: parseInt(stock) || 0,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Delete images from Cloudinary before deleting product
    if (product.Product_img && Array.isArray(product.Product_img)) {
      for (const imageUrl of product.Product_img) {
        if (typeof imageUrl === 'string' && imageUrl.includes('cloudinary.com')) {
          await deleteImageFromCloudinary(imageUrl);
        }
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

