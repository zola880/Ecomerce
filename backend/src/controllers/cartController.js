import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  res.json(new ApiResponse(200, cart));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size } = req.body;
  
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId && item.size === size
  );
  
  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, size });
  }
  
  await cart.save();
  await cart.populate('items.product');
  res.json(new ApiResponse(200, cart, 'Item added to cart'));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');
  
  const item = cart.items.id(req.params.itemId);
  if (!item) throw new ApiError(404, 'Item not found');
  
  item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product');
  res.json(new ApiResponse(200, cart, 'Cart updated'));
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');
  
  cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
  await cart.save();
  await cart.populate('items.product');
  res.json(new ApiResponse(200, cart, 'Item removed'));
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json(new ApiResponse(200, null, 'Cart cleared'));
});