import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';
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
        <div className="card-luxe p-20 space-y-8">
          <ShoppingBag size={48} className="mx-auto text-border-luxe" />
          <h2 className="text-3xl font-display">Please Login to View Your Collection</h2>
          <Link to="/auth" className="inline-block px-10 py-4 bg-primary-luxe text-white rounded-full text-xs font-bold uppercase tracking-widest">Sign In</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-40 border-2 border-dashed border-border-luxe/20 rounded-[4rem] space-y-12">
          <div className="mx-auto w-24 h-24 bg-layer-luxe rounded-full flex items-center justify-center text-border-luxe mb-8"><ShoppingBag size={40} /></div>
          <div className="space-y-4"><h3 className="text-3xl font-display">Your Bag is Empty</h3></div>
          <Link to="/products" className="inline-flex items-center space-x-4 bg-primary-luxe text-white px-12 py-5 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-secondary-luxe transition-all">Shop Now</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40">
      <div className="space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border-luxe/10 pb-12">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Shopping Bag</span>
            <h1 className="text-6xl font-display uppercase tracking-tight">Your <span className="italic">Sphere</span></h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div key={item._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="group card-luxe p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 relative overflow-hidden">
                  <div className="w-full md:w-32 lg:w-48 aspect-square rounded-2xl overflow-hidden bg-layer-luxe border border-border-luxe/10">
                    <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover grayscale transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 space-y-4 md:space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-secondary-luxe">{item.product?.category}</span>
                        <h3 className="text-xl md:text-2xl font-display tracking-tight">{item.product?.name}</h3>
                      </div>
                      <p className="text-lg md:text-xl font-mono font-bold text-primary-luxe tracking-tighter">${((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 lg:gap-8 pt-2 md:pt-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-text-luxe/40">Size</span>
                        <div className="text-[10px] font-bold uppercase tracking-widest">{item.size || 'M'}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-text-luxe/40">Qty</span>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-secondary-luxe text-white flex items-center justify-center hover:bg-highlight-luxe transition-colors">-</button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-secondary-luxe text-white flex items-center justify-center hover:bg-highlight-luxe transition-colors">+</button>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-6 pt-2">
                      <button onClick={() => handleRemove(item._id)} className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:opacity-100 opacity-60 transition-opacity">
                        <Trash2 size={14} /><span>Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="space-y-8">
            <div className="card-luxe p-6 md:p-10 space-y-8 md:space-y-10 sticky top-32 border-2 border-primary-luxe/10">
              <h3 className="text-2xl md:text-3xl font-display uppercase tracking-tight">Summary</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-[10px] uppercase tracking-widest text-text-luxe/40">Subtotal</span>
                  <span className="font-mono font-bold">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-[10px] uppercase tracking-widest text-text-luxe/40">Shipping</span>
                  <span className="font-mono font-bold">{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                </div>
                <div className="pt-8 border-t border-border-luxe/10 flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary-luxe block">Total</span>
                    <p className="text-4xl font-mono font-bold tracking-tighter text-primary-luxe">${total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <Link to="/checkout" className="w-full h-16 bg-primary-luxe text-white rounded-full flex items-center justify-center uppercase tracking-widest text-xs font-bold hover:bg-secondary-luxe transition-all shadow-2xl">Checkout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;