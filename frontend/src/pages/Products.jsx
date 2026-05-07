import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid2X2, List, ChevronDown, Check, Search, X } from 'lucide-react';
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
    setSearchParams({ category: cat !== 'All' ? cat : '', sort: sortBy });
  };

  return (
    // ... JSX remains largely the same, just use `products` instead of `PRODUCTS`
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12 pb-40">
      {/* same JSX structure, replace filteredProducts with products */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
          {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : (
        <div className={`grid gap-x-8 gap-y-16 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {products.map(product => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
      {/* pagination controls using pagination state */}
    </div>
  );
};

export default Products;