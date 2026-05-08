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
      showNotification('Please login to add items to your collection', 'info');
      return;
    }
    addToCart(product, 1, 'M');
    showNotification(`Archived ${product.name} to your collection.`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) {
      showNotification('Please login to save items to your wishlist', 'info');
      return;
    }
    toggleWishlist(product);
    showNotification(isInWishlist ? "Removed from aspirations." : "Marked for future collection.", 'info');
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
        className="block relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-layer-luxe aspect-[3/4]"
      >
        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 md:top-6 md:left-6 z-10 flex flex-col gap-1 sm:gap-2">
          {product.isNew && (
            <div className="bg-white/90 backdrop-blur text-primary-luxe text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] px-2 py-0.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 rounded-full shadow-sm flex items-center space-x-1">
              <Sparkles size={8} className="text-secondary-luxe sm:w-2 sm:h-2 md:w-3 md:h-3" />
              <span className="whitespace-nowrap">New</span>
            </div>
          )}
          {product.isSale && (
            <div className="bg-secondary-luxe text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] px-2 py-0.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 rounded-full shadow-sm">
              <span className="whitespace-nowrap">Sale</span>
            </div>
          )}
        </div>

        {/* Action Buttons – visible on hover for desktop, always visible on mobile */}
        <div className="absolute inset-x-0 bottom-2 sm:bottom-4 md:bottom-8 z-10 flex justify-center items-center gap-2 sm:gap-3 md:gap-4 
                        opacity-0 translate-y-2 md:translate-y-4 
                        group-hover:opacity-100 group-hover:translate-y-0 
                        max-sm:opacity-100 max-sm:translate-y-0    /* force visible on mobile */
                        transition-all duration-500">
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center hover:bg-[#6F472C] transition-all shadow-lg hover:scale-105 active:scale-95"
            title="Add to Collection"
          >
            <ShoppingBag size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 ${
              isInWishlist ? 'bg-[#8B5E3C] text-white' : 'bg-[#8B5E3C] text-white hover:bg-[#6F472C]'
            }`}
            title="Mark as Aspiration"
          >
            <Heart size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" fill={isInWishlist ? "currentColor" : "none"} />
          </button>
          <Link
            to={`/product/${productId}`}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center border border-white/20 transition-all hover:bg-[#6F472C]"
            title="Quick View"
          >
            <Eye size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </Link>
        </div>

        {/* Image – original colors (no grayscale) */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />

        <div className="absolute inset-0 bg-primary-luxe/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Text area */}
      <div className="py-3 sm:py-5 md:py-8 space-y-1 sm:space-y-2 md:space-y-3 px-1 sm:px-2">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-0.5 sm:space-y-1 md:space-y-1">
            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-text-luxe/40">
              {product.category}
            </p>
            <h3 className="text-xs sm:text-base md:text-xl font-display uppercase tracking-tight text-primary-luxe group-hover:text-secondary-luxe transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>
          <p className="text-[10px] sm:text-xs md:text-sm font-mono font-bold tracking-tighter text-primary-luxe/80 whitespace-nowrap">
            ${(product.isSale && product.salePrice ? product.salePrice : product.price).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 sm:pt-2 border-t border-border-luxe/10">
          <div className="flex items-center space-x-1 opacity-40">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-secondary-luxe"></div>
            <span className="text-[7px] sm:text-[8px] md:text-[8px] font-bold uppercase tracking-widest">
              {product.stock > 0 ? 'In Stock' : 'Sold Out'}
            </span>
          </div>
          <div className="bg-layer-luxe h-px flex-1 mx-2 sm:mx-3 md:mx-4"></div>
          <span className="text-[6px] sm:text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-border-luxe">
            AU-{productId?.slice?.(-6) || '000'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;