import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, Zap, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal } = useStore();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const shipping = cartTotal > 5000 ? 0 : 250;
  const total = cartTotal + shipping;

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
    showNotification('Item removed from your collection.', 'info');
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartQuantity(itemId, newQuantity);
  };

  if (!user) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40 text-center">
        <div className="card-luxe p-8 sm:p-20 space-y-8">
          <ShoppingBag size={48} className="mx-auto text-border-luxe" />
          <h2 className="text-2xl sm:text-3xl font-display">Please Login to View Your Collection</h2>
          <Link to="/auth" className="inline-block px-8 py-4 bg-[#8B5E3C] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors">Sign In</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 md:py-40 border-2 border-dashed border-border-luxe/20 rounded-3xl md:rounded-[4rem] space-y-8 md:space-y-12">
          <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-layer-luxe rounded-full flex items-center justify-center text-border-luxe">
            <ShoppingBag size={40} />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-display">Your Bag is Empty</h3>
            <p className="text-text-luxe/60 text-sm">Discover our collection and add some pieces to your cart.</p>
          </div>
          <Link to="/products" className="inline-flex items-center space-x-3 bg-[#8B5E3C] text-white px-8 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-[#6F472C] transition-all">
            <ShoppingBag size={14} /><span>Shop Now</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-20 pb-24 md:pb-40">
      <div className="space-y-12 md:space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border-luxe/10 pb-8 md:pb-12">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Shopping Bag</span>
            <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tight">Your <span className="italic">Sphere</span></h1>
            <p className="text-text-luxe/50 text-sm hidden md:block">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
          </div>
          <Link to="/products" className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe hover:text-[#6F472C] transition-colors flex items-center space-x-1">
            <ArrowLeft size={12} /><span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-20">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group card-luxe p-5 md:p-8 flex flex-col sm:flex-row gap-5 md:gap-8 relative overflow-hidden"
                >
                  {/* Product Image – no grayscale */}
                  <div className="w-full sm:w-32 lg:w-40 aspect-square rounded-xl overflow-hidden bg-layer-luxe border border-border-luxe/10 flex-shrink-0">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Product Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-secondary-luxe">{item.product?.category}</span>
                        <h3 className="text-base md:text-xl font-display tracking-tight line-clamp-2">{item.product?.name}</h3>
                      </div>
                      <p className="text-sm md:text-lg font-mono font-bold text-[#8B5E3C] tracking-tighter whitespace-nowrap">
                        ${((item.product?.price || 0) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-1">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-text-luxe/40">Size</span>
                        <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{item.size || 'M'}</div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-text-luxe/40">Qty</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-layer-luxe flex items-center justify-center hover:bg-border-luxe/20 transition-colors text-sm font-bold"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-layer-luxe flex items-center justify-center hover:bg-border-luxe/20 transition-colors text-sm font-bold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex pt-2">
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="flex items-center space-x-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={12} /><span>Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary – using brand colors */}
          <div className="space-y-6">
            <div className="card-luxe p-6 md:p-8 space-y-6 md:space-y-8 sticky top-24 border-2 border-[#8B5E3C]/20 bg-white">
              <h3 className="text-2xl md:text-3xl font-display uppercase tracking-tight">Summary</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[10px] uppercase tracking-widest text-text-luxe/40">Subtotal</span>
                  <span className="font-mono font-bold text-base">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[10px] uppercase tracking-widest text-text-luxe/40">Shipping</span>
                  <span className="font-mono font-bold text-base">{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                </div>
                <div className="pt-5 border-t border-border-luxe/10 flex justify-between items-end">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary-luxe block">Total</span>
                    <p className="text-3xl md:text-4xl font-mono font-bold tracking-tighter text-[#8B5E3C]">${total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="w-full h-12 md:h-14 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center uppercase tracking-widest text-xs font-bold hover:bg-[#6F472C] transition-all shadow-lg"
              >
                Proceed to Checkout
              </Link>
              <div className="flex items-center justify-center gap-2 text-[9px] text-text-luxe/50 mt-2">
                <ShieldCheck size={12} />
                <span>Secure checkout</span>
                <Truck size={12} />
                <span>Free shipping over $5,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;