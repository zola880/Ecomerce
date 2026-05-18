// Products.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid2X2, List, ChevronDown, Check, Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

// Skeleton Loader for initial products (same as before)
const ProductSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-gray-100 aspect-square sm:aspect-[3/4]">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 shimmer" />
    </div>
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

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);         // initial or filter‑change loading
  const [loadingMore, setLoadingMore] = useState(false); // loading next page
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Featured');

  const categories = ['All', 'Furniture', 'Lighting', 'Decor', 'Lifestyle', 'Archive Sale'];
  const sorts = ['Featured', 'Price: High to Low', 'Price: Low to High', 'Rating'];

  // AbortController to cancel in‑flight requests when filters change
  const abortControllerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Core fetch function (supports appending)
  const fetchProducts = useCallback(
    async (pageNum, append = false) => {
      // Cancel previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const setLoadingState = append ? setLoadingMore : setLoading;
      setLoadingState(true);

      try {
        const params = {
          page: pageNum,
          limit: 12,
          category: activeCategory !== 'All' ? activeCategory : undefined,
          sale: activeCategory === 'Archive Sale' ? 'true' : undefined,
          sort: sortBy !== 'Featured' ? sortBy : undefined,
        };

        const { data } = await productAPI.getProducts(params, { signal: controller.signal });
        const newProducts = data.data.products;
        const totalPages = data.data.pages;

        if (append) {
          setProducts((prev) => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }

        setHasMore(pageNum < totalPages);
        setPage(pageNum);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch products:', error);
        }
      } finally {
        if (!controller.signal.aborted) {
          if (append) setLoadingMore(false);
          else setLoading(false);
        }
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [activeCategory, sortBy]
  );

  // Reset and fetch first page when filters change
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    fetchProducts(1, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL params
    const newParams = new URLSearchParams();
    if (activeCategory !== 'All') newParams.set('category', activeCategory);
    if (sortBy !== 'Featured') newParams.set('sort', sortBy);
    setSearchParams(newParams);
  }, [activeCategory, sortBy, fetchProducts, setSearchParams]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (loading) return; // don't observe while initial load is in progress

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !loadingMore && !loading) {
          fetchProducts(page + 1, true);
        }
      },
      { threshold: 0.5, rootMargin: '200px' } // trigger a bit earlier
    );

    const currentSentinel = sentinelRef.current;
    observer.observe(currentSentinel);

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [hasMore, loadingMore, loading, page, fetchProducts]);

  // Handlers for filters / view
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setShowFilters(false);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setActiveCategory('All');
    setSortBy('Featured');
    setShowFilters(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8 py-4 md:py-12 pb-20 md:pb-40">
      <div className="space-y-6 md:space-y-12">
        {/* Header (unchanged) */}
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
                showFilters ? 'bg-[#8B5E3C] text-white' : 'bg-[#8B5E3C] text-white hover:bg-[#6F472C]'
              }`}
            >
              <SlidersHorizontal size={12} /><span>Filter</span>
            </button>
          </div>
        </div>

        <div className="flex gap-4 lg:gap-16">
          {/* Desktop Sidebar (unchanged) */}
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

          {/* Products Area */}
          <div className="flex-1">
            {/* Initial loading skeletons */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
                {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            )}

            {/* Actual product list */}
            {!loading && (
              <>
                <div className={`grid gap-2 sm:gap-4 md:gap-6 lg:gap-8 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Sentinel + loading more indicator */}
                <div ref={sentinelRef} className="flex justify-center items-center py-8">
                  {loadingMore && (
                    <div className="flex items-center gap-2 text-sm text-text-luxe/60">
                      <Loader2 size={20} className="animate-spin" />
                      <span>Loading more...</span>
                    </div>
                  )}
                  {!hasMore && products.length > 0 && (
                    <p className="text-xs text-text-luxe/40 pt-4">You've reached the end ✨</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer (unchanged) */}
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
                          activeCategory === cat ? 'bg-[#8B5E3C] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                          sortBy === sort ? 'bg-[#8B5E3C] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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