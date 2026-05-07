import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { ORDER_STATUS } from '../config/constants.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;
  
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'No cart items');
  }
  
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    size: item.size,
    image: item.product.image,
  }));
  
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  });
  
  // Clear cart after order
  await Cart.findOneAndDelete({ user: req.user._id });
  
  res.status(201).json(new ApiResponse(201, order, 'Order created successfully'));
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }
  res.json(new ApiResponse(200, order));
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json(new ApiResponse(200, orders));
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt').skip(skip).limit(limit);
  const total = await Order.countDocuments();
  
  res.json(new ApiResponse(200, {
    orders,
    page,
    pages: Math.ceil(total / limit),
    total,
  }));
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  
  order.status = status || order.status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === ORDER_STATUS.DELIVERED) order.isDelivered = true;
  
  await order.save();
  res.json(new ApiResponse(200, order, 'Order status updated'));
});

// @desc    Update payment status (mock/stripe webhook would handle)
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };
  
  const updatedOrder = await order.save();
  res.json(new ApiResponse(200, updatedOrder, 'Order marked as paid'));
});