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
  
  // Use _id from MongoDB (fallback to id if not present)
  const productId = product._id || product.id;
  const isInWishlist = wishlist.some(item => (item._id || item.id) === productId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      showNotification('Please login to add items to your collection', 'info');
      return;
    }
    // Pass the full product object (StoreContext expects product with _id)
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
      whileHover={{ y: -8 }}
      className="group relative flex flex-col h-full"
    >
      <Link to={`/product/${productId}`} className="block relative overflow-hidden rounded-[2.5rem] bg-layer-luxe aspect-[3/4]">
        {/* Badges */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          {product.isNew && (
            <div className="bg-white/90 backdrop-blur text-primary-luxe text-[8px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-sm flex items-center space-x-1">
               <Sparkles size={10} className="text-secondary-luxe" />
               <span>New Archive</span>
            </div>
          )}
          {product.isSale && (
            <div className="bg-secondary-luxe text-white text-[8px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-sm">
               Archive Sale
            </div>
          )}
        </div>

        {/* Actions Overlay */}
        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center items-center gap-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <button 
            onClick={handleAddToCart}
            className="w-14 h-14 bg-primary-luxe text-white rounded-full flex items-center justify-center hover:bg-secondary-luxe transition-all shadow-xl hover:scale-105 active:scale-95"
            title="Add to Collection"
          >
            <ShoppingBag size={18} />
          </button>
          <button 
            onClick={handleWishlist}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 ${
              isInWishlist ? 'bg-secondary-luxe text-white' : 'bg-white text-primary-luxe hover:bg-layer-luxe'
            }`}
            title="Mark as Aspiration"
          >
            <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
          </button>
          <Link 
            to={`/product/${productId}`}
            className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 transition-all hover:bg-white hover:text-primary-luxe"
            title="Quick View"
          >
            <Eye size={18} />
          </Link>
        </div>

        {/* Thumbnail */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
          referrerPolicy="no-referrer"
        />
        
        <div className="absolute inset-0 bg-primary-luxe/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </Link>

      <div className="py-8 space-y-3 px-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-luxe/40 flex items-center space-x-2">
               <span>{product.category}</span>
            </p>
            <h3 className="text-xl font-display uppercase tracking-tight text-primary-luxe group-hover:text-secondary-luxe transition-colors">
              {product.name}
            </h3>
          </div>
          <p className="text-sm font-mono font-bold tracking-tighter text-primary-luxe/80 transform translate-y-1">
            ${(product.isSale && product.salePrice ? product.salePrice : product.price).toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border-luxe/10">
           <div className="flex items-center space-x-1 opacity-40">
              <div className="w-2 h-2 rounded-full bg-secondary-luxe"></div>
              <span className="text-[8px] font-bold uppercase tracking-widest">
                {product.stock > 0 ? 'In Stock' : 'Sold Out'}
              </span>
           </div>
           <div className="bg-layer-luxe h-px flex-1 mx-4"></div>
           <span className="text-[8px] font-bold uppercase tracking-widest text-border-luxe">
             Protocol: AU-{productId?.slice?.(-6) || '000'}
           </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;