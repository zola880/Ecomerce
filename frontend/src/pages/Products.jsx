import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid2X2, List, ChevronDown, Check, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/ui/Skeleton';

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
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-24 md:pb-40">
      <div className="space-y-8 md:space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border-luxe/10 pb-8 md:pb-12">
          <div className="space-y-2 md:space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary-luxe">Curated Archives</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display leading-none">The <span className="italic">Collection</span></h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-layer-luxe p-1.5 rounded-2xl">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-luxe' : 'text-text-luxe/30 hover:text-text-luxe'}`}>
                <Grid2X2 size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-luxe' : 'text-text-luxe/30 hover:text-text-luxe'}`}>
                <List size={18} />
              </button>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center space-x-2 px-5 py-3 md:px-8 md:py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${showFilters ? 'bg-primary-luxe text-white' : 'bg-layer-luxe hover:bg-border-luxe/20'}`}>
              <SlidersHorizontal size={14} /><span>Filter</span>
            </button>
          </div>
        </div>

        <div className="flex gap-6 lg:gap-16">
          {/* Desktop Sidebar (visible when showFilters true on lg) */}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : (
              <>
                <div className={`grid gap-3 sm:gap-4 md:gap-6 lg:gap-8 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {products.map(product => <ProductCard key={product._id} product={product} />)}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 md:mt-16 pt-8 border-t border-border-luxe/10">
                    <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="p-2 rounded-xl disabled:opacity-30 hover:bg-layer-luxe transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-1">
                      {[...Array(pagination.pages)].map((_, i) => {
                        const pageNum = i + 1;
                        const isActive = pageNum === pagination.page;
                        return (
                          <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-8 h-8 md:w-10 md:h-10 rounded-xl text-xs md:text-sm font-mono font-bold transition-all ${isActive ? 'bg-primary-luxe text-white shadow-md' : 'hover:bg-layer-luxe text-text-luxe/60'}`}>
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="p-2 rounded-xl disabled:opacity-30 hover:bg-layer-luxe transition-colors">
                      <ChevronRight size={20} />
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
            className="fixed inset-0 z-[100] bg-bg-luxe flex flex-col lg:hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-border-luxe/10">
              <h3 className="text-2xl font-display uppercase tracking-tight">Filter & Sort</h3>
              <button onClick={() => setShowFilters(false)} className="p-3 bg-layer-luxe rounded-full"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Categories</h4>
                <div className="flex flex-wrap gap-3">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => { handleCategoryChange(cat); setShowFilters(false); }} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-primary-luxe text-white shadow-md' : 'bg-layer-luxe text-text-luxe/80'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Sort By</h4>
                <div className="flex flex-wrap gap-3">
                  {sorts.map(sort => (
                    <button key={sort} onClick={() => { handleSortChange(sort); setShowFilters(false); }} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${sortBy === sort ? 'bg-primary-luxe text-white shadow-md' : 'bg-layer-luxe text-text-luxe/80'}`}>
                      {sort}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border-luxe/10">
              <button onClick={clearFilters} className="w-full py-4 bg-secondary-luxe/10 text-secondary-luxe rounded-full text-xs font-bold uppercase tracking-widest hover:bg-secondary-luxe hover:text-white transition-all">Reset All Filters</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;