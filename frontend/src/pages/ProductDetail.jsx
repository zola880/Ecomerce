import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { productAPI, reviewAPI } from '../services/api';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ReviewSystem from '../components/Product/ReviewSystem';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [reviews, setReviews] = useState([]);
  
  const { addToCart, toggleWishlist, wishlist, addRecentlyViewed } = useStore();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const [productRes, reviewsRes] = await Promise.all([
          productAPI.getProduct(id),
          reviewAPI.getProductReviews(id),
        ]);
        setProduct(productRes.data.data);
        setReviews(reviewsRes.data.data);
        addRecentlyViewed(productRes.data.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError(true);
        if (error.response?.status === 404) {
          showNotification('Product not found', 'error');
        } else {
          showNotification('Could not load product details', 'error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
    // Cleanup: no need to reset fetchedRef on unmount, but okay
  }, [id]); // Only depend on id, not on addRecentlyViewed/showNotification

  if (loading) {
    return <div className="h-screen flex items-center justify-center font-display text-4xl animate-pulse">Tracing Archive Path...</div>;
  }

  if (error || !product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-display mb-4">Product Not Found</h1>
        <p className="text-text-luxe/60 mb-8">The piece you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="px-8 py-4 bg-primary-luxe text-white rounded-full text-xs font-bold uppercase tracking-widest">
          Browse Collection
        </Link>
      </div>
    );
  }

  const isInWishlist = wishlist.some(item => item._id === product._id);

  const handleAddToCart = () => {
    if (!user) {
      showNotification('Please login to add items to your collection', 'info');
      return;
    }
    addToCart(product, quantity, selectedSize);
    showNotification(`Archived ${product.name} to your collection.`);
  };

  const handleWishlist = () => {
    if (!user) {
      showNotification('Please login to save items to your wishlist', 'info');
      return;
    }
    toggleWishlist(product);
    showNotification(isInWishlist ? "Removed from acquisitions plan." : "Marked for future collection.", 'info');
  };

  return (
    <div className="pb-32">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-text-luxe/40 mb-12">
          <Link to="/" className="hover:text-primary-luxe">Aura</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-luxe">Archives</Link>
          <span>/</span>
          <span className="text-secondary-luxe">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-32">
          {/* Gallery */}
          <div className="space-y-8">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-layer-luxe relative group"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {product.isNew && (
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl">
                  Release 2026.1
                </div>
              )}
            </motion.div>
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:border-secondary-luxe border-2 border-transparent transition-all opacity-60 hover:opacity-100">
                    <img src={img} alt="Detail" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-12 py-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary-luxe">Aura Artisan Collection</span>
                 <div className="flex items-center space-x-1 text-highlight-luxe">
                   <Star size={14} fill="currentColor" />
                   <span className="text-xs font-bold font-mono">{product.rating || 4.8}</span>
                 </div>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-display leading-[0.95] tracking-tight">{product.name}</h1>
              <div className="flex items-end space-x-4">
                <p className="text-4xl font-mono font-bold text-primary-luxe tracking-tighter">
                  ${(product.isSale && product.salePrice ? product.salePrice : product.price).toLocaleString()}
                </p>
                {product.isSale && (
                  <p className="text-sm line-through text-text-luxe/40 mb-2">${product.price.toLocaleString()}</p>
                )}
                <p className="text-xs text-text-luxe/40 mb-2 font-medium tracking-widest uppercase italic">Valuation Excl. Logistics</p>
              </div>
              <p className="text-lg text-text-luxe/60 leading-relaxed max-w-xl">{product.description}</p>
            </div>

            {/* Size and quantity */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Dimension Protocol</h4>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe border-b border-secondary-luxe/30 pb-0.5">Schematics</button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center font-mono text-sm font-bold border-2 transition-all ${
                        selectedSize === size ? 'bg-primary-luxe text-white border-primary-luxe shadow-xl' : 'border-border-luxe/20 hover:border-primary-luxe/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <div className="flex items-center bg-layer-luxe/50 border border-border-luxe/20 rounded-2xl p-2 h-16">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-colors font-bold text-xl">-</button>
                    <span className="w-12 text-center font-mono font-bold text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-colors font-bold text-xl">+</button>
                 </div>
                 <button 
                  onClick={handleAddToCart}
                  className="flex-1 w-full sm:w-auto h-16 bg-primary-luxe text-white rounded-2xl flex items-center justify-center space-x-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-secondary-luxe transition-all shadow-2xl shadow-primary-luxe/20 active:scale-95"
                 >
                   <ShoppingBag size={18} />
                   <span>Collect Piece</span>
                 </button>
                 <button 
                  onClick={handleWishlist}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
                    isInWishlist ? 'border-secondary-luxe bg-secondary-luxe text-white shadow-xl' : 'border-border-luxe/20 hover:border-secondary-luxe/40'
                  }`}
                 >
                   <Heart size={22} fill={isInWishlist ? "currentColor" : "none"} />
                 </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border-luxe/10">
               {[
                 { icon: Truck, title: 'White Glove', desc: 'Complimentary room setup' },
                 { icon: Award, title: 'Lifetime Warranty', desc: 'Structural integrity guarantee' },
                 { icon: ShieldCheck, title: 'Authenticity', desc: 'Holographic origin certificate' },
                 { icon: RotateCcw, title: '30 Day Return', desc: 'Satisfactory protocol' },
               ].map((benefit, i) => (
                 <div key={i} className="flex space-x-4">
                    <div className="text-secondary-luxe mt-1"><benefit.icon size={18} /></div>
                    <div className="space-y-1">
                       <h5 className="text-[10px] font-bold uppercase tracking-widest">{benefit.title}</h5>
                       <p className="text-xs text-text-luxe/40">{benefit.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20 lg:mt-40">
           <div className="flex space-x-8 md:space-x-12 border-b border-border-luxe/10 mb-10 md:mb-16 overflow-x-auto no-scrollbar">
              {['Specs', 'Narrative', 'Curation'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`pb-8 text-xs font-bold uppercase tracking-[0.3em] transition-all relative ${
                    activeTab === tab.toLowerCase() ? 'text-primary-luxe' : 'text-text-luxe/30'
                  }`}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && <motion.div layoutId="activeTabProduct" className="absolute bottom-0 left-0 w-full h-1 bg-secondary-luxe rounded-full" />}
                </button>
              ))}
           </div>

           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                     <div className="space-y-10">
                        <h3 className="text-2xl font-display">Technical <span className="italic">Schematics</span></h3>
                        <div className="space-y-6">
                           <div className="flex justify-between items-end border-b border-border-luxe/10 pb-4">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Material Composition</span>
                              <span className="text-sm font-medium">{product.material || 'European Oak, Natural Linseed Oil'}</span>
                           </div>
                           <div className="flex justify-between items-end border-b border-border-luxe/10 pb-4">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Dimensions</span>
                              <span className="text-sm font-medium">{product.dimensions ? `${product.dimensions.height}H x ${product.dimensions.width}W x ${product.dimensions.depth}D` : 'Standard dimension protocol'}</span>
                           </div>
                           <div className="flex justify-between items-end border-b border-border-luxe/10 pb-4">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Stock Status</span>
                              <span className="text-sm font-medium text-green-600">{product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
                {activeTab === 'narrative' && (
                  <div className="max-w-3xl mx-auto space-y-10 text-center">
                     <h3 className="text-4xl font-display tracking-tight text-primary-luxe italic">"{product.description.substring(0, 100)}..."</h3>
                     <p className="text-lg text-text-luxe/70 leading-relaxed">{product.description}</p>
                  </div>
                )}
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Reviews */}
        <div className="mt-40">
           <ReviewSystem productId={product._id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;