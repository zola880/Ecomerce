import React, { useState, useEffect } from 'react';
import { Tag, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/ui/Skeleton';

const Deals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Deals');
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 12, minutes: 45, seconds: 0 });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await productAPI.getProducts({ sale: true, limit: 12 });
        setProducts(data.data.products);
      } catch (error) {
        console.error('Failed to fetch deals', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filterOptions = ['All Deals', 'Furniture', 'Lighting', 'Decor'];

  const filteredProducts = activeFilter === 'All Deals'
    ? products
    : products.filter(p => p.category === activeFilter);

  return (
    <div className="pb-20 md:pb-32">
      {/* Hero Banner – responsive height */}
      <section className="bg-gradient-to-br from-[#8B5E3C] to-[#6F472C] min-h-[40vh] md:h-[50vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="text-center space-y-6 md:space-y-8 relative z-10 px-4 py-12 md:py-0">
          <div className="inline-flex items-center space-x-2 bg-white/20 text-highlight-luxe px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">
            <Sparkles size={14} />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Exclusive Seasonal Clearance</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl text-white font-display tracking-tight leading-none uppercase">
            ARCHIVE <br /> <span className="italic font-light">SALE</span>
          </h1>
          <div className="flex justify-center space-x-6 md:space-x-8 text-white/70 font-mono text-lg md:text-xl">
            <div className="flex flex-col items-center">
              <span className="text-white text-2xl md:text-3xl font-bold">{String(timeLeft.days).padStart(2,'0')}</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-widest">Days</span>
            </div>
            <span className="text-2xl md:text-3xl">:</span>
            <div className="flex flex-col items-center">
              <span className="text-white text-2xl md:text-3xl font-bold">{String(timeLeft.hours).padStart(2,'0')}</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-widest">Hrs</span>
            </div>
            <span className="text-2xl md:text-3xl">:</span>
            <div className="flex flex-col items-center">
              <span className="text-white text-2xl md:text-3xl font-bold">{String(timeLeft.minutes).padStart(2,'0')}</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-widest">Mins</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header & Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 gap-6">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-display">Last Collection <span className="italic font-light">Pieces</span></h2>
            <p className="text-text-luxe/60 text-sm md:text-base max-w-lg">Final opportunities to acquire signature artisan pieces at exceptional valuations.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {filterOptions.map(t => (
              <button
                key={t}
                onClick={() => setActiveFilter(t)}
                className={`px-5 py-2.5 md:px-6 md:py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${
                  activeFilter === t
                    ? 'bg-[#8B5E3C] text-white shadow-md'
                    : 'border border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-luxe/60">No deals available in this category right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {filteredProducts.map(product => (
              <div key={product._id} className="relative">
                <ProductCard product={product} />
                <div className="absolute top-3 right-3 bg-red-500 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg z-10">
                  -25%
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Member Promo Section – responsive, brand-colored button */}
        <div className="mt-16 md:mt-20 lg:mt-40 bg-layer-luxe rounded-2xl md:rounded-[2.5rem] lg:rounded-[3rem] p-6 md:p-12 lg:p-24 overflow-hidden relative text-center lg:text-left shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 lg:space-y-10 relative z-10">
              <div className="space-y-3">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display leading-tight">
                  MEMBER <br /> <span className="italic font-light">BENEFICIARY</span>
                </h3>
                <p className="text-text-luxe/60 text-sm md:text-base lg:text-lg leading-relaxed">
                  Join the Aura Sphere for priority access to archive sales and a permanent 10% valuation benefit on all non‑clearance pieces.
                </p>
              </div>
              <button className="bg-[#8B5E3C] text-white px-8 py-4 md:px-12 md:py-5 rounded-full uppercase tracking-widest text-xs md:text-sm font-bold hover:bg-[#6F472C] transition-all shadow-xl">
                Become a Member
              </button>
            </div>
            <div className="relative mx-auto lg:mx-0 max-w-[280px] md:max-w-sm">
              <img
                src="https://picsum.photos/seed/sale1/800/800"
                alt="Sale"
                className="rounded-2xl md:rounded-[2rem] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -top-8 -right-8 md:-top-12 md:-right-12 w-32 h-32 md:w-48 md:h-48 bg-[#6F472C] rounded-full flex flex-col items-center justify-center text-white shadow-xl animate-bounce duration-[4s]">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Extra</span>
                <span className="text-2xl md:text-5xl font-display">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deals;