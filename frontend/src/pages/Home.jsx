import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Sparkles, Globe, Shield, User, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import { ProductSkeleton } from '../components/ui/Skeleton';

const Home = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productAPI.getProducts({ limit: 4, sort: 'Rating' });
        setFeaturedProducts(data.data.products);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-0">
      {/* Hero - full bleed video/image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <motion.div style={{ y: y1, opacity }} className="absolute inset-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-spinning-metal-sphere-32891-large.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-white text-6xl sm:text-8xl md:text-9xl font-display tracking-tighter"
          >
            AURA
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Link to="/products" className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all">
              <span>Explore</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured - minimal grid */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary-luxe">Signature</span>
          <h2 className="text-4xl md:text-6xl font-display mt-2">Featured</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Single statement - bold, minimal */}
      <section className="py-32 bg-primary-luxe text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-highlight-luxe text-sm font-bold uppercase tracking-[0.3em] mb-6">Design Philosophy</p>
          <h2 className="text-white text-5xl md:text-7xl font-display italic leading-tight">
            Silence.<br />Form.<br />Presence.
          </h2>
        </div>
      </section>

      {/* Immersive visual row (full width image) */}
      <div className="h-[60vh] relative overflow-hidden">
        <img src="https://picsum.photos/seed/immersive/2400/1200" alt="Immersive" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Simple CTA */}
      <section className="py-24 text-center">
        <Globe size={40} className="mx-auto text-secondary-luxe mb-6" />
        <h3 className="text-3xl md:text-5xl font-display uppercase tracking-tight">Curated Worldwide</h3>
        <p className="text-text-luxe/40 text-sm max-w-md mx-auto mt-4">Artisan pieces sourced from 64 countries.</p>
      </section>
    </div>
  );
};

export default Home;