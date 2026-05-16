// Products.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid2X2, List, ChevronDown, Check, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

// ─────────────────────────────────────────────────────────────
// 🔹 Skeleton Loader for Products (luxury style, animated pulse)
// ─────────────────────────────────────────────────────────────
const ProductSkeleton = () => {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Image skeleton - matches responsive aspect ratio of real ProductCard */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-gray-100 aspect-square sm:aspect-[3/4]">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 shimmer" />
      </div>
      {/* Text skeleton */}
      <div className="py-1 sm:py-4 md:py-6 space-y-0.5 sm:space-y-1.5 md:space-y-2 px-0.5 sm:px-2">
        <div className="flex justify-between items-start gap-1">
          <div className="space-y-0.5 flex-1">
            <div className="hidden sm:block h-1.5 w-12 bg-gray-200 rounded-full" />
            <div className="h-2 sm:h-3 md:h-4 bg-gray-200 rounded w-3/4" />
          </div>
          <div className="h-2 sm:h-3 md:h-5 w-10 bg-gray-200 rounded" />
        </div>
        <div className="hidden sm:flex items-center justify-between pt-0.5 sm:pt-2">
          <div className="h-1 w-8 bg-gray-200 rounded" />
          <div className="h-0.5 w-6 bg-gray-200 rounded" />
        </div>
      </div>
      <style jsx>{`
        .shimmer {
          animation: shimmer 1.5s infinite linear;
          background-size: 200% 100%;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Featured');

  const categories = ['All', 'Furniture', 'Lighting', 'Decor', 'Lifestyle', 'Archive Sale'];
  const sorts = ['Featured', 'Price: High to Low', 'Price: Low to High', 'Rating'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: pagination.page,
          category: activeCategory !== 'All' ? activeCategory : undefined,
          sale: activeCategory === 'Archive Sale' ? 'true' : undefined,
          sort: sortBy !== 'Featured' ? sortBy : undefined,
          limit: 12,
        };
        const { data } = await productAPI.getProducts(params);
        setProducts(data.data.products);
        setPagination({
          page: data.data.page,
          pages: data.data.pages,
          total: data.data.total,
        });
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, sortBy, pagination.page]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPagination(prev => ({ ...prev, page: 1 }));
    const newParams = new URLSearchParams();
    if (cat !== 'All') newParams.set('category', cat);
    if (sortBy !== 'Featured') newParams.set('sort', sortBy);
    setSearchParams(newParams);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setPagination(prev => ({ ...prev, page: 1 }));
    const newParams = new URLSearchParams(searchParams);
    if (sort !== 'Featured') newParams.set('sort', sort);
    else newParams.delete('sort');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setActiveCategory('All');
    setSortBy('Featured');
    setPagination({ page: 1, pages: 1, total: 0 });
    setSearchParams({});
    setShowFilters(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-4 md:py-12 pb-20 md:pb-40">
      <div className="space-y-6 md:space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-luxe/10 pb-4 md:pb-12">
          <div className="space-y-1 md:space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-secondary-luxe">Curated Archives</span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-display leading-none">The <span className="italic">Collection</span></h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1 bg-layer-luxe p-1 rounded-xl">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-secondary-luxe text-white' : 'text-text-luxe/30 hover:text-text-luxe'}`}>
                <Grid2X2 size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-secondary-luxe text-white' : 'text-text-luxe/30 hover:text-text-luxe'}`}>
                <List size={16} />
              </button>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex items-center space-x-2 px-3 py-2 sm:px-5 sm:py-3 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
                showFilters 
                  ? 'bg-[#8B5E3C] text-white' 
                  : 'bg-[#8B5E3C] text-white hover:bg-[#6F472C]'
              }`}
            >
              <SlidersHorizontal size={12} /><span>Filter</span>
            </button>
          </div>
        </div>

        <div className="flex gap-4 lg:gap-16">
          {/* Desktop Sidebar */}
          <motion.aside
            initial={false}
            animate={{ width: showFilters ? 280 : 0, opacity: showFilters ? 1 : 0 }}
            className="hidden lg:block overflow-hidden h-fit sticky top-32 transition-all duration-300"
          >
            <div className="w-72 space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-luxe/40">Categories</h4>
                <div className="flex flex-col space-y-2">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => handleCategoryChange(cat)} className={`text-left py-2 text-sm font-medium transition-colors hover:text-secondary-luxe ${activeCategory === cat ? 'text-primary-luxe' : 'text-text-luxe/60'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-luxe/40">Sort By</h4>
                <div className="flex flex-col space-y-2">
                  {sorts.map(sort => (
                    <button key={sort} onClick={() => handleSortChange(sort)} className={`flex items-center justify-between text-left py-2 text-sm font-medium transition-colors hover:text-secondary-luxe ${sortBy === sort ? 'text-primary-luxe' : 'text-text-luxe/60'}`}>
                      {sort}{sortBy === sort && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={clearFilters} className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe hover:underline">Reset Filters</button>
            </div>
          </motion.aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
                {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : (
              <>
                <div className={`grid gap-2 sm:gap-4 md:gap-6 lg:gap-8 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {products.map(product => <ProductCard key={product._id} product={product} />)}
                </div>

                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10 md:mt-16 pt-6 border-t border-border-luxe/10">
                    <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-layer-luxe transition-colors min-w-[36px] sm:min-w-[44px] h-8 sm:h-12">
                      <ChevronLeft size={18} />
                    </button>
                    <div className="flex gap-1">
                      {[...Array(pagination.pages)].map((_, i) => {
                        const pageNum = i + 1;
                        const isActive = pageNum === pagination.page;
                        return (
                          <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-7 h-7 md:w-10 md:h-10 rounded-lg text-[11px] md:text-sm font-mono font-bold transition-all min-w-[28px] sm:min-w-[36px] ${isActive ? 'bg-primary-luxe text-white shadow-md' : 'hover:bg-layer-luxe text-text-luxe/60'}`}>
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-layer-luxe transition-colors min-w-[36px] sm:min-w-[44px] h-8 sm:h-12">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col lg:hidden"
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-display uppercase tracking-tight">Filter & Sort</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="space-y-3">
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-secondary-luxe">Categories</h4>
                <div className="overflow-x-auto pb-2 -mx-2 px-2">
                  <div className="flex gap-2 min-w-max">
                    {categories.map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => { handleCategoryChange(cat); setShowFilters(false); }} 
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                          activeCategory === cat 
                            ? 'bg-[#8B5E3C] text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-secondary-luxe">Sort By</h4>
                <div className="overflow-x-auto pb-2 -mx-2 px-2">
                  <div className="flex gap-2 min-w-max">
                    {sorts.map(sort => (
                      <button 
                        key={sort} 
                        onClick={() => { handleSortChange(sort); setShowFilters(false); }} 
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                          sortBy === sort 
                            ? 'bg-[#8B5E3C] text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {sort}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100">
              <button 
                onClick={clearFilters} 
                className="w-full py-3 bg-[#8B5E3C] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-all"
              >
                Reset All Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;