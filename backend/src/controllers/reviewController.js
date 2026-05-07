import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  
  // Check if user has purchased this product
  const orders = await Order.find({ user: req.user._id, isPaid: true });
  const hasPurchased = orders.some(order =>
    order.orderItems.some(item => item.product.toString() === productId)
  );
  
  if (!hasPurchased && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only review products you have purchased');
  }
  
  const existingReview = await Review.findOne({ product: productId, user: req.user._id });
  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this product');
  }
  
  const review = await Review.create({
    product: productId,
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
    verified: hasPurchased,
  });
  
  // Update product rating
  const reviews = await Review.find({ product: productId });
  product.numReviews = reviews.length;
  product.rating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await product.save();
  
  res.status(201).json(new ApiResponse(201, review, 'Review added'));
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).sort('-createdAt');
  res.json(new ApiResponse(200, reviews));
});