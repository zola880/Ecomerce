import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowRight, Search } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/ui/Skeleton';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data } = await productAPI.getProducts({ search: query, limit: 24 });
        setProducts(data.data.products);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
      <div className="space-y-10 md:space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-luxe/20 pb-8 md:pb-12">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-border-luxe">Search Archive</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display">
              Results for <span className="italic">“{query}”</span>
            </h1>
            {!loading && (
              <p className="text-text-luxe/60 text-sm">
                {products.length} {products.length === 1 ? 'piece' : 'pieces'} found
              </p>
            )}
          </div>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-secondary-luxe hover:text-[#6F472C] transition-colors"
          >
            <span>Browse all products</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Results grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        ) : (
          <div className="text-center py-16 md:py-24 bg-layer-luxe/20 rounded-2xl md:rounded-3xl px-6">
            <Search size={48} className="mx-auto text-border-luxe/50 mb-4" />
            <p className="text-lg md:text-xl font-display italic text-text-luxe/60 mb-3">
              No results found for “{query}”
            </p>
            <p className="text-text-luxe/40 text-sm max-w-md mx-auto mb-8">
              Try using different keywords or browse our collection.
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-4 bg-[#8B5E3C] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors shadow-md"
            >
              Browse All Archives
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;