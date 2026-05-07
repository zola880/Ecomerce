import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  
  let query = {};
  
  // Filter by category
  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category;
  }
  
  // Filter by sale
  if (req.query.sale === 'true') {
    query.isSale = true;
  }
  
  // Search
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  
  // Price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }
  
  let sort = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'Price: Low to High':
        sort.price = 1;
        break;
      case 'Price: High to Low':
        sort.price = -1;
        break;
      case 'Rating':
        sort.rating = -1;
        break;
      default:
        sort.createdAt = -1;
    }
  } else {
    sort.createdAt = -1;
  }
  
  const products = await Product.find(query).sort(sort).skip(skip).limit(limit);
  const total = await Product.countDocuments(query);
  
  res.json(new ApiResponse(200, {
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  }));
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  res.json(new ApiResponse(200, product));
});

// @desc    Create product (admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  
  Object.assign(product, req.body);
  const updatedProduct = await product.save();
  res.json(new ApiResponse(200, updatedProduct, 'Product updated'));
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  await product.deleteOne();
  res.json(new ApiResponse(200, null, 'Product deleted'));
});

// @desc    Get top products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestSeller: true }).limit(4);
  res.json(new ApiResponse(200, products));
});