import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const productId = product._id || product.id;
  const isInWishlist = wishlist.some(item => (item._id || item.id) === productId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      showNotification('Please login to add items', 'info');
      return;
    }
    addToCart(product, 1, 'M');
    showNotification(`Added ${product.name} to your collection.`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) {
      showNotification('Please login to save items', 'info');
      return;
    }
    toggleWishlist(product);
    showNotification(isInWishlist ? "Removed from wishlist." : "Added to wishlist.", 'info');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col h-full"
    >
      <Link
        to={`/product/${productId}`}
        className="block relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-layer-luxe aspect-[3/4]"
      >
        {/* Badges – smaller on mobile */}
        <div className="absolute top-1 left-1 sm:top-3 sm:left-3 md:top-5 md:left-5 z-10 flex flex-col gap-0.5 sm:gap-1 md:gap-2">
          {product.isNew && (
            <div className="bg-white/90 backdrop-blur text-primary-luxe text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-3 md:py-1 rounded-full shadow-sm flex items-center space-x-0.5">
              <Sparkles size={6} className="text-secondary-luxe sm:w-1.5 sm:h-1.5 md:w-2 md:h-2" />
              <span className="whitespace-nowrap">New</span>
            </div>
          )}
          {product.isSale && (
            <div className="bg-secondary-luxe text-white text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-3 md:py-1 rounded-full shadow-sm">
              <span className="whitespace-nowrap">Sale</span>
            </div>
          )}
        </div>

        {/* Action buttons – always visible on mobile, hidden on desktop until hover */}
        <div className="absolute inset-x-0 bottom-1 sm:bottom-3 md:bottom-6 z-10 flex justify-center items-center gap-1.5 sm:gap-2 md:gap-3 opacity-0 sm:opacity-0 translate-y-1 sm:translate-y-2 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 max-sm:opacity-100 max-sm:translate-y-0">
          <button onClick={handleAddToCart} className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center hover:bg-[#6F472C] transition-all shadow-md hover:scale-105 active:scale-95">
            <ShoppingBag size={12} className="sm:w-3.5 sm:h-3.5 md:w-5 md:h-5" />
          </button>
          <button onClick={handleWishlist} className={`w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95 ${isInWishlist ? 'bg-[#8B5E3C] text-white' : 'bg-[#8B5E3C] text-white hover:bg-[#6F472C]'}`}>
            <Heart size={12} className="sm:w-3.5 sm:h-3.5 md:w-5 md:h-5" fill={isInWishlist ? "currentColor" : "none"} />
          </button>
          <Link to={`/product/${productId}`} className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 transition-all hover:bg-white hover:text-[#8B5E3C]">
            <Eye size={12} className="sm:w-3.5 sm:h-3.5 md:w-5 md:h-5" />
          </Link>
        </div>

        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-primary-luxe/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Text section – compact on mobile */}
      <div className="py-2 sm:py-4 md:py-6 space-y-0.5 sm:space-y-1.5 md:space-y-2 px-1 sm:px-2">
        <div className="flex justify-between items-start gap-1">
          <div className="space-y-0">
            <p className="hidden sm:block text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] text-text-luxe/40">
              {product.category}
            </p>
            <h3 className="text-[11px] sm:text-sm md:text-lg font-display uppercase tracking-tight text-primary-luxe group-hover:text-secondary-luxe transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>
          <p className="text-[9px] sm:text-[11px] md:text-base font-mono font-bold tracking-tighter text-primary-luxe/80 whitespace-nowrap">
            ${(product.isSale && product.salePrice ? product.salePrice : product.price).toLocaleString()}
          </p>
        </div>

        {/* Stock & protocol – hidden on mobile, visible on tablet/desktop */}
        <div className="hidden sm:flex items-center justify-between pt-1 sm:pt-2 border-t border-border-luxe/10">
          <div className="flex items-center space-x-1 opacity-40">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-secondary-luxe"></div>
            <span className="text-[6px] sm:text-[7px] md:text-[8px] font-bold uppercase tracking-widest">
              {product.stock > 0 ? 'In Stock' : 'Sold Out'}
            </span>
          </div>
          <div className="bg-layer-luxe h-px flex-1 mx-2 sm:mx-3"></div>
          <span className="text-[5px] sm:text-[6px] md:text-[7px] font-bold uppercase tracking-widest text-border-luxe">
            AU-{productId?.slice?.(-6) || '000'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;