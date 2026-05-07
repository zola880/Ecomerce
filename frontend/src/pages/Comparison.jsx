import React, { useState, useEffect } from 'react';
import { Scale, Check, X, Minus, ShoppingBag, Plus, Trash2 } from 'lucide-react';
import { productAPI } from '../services/api';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductSkeleton } from '../components/ui/Skeleton';

const Comparison = () => {
  const [searchParams] = useSearchParams();
  const productIds = searchParams.get('ids')?.split(',') || [];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparisonProducts = async () => {
      if (productIds.length === 0) {
        // Default: fetch top 3 products
        try {
          const { data } = await productAPI.getProducts({ limit: 3 });
          setProducts(data.data.products);
        } catch (error) {
          console.error('Failed to fetch default products', error);
        } finally {
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      try {
        const promises = productIds.map(id => productAPI.getProduct(id));
        const results = await Promise.all(promises);
        setProducts(results.map(r => r.data.data));
      } catch (error) {
        console.error('Failed to fetch comparison products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComparisonProducts();
  }, [productIds]);

  const specs = [
    { label: 'Valuation', getValue: (p) => `$${p.price.toLocaleString()}` },
    { label: 'Sphere', getValue: (p) => p.category },
    { label: 'Curation Date', getValue: (p) => p.isNew ? 'Released 2026' : 'Classic Portfolio' },
    { label: 'Collector Sentiment', getValue: (p) => `${p.rating || 4.5} / 5.0` },
    { label: 'Exclusivity', getValue: (p) => p.isBestSeller ? 'High Volume Pursuit' : 'Limited Edition' },
    { label: 'Material', getValue: (p) => p.material || 'Premium Oak / Linen' },
    { label: 'Stock Status', getValue: (p) => p.stock > 0 ? `In Stock (${p.stock})` : 'Out of Stock' },
  ];

  const removeProduct = (id) => {
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20"><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><ProductSkeleton /><ProductSkeleton /><ProductSkeleton /></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="space-y-20">
        <div className="text-center space-y-6">
          <div className="inline-flex p-4 bg-layer-luxe rounded-3xl text-primary-luxe"><Scale size={32} /></div>
          <h1 className="text-5xl font-display">Piece <span className="italic text-primary-luxe">Analysis</span></h1>
          <p className="text-text-luxe/60 max-w-md mx-auto">Analytical comparison of your selected essentials to find the perfect addition to your space.</p>
        </div>

        <div className="overflow-x-auto pb-12">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border-luxe/20">
                <th className="py-12 w-1/4 text-left">
                  <Link to="/products" className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe flex items-center space-x-2 hover:translate-x-2 transition-transform"><Plus size={12} /><span>Add to analysis</span></Link>
                </th>
                {products.map(p => (
                  <th key={p._id} className="py-12 px-8 text-left group relative">
                    <button onClick={() => removeProduct(p._id)} className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"><X size={14} className="text-primary-luxe" /></button>
                    <div className="space-y-6">
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-layer-luxe"><img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" /></div>
                      <div className="space-y-1"><h3 className="text-lg font-medium">{p.name}</h3><p className="text-sm font-mono font-bold text-primary-luxe">${p.price.toLocaleString()}</p></div>
                      <button className="w-full py-4 bg-primary-luxe text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-secondary-luxe transition-all">Collect Piece</button>
                    </div>
                  </th>
                ))}
                {products.length < 3 && [...Array(3 - products.length)].map((_, i) => (
                  <th key={`empty-${i}`} className="py-12 px-8 text-left opacity-40"><div className="aspect-square rounded-2xl bg-layer-luxe flex items-center justify-center border-2 border-dashed border-border-luxe"><Plus size={32} className="text-border-luxe" /></div></th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-luxe/10">
              {specs.map((spec, i) => (
                <tr key={i} className="hover:bg-layer-luxe/10 transition-colors">
                  <td className="py-10 text-[10px] font-bold uppercase tracking-[0.3em] text-border-luxe">{spec.label}</td>
                  {products.map(p => <td key={p._id} className="py-10 px-8 text-sm font-medium">{spec.getValue(p)}</td>)}
                  {products.length < 3 && [...Array(3 - products.length)].map((_, idx) => <td key={idx} className="py-10 px-8 text-sm text-text-luxe/40 italic">—</td>)}
                </tr>
              ))}
              <tr>
                <td className="py-10 text-[10px] font-bold uppercase tracking-[0.3em] text-border-luxe">Actions</td>
                {products.map(p => <td key={p._id} className="py-10 px-8"><button className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe hover:underline">View Details</button></td>)}
                {products.length < 3 && [...Array(3 - products.length)].map((_, idx) => <td key={idx} className="py-10 px-8"></td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Comparison;