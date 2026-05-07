import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();
  
  const orders = await Order.find({ isPaid: true });
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  
  const recentOrders = await Order.find({}).sort('-createdAt').limit(5).populate('user', 'name');
  
  res.json(new ApiResponse(200, {
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue,
    recentOrders,
  }));
});