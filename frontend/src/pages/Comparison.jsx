import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Scale, X, ShoppingBag, Plus } from 'lucide-react';
import { productAPI } from '../services/api';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ProductSkeleton } from '../components/ui/Skeleton';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Comparison = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productIds = useMemo(() => {
    return searchParams.get('ids')?.split(',').filter(id => id) || [];
  }, [searchParams]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false); // ← prevent multiple fetches

  const { addToCart } = useStore();
  const { user } = useAuth();
  const { showNotification } = useNotification();

 useEffect(() => {
  const fetchComparisonProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      if (productIds.length === 0) {
        const { data } = await productAPI.getProducts({
          limit: 3,
          sort: 'Rating'
        });

        const fetched =
          data?.data?.products ||
          data?.products ||
          [];

        setProducts(fetched.slice(0, 3));
      } else {
        const results = await Promise.all(
          productIds.map(id => productAPI.getProduct(id))
        );

        const valid = results
          .map(r => r?.data?.data || r?.data)
          .filter(p => p && p._id);

        setProducts(valid);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load comparison data.');
    } finally {
      setLoading(false);
    }
  };

  fetchComparisonProducts();
}, [searchParams.toString()]); // effect still runs on productIds change, but the ref stops the second run

  const handleAddToCart = (product) => {
    if (!user) {
      showNotification('Please login to add items to cart', 'info');
      navigate('/auth');
      return;
    }
    addToCart(product, 1, 'M');
    showNotification(`Added ${product.name} to your collection`, 'success');
  };

  const removeProduct = (id) => {
    const newIds = productIds.filter(pid => pid !== id);
    if (newIds.length === 0) {
      navigate('/comparison'); // clears URL
    } else {
      navigate(`/comparison?ids=${newIds.join(',')}`);
    }
    // reset the fetch flag when the URL changes
    fetchedRef.current = false;
  };

  const specs = [
    { label: 'Valuation', getValue: (p) => `$${p.price?.toLocaleString() || '—'}` },
    { label: 'Sphere', getValue: (p) => p.category || '—' },
    { label: 'Curation Date', getValue: (p) => p.isNew ? 'Released 2026' : 'Classic Portfolio' },
    { label: 'Collector Sentiment', getValue: (p) => `${p.rating || 4.5} / 5.0` },
    { label: 'Exclusivity', getValue: (p) => p.isBestSeller ? 'High Volume Pursuit' : 'Limited Edition' },
    { label: 'Material', getValue: (p) => p.material || 'Premium Oak / Linen' },
    { label: 'Stock Status', getValue: (p) => p.stock > 0 ? `In Stock (${p.stock})` : 'Out of Stock' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <ProductSkeleton /><ProductSkeleton /><ProductSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex p-4 bg-layer-luxe rounded-3xl text-primary-luxe mb-6"><Scale size={32} /></div>
        <h2 className="text-2xl font-display mb-4">Comparison Unavailable</h2>
        <p className="text-text-luxe/60 mb-8">{error}</p>
        <Link to="/products" className="inline-block px-8 py-4 bg-[#8B5E3C] text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#6F472C] transition-colors">
          Browse Collection
        </Link>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex p-4 bg-layer-luxe rounded-3xl text-primary-luxe mb-6"><Scale size={32} /></div>
        <h2 className="text-2xl font-display mb-4">No products to compare</h2>
        <p className="text-text-luxe/60 mb-8">Add product IDs to the URL or browse our collection.</p>
        <Link to="/products" className="inline-block px-8 py-4 bg-[#8B5E3C] text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#6F472C] transition-colors">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="space-y-12 md:space-y-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-layer-luxe rounded-3xl text-primary-luxe"><Scale size={32} /></div>
          <h1 className="text-4xl md:text-5xl font-display">Piece <span className="italic text-[#8B5E3C]">Analysis</span></h1>
          <p className="text-text-luxe/60 max-w-md mx-auto text-sm md:text-base">Compare up to 3 pieces side by side.</p>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-6">
          <div className="min-w-[800px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border-luxe/20">
                  <th className="py-6 md:py-10 w-1/4 text-left align-top">
                    <Link to="/products" className="inline-flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary-luxe hover:text-[#6F472C] hover:translate-x-1 transition-transform">
                      <Plus size={14} /><span>Add another</span>
                    </Link>
                  </th>
                  {products.map(p => (
                    <th key={p._id} className="py-6 md:py-10 px-4 md:px-6 text-left group relative">
                      <button onClick={() => removeProduct(p._id)} className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-50">
                        <X size={14} className="text-red-500" />
                      </button>
                      <div className="space-y-4 md:space-y-6">
                        <Link to={`/product/${p._id}`} className="block">
                          <div className="aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-layer-luxe">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                          </div>
                        </Link>
                        <div className="space-y-1">
                          <h3 className="text-sm md:text-lg font-medium line-clamp-2">{p.name}</h3>
                          <p className="text-sm md:text-base font-mono font-bold text-[#8B5E3C]">${p.price?.toLocaleString() || '—'}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => handleAddToCart(p)} className="w-full py-2 md:py-3 bg-[#8B5E3C] text-white rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors flex items-center justify-center space-x-2">
                            <ShoppingBag size={14} /><span>Add to Cart</span>
                          </button>
                          <Link to={`/product/${p._id}`} className="w-full py-2 md:py-3 border border-border-luxe rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest text-center hover:bg-layer-luxe transition-colors">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </th>
                  ))}
                  {products.length < 3 && [...Array(3 - products.length)].map((_, i) => (
                    <th key={`empty-${i}`} className="py-6 md:py-10 px-4 md:px-6 text-left opacity-40">
                      <div className="aspect-square rounded-xl md:rounded-2xl bg-layer-luxe flex items-center justify-center border-2 border-dashed border-border-luxe">
                        <Plus size={24} className="text-border-luxe" />
                      </div>
                      <div className="text-center text-xs text-text-luxe/40 mt-4">Add product</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-luxe/10">
                {specs.map((spec, i) => (
                  <tr key={i} className="hover:bg-layer-luxe/10 transition-colors">
                    <td className="py-4 md:py-6 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-border-luxe align-top">{spec.label}</td>
                    {products.map(p => <td key={p._id} className="py-4 md:py-6 px-4 md:px-6 text-xs md:text-sm font-medium">{spec.getValue(p)}</td>)}
                    {products.length < 3 && [...Array(3 - products.length)].map((_, idx) => <td key={idx} className="py-4 md:py-6 px-4 md:px-6 text-sm text-text-luxe/40 italic">—</td>)}
                  </tr>
                ))}
                <tr className="hover:bg-layer-luxe/10 transition-colors">
                  <td className="py-4 md:py-6 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-border-luxe">Actions</td>
                  {products.map(p => (
                    <td key={p._id} className="py-4 md:py-6 px-4 md:px-6">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button onClick={() => handleAddToCart(p)} className="px-3 py-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-[#8B5E3C] text-white rounded-lg hover:bg-[#6F472C] transition-colors">Buy Now</button>
                        <Link to={`/product/${p._id}`} className="px-3 py-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest border border-border-luxe rounded-lg hover:bg-layer-luxe transition-colors text-center">Details</Link>
                      </div>
                    </td>
                  ))}
                  {products.length < 3 && [...Array(3 - products.length)].map((_, idx) => <td key={idx} className="py-4 md:py-6 px-4 md:px-6"> </td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link to="/products" className="inline-flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary-luxe hover:text-[#6F472C] transition-colors">
            <span>Browse more pieces</span><Plus size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Comparison;