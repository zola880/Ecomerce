import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowRight } from 'lucide-react';
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
      setLoading(true);
      try {
        const { data } = await productAPI.getProducts({ search: query });
        setProducts(data.data.products);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };
    if (query) fetchSearch();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border-luxe/20 pb-12">
          <div className="space-y-4"><span className="text-[10px] font-bold uppercase tracking-widest text-border-luxe">Search Archive</span><h1 className="text-3xl sm:text-5xl font-display">Results for <span className="italic">"{query}"</span></h1><p className="text-text-luxe/60">We found {products.length} pieces matching your inquiry.</p></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        ) : (
          <div className="text-center py-40 space-y-8 bg-layer-luxe/20 rounded-[3rem]"><p className="text-xl font-display italic opacity-40">No results found for "{query}"</p><Link to="/products" className="inline-block px-8 py-4 bg-primary-luxe text-white rounded-full text-xs font-bold">Browse All Archives</Link></div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;