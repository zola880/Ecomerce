import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const handleAddToCart = (product) => {
    if (!user) {
      showNotification('Please login to add to cart', 'info');
      return;
    }
    addToCart(product);
    showNotification(`Archived ${product.name} to your collection.`);
  };

  if (!user) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40 text-center">
        <div className="card-luxe p-8 sm:p-20 space-y-8">
          <Heart size={48} className="mx-auto text-border-luxe" />
          <h2 className="text-2xl sm:text-3xl font-display">Please Login to View Your Aspirations</h2>
          <Link to="/auth" className="inline-block px-8 py-4 bg-[#8B5E3C] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors">Sign In</Link>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40 text-center">
        <div className="bg-layer-luxe/20 rounded-3xl sm:rounded-[4rem] py-20 px-6 space-y-10">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-layer-luxe rounded-full flex items-center justify-center text-border-luxe/40">
            <Heart size={40} />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-tight opacity-80">Zero Aspirations</h3>
            <p className="text-text-luxe/60 max-w-sm mx-auto text-sm">
              Explore our high-integrity pieces and mark them for your future collection.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center space-x-3 bg-[#8B5E3C] text-white px-8 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-[#6F472C] transition-all"
          >
            <span>Browse the Archive</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-20 pb-24 md:pb-40">
      <div className="space-y-12 md:space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-luxe/10 pb-8 md:pb-12">
          <div className="space-y-2 md:space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Future Acquisitions</span>
            <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tight">
              Your <span className="italic">Aspirations</span>
            </h1>
            <p className="text-text-luxe/50 text-sm hidden md:block">
              {wishlist.length} {wishlist.length === 1 ? 'piece' : 'pieces'} waiting for you
            </p>
          </div>
          <div className="text-text-luxe/50 text-sm md:hidden">
            {wishlist.length} {wishlist.length === 1 ? 'piece' : 'pieces'}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-x-8 lg:gap-y-16">
          {wishlist.map((product) => (
            <div key={product._id} className="space-y-4 sm:space-y-6">
              <ProductCard product={product} />
              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 py-3 sm:py-4 bg-[#8B5E3C] text-white rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-all flex items-center justify-center space-x-2 active:scale-95"
                >
                  <ShoppingBag size={14} />
                  <span>Collect Now</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-3 sm:p-4 bg-[#8B5E3C] text-white rounded-xl hover:bg-[#6F472C] transition-colors active:scale-95"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Optional: Add a back‑to‑shop link at the bottom */}
        <div className="pt-8 text-center border-t border-border-luxe/10">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-secondary-luxe hover:text-[#6F472C] transition-colors"
          >
            <span>Discover more pieces</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;