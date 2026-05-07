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
        <div className="card-luxe p-20 space-y-8">
          <Heart size={48} className="mx-auto text-border-luxe" />
          <h2 className="text-3xl font-display">Please Login to View Your Aspirations</h2>
          <Link to="/auth" className="inline-block px-10 py-4 bg-primary-luxe text-white rounded-full text-xs font-bold uppercase tracking-widest">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40">
      <div className="space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border-luxe/10 pb-12">
          <div className="space-y-4"><span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Future Acquisitions</span><h1 className="text-6xl font-display uppercase tracking-tight">Your <span className="italic">Aspirations</span></h1></div>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-40 bg-layer-luxe/20 rounded-[4rem] space-y-12">
            <div className="mx-auto w-24 h-24 bg-layer-luxe rounded-full flex items-center justify-center text-border-luxe/40"><Heart size={40} /></div>
            <div className="space-y-4"><h3 className="text-3xl font-display uppercase tracking-tight opacity-40">Zero Aspirations <span className="italic">Logged</span></h3><p className="text-text-luxe/60 max-w-sm mx-auto">Explore our high-integrity pieces and mark them for your future environment hierarchy.</p></div>
            <Link to="/products" className="inline-flex items-center space-x-4 bg-primary-luxe text-white px-12 py-5 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-secondary-luxe transition-all">Search the Archive</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {wishlist.map((product) => (
              <div key={product._id} className="space-y-6">
                <ProductCard product={product} />
                <div className="flex gap-4">
                  <button onClick={() => handleAddToCart(product)} className="flex-1 py-4 bg-primary-luxe text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-secondary-luxe transition-all flex items-center justify-center space-x-2"><ShoppingBag size={14} /><span>Collect Now</span></button>
                  <button onClick={() => toggleWishlist(product)} className="p-4 bg-layer-luxe rounded-xl border border-border-luxe/10 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;