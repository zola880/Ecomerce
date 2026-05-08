import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ShieldCheck, Truck, RotateCcw, Award, Minus, Plus } from 'lucide-react';
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
  const [mainImage, setMainImage] = useState('');
  
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
        const productData = productRes.data.data;
        setProduct(productData);
        setMainImage(productData.image);
        setReviews(reviewsRes.data.data);
        addRecentlyViewed(productData);
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
  }, [id, addRecentlyViewed, showNotification]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center font-display text-4xl animate-pulse">Tracing Archive Path...</div>;
  }

  if (error || !product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-display mb-4">Product Not Found</h1>
        <p className="text-text-luxe/60 mb-8">The piece you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="px-8 py-4 bg-[#8B5E3C] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors">
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
    <div className="pb-16 md:pb-32">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-text-luxe/40 mb-6 md:mb-12 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-primary-luxe">Aura</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-luxe">Archives</Link>
          <span>/</span>
          <span className="text-secondary-luxe truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24">
          {/* Gallery */}
          <div className="space-y-4 md:space-y-6">
            {/* Main Image (no grayscale) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[4/5] rounded-2xl md:rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-layer-luxe relative group shadow-lg"
            >
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {product.isNew && (
                <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-white/90 backdrop-blur px-3 py-1 md:px-6 md:py-2 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-md z-10">
                  New Release
                </div>
              )}
            </motion.div>
            {/* Thumbnails (if multiple images, full color) */}
            {(product.images && product.images.length > 0) && (
              <div className="grid grid-cols-4 gap-2 md:gap-4">
                {[product.image, ...product.images.slice(0, 3)].map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`aspect-square rounded-xl md:rounded-2xl overflow-hidden cursor-pointer transition-all ${
                      mainImage === img ? 'ring-2 ring-[#8B5E3C] shadow-md' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8 md:space-y-12">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-secondary-luxe">
                  Aura Artisan Collection
                </span>
                <div className="flex items-center space-x-1 text-highlight-luxe">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs md:text-sm font-mono font-bold">{product.rating || 4.8}</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display leading-tight tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-end space-x-3 flex-wrap">
                <p className="text-3xl md:text-4xl font-mono font-bold text-[#8B5E3C] tracking-tighter">
                  ${(product.isSale && product.salePrice ? product.salePrice : product.price).toLocaleString()}
                </p>
                {product.isSale && (
                  <p className="text-sm md:text-base line-through text-text-luxe/40 mb-1">${product.price.toLocaleString()}</p>
                )}
                <p className="text-[10px] md:text-xs text-text-luxe/40 tracking-widest uppercase italic">Excl. logistics</p>
              </div>
              <p className="text-base md:text-lg text-text-luxe/70 leading-relaxed max-w-xl">{product.description}</p>
            </div>

            {/* Size & Quantity */}
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Dimension Protocol</h4>
                  <button className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-secondary-luxe border-b border-secondary-luxe/30 pb-0.5 hover:text-[#6F472C] transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center font-mono text-sm md:text-base font-bold border-2 transition-all ${
                        selectedSize === size 
                          ? 'bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-md' 
                          : 'border-border-luxe/20 hover:border-[#8B5E3C]/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center justify-between sm:justify-start bg-layer-luxe/50 border border-border-luxe/20 rounded-xl md:rounded-2xl p-1.5 md:p-2 h-12 md:h-14 w-full sm:w-auto">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-base md:text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 w-full h-12 md:h-14 bg-[#8B5E3C] text-white rounded-xl md:rounded-2xl flex items-center justify-center space-x-2 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#6F472C] transition-all shadow-lg active:scale-95"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </button>
                <button 
                  onClick={handleWishlist}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center border-2 transition-all ${
                    isInWishlist 
                      ? 'border-[#8B5E3C] bg-[#8B5E3C] text-white shadow-md' 
                      : 'border-border-luxe/20 hover:border-[#8B5E3C]/40 hover:bg-[#8B5E3C]/5'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4 border-t border-border-luxe/10">
              {[
                { icon: Truck, title: 'White Glove', desc: 'Complimentary room setup' },
                { icon: Award, title: 'Lifetime Warranty', desc: 'Structural integrity guarantee' },
                { icon: ShieldCheck, title: 'Authenticity', desc: 'Holographic certificate' },
                { icon: RotateCcw, title: '30 Day Return', desc: 'No-questions-asked return' },
              ].map((benefit, i) => (
                <div key={i} className="flex space-x-3">
                  <div className="text-secondary-luxe shrink-0"><benefit.icon size={18} /></div>
                  <div className="space-y-0.5">
                    <h5 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{benefit.title}</h5>
                    <p className="text-[10px] md:text-xs text-text-luxe/40">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 md:mt-24 lg:mt-32">
          <div className="flex space-x-6 md:space-x-12 border-b border-border-luxe/10 overflow-x-auto no-scrollbar pb-2">
            {['Specs', 'Narrative', 'Curation'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-4 md:pb-6 text-xs md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all relative whitespace-nowrap ${
                  activeTab === tab.toLowerCase() ? 'text-[#8B5E3C]' : 'text-text-luxe/40 hover:text-text-luxe/70'
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <motion.div layoutId="activeTabProduct" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8B5E3C] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-8 md:mt-12"
            >
              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                  <div className="space-y-6">
                    <h3 className="text-2xl md:text-3xl font-display">Technical <span className="italic">Schematics</span></h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end border-b border-border-luxe/10 pb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Material</span>
                        <span className="text-sm font-medium">{product.material || 'European Oak / Natural Linseed Oil'}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-border-luxe/10 pb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Dimensions</span>
                        <span className="text-sm font-medium">
                          {product.dimensions 
                            ? `${product.dimensions.height}H × ${product.dimensions.width}W × ${product.dimensions.depth}D`
                            : 'Standard dimension protocol'}
                        </span>
                      </div>
                      <div className="flex justify-between items-end border-b border-border-luxe/10 pb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Weight</span>
                        <span className="text-sm font-medium">{product.weight || 'Contact for details'}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-border-luxe/10 pb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Stock</span>
                        <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-layer-luxe/30 rounded-2xl p-6 md:p-8 border border-border-luxe/10">
                    <h4 className="text-lg font-display mb-3">Care Instructions</h4>
                    <p className="text-sm text-text-luxe/70 leading-relaxed">
                      {product.careInstructions || 'Wipe with a soft, dry cloth. Avoid direct sunlight and moisture. Professional cleaning recommended for upholstery.'}
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'narrative' && (
                <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
                  <h3 className="text-3xl md:text-4xl font-display leading-tight text-primary-luxe italic">
                    “{product.description.substring(0, 120) || 'The art of silent presence.'}”
                  </h3>
                  <p className="text-base md:text-lg text-text-luxe/70 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="pt-4">
                    <Link to="/about" className="text-sm font-bold uppercase tracking-widest text-secondary-luxe hover:text-[#6F472C] transition-colors">
                      Discover our story →
                    </Link>
                  </div>
                </div>
              )}
              {activeTab === 'curation' && (
                <div className="max-w-2xl mx-auto space-y-6 text-center">
                  <h3 className="text-2xl md:text-3xl font-display">About the <span className="italic">Maker</span></h3>
                  <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070" 
                    alt="Artisan" 
                    className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-text-luxe/70 text-sm leading-relaxed">
                    This piece is handcrafted by master artisans who have dedicated their lives to preserving traditional techniques while embracing contemporary design. Each item carries a unique signature and a story of slow, intentional creation.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Review System */}
        <div className="mt-20 md:mt-40">
          <ReviewSystem productId={product._id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;