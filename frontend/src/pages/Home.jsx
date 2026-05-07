import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Sparkles, Globe, Shield, User, Star, ChevronLeft, ChevronRight, Mail, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import { ProductSkeleton } from '../components/ui/Skeleton';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productAPI.getProducts({ limit: 6, sort: 'Rating' });
        setFeaturedProducts(data.data.products);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredProducts.length / 4));
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(featuredProducts.length / 4)) % Math.ceil(featuredProducts.length / 4));
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-10" />
          <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-105">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-spinning-metal-sphere-32891-large.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-highlight-luxe text-sm font-bold uppercase tracking-[0.3em] mb-4">Est. 2024</span>
            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-display font-light leading-[1.1] tracking-tight">
              Where <span className="font-bold">Silence</span> <br />
              Becomes <span className="italic">Presence</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mt-6 font-light">
              Curated essentials for the contemporary consciousness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full text-sm font-bold uppercase tracking-wider hover:bg-secondary-luxe hover:text-white transition-all"
              >
                Explore Archive <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 backdrop-blur-sm rounded-full text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-all"
              >
                Our Philosophy
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary-luxe">Curated Selection</span>
          <h2 className="text-4xl md:text-5xl font-display mt-2">Signature Pieces</h2>
          <div className="w-16 h-0.5 bg-highlight-luxe mx-auto mt-4" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(featuredProducts.length / 4) }).map((_, pageIndex) => (
                  <div key={pageIndex} className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    {featuredProducts.slice(pageIndex * 4, pageIndex * 4 + 4).map((product, i) => (
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
                ))}
              </div>
            </div>
            {featuredProducts.length > 4 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-luxe hover:text-white transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-luxe hover:text-white transition-all"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: Math.ceil(featuredProducts.length / 4) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? 'w-6 bg-primary-luxe' : 'bg-border-luxe'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 border border-border-luxe rounded-full text-sm font-bold uppercase tracking-wider hover:bg-primary-luxe hover:text-white transition-all"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Lifestyle Banner */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1493663284032-c4b4bb4d5a00?q=80&w=2070&auto=format"
          alt="Luxury interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h3 className="text-white text-3xl md:text-5xl font-display italic mb-4">Crafted for Eternity</h3>
          <p className="text-white/80 max-w-md">Each piece tells a story of material honesty and timeless design.</p>
        </div>
      </div>

      {/* Philosophy Cards */}
      <section className="py-24 bg-bg-luxe">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary-luxe">Our Pillars</span>
            <h2 className="text-4xl md:text-5xl font-display mt-2">Design Philosophy</h2>
            <div className="w-16 h-0.5 bg-highlight-luxe mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-layer-luxe/50 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 mx-auto bg-primary-luxe/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-luxe transition-all">
                <Zap size={28} className="text-primary-luxe group-hover:text-white" />
              </div>
              <h3 className="text-xl font-display mb-2">Material Honesty</h3>
              <p className="text-text-luxe/60 text-sm">We believe in raw materials that speak for themselves – oak, linen, stone.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-layer-luxe/50 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 mx-auto bg-primary-luxe/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-luxe transition-all">
                <Globe size={28} className="text-primary-luxe group-hover:text-white" />
              </div>
              <h3 className="text-xl font-display mb-2">Global Integrity</h3>
              <p className="text-text-luxe/60 text-sm">Sourced from 64 countries with ethical standards and artisanal respect.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-layer-luxe/50 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 mx-auto bg-primary-luxe/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-luxe transition-all">
                <Heart size={28} className="text-primary-luxe group-hover:text-white" />
              </div>
              <h3 className="text-xl font-display mb-2">Future Heritage</h3>
              <p className="text-text-luxe/60 text-sm">Designed for generations, not seasons. Sustainable, durable, timeless.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-primary-luxe text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-display">Join the <span className="italic">Sphere</span></h3>
          <p className="text-white/70 mt-4 mb-8">Receive early access to new arrivals and exclusive offers.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 bg-white/10 backdrop-blur rounded-full border border-white/30 focus:outline-none focus:border-white placeholder:text-white/50 text-white"
            />
            <button className="px-8 py-4 bg-white text-primary-luxe rounded-full hover:bg-secondary-luxe hover:text-white transition-all flex items-center justify-center gap-2">
              Subscribe <Mail size={16} />
            </button>
          </form>
          <p className="text-xs text-white/40 mt-6">No spam, only inspiration. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center bg-bg-luxe">
        <div className="max-w-sm mx-auto px-4">
          <Star size={32} className="mx-auto text-highlight-luxe mb-4" />
          <h4 className="text-2xl font-display">Experience the Archive</h4>
          <Link to="/products" className="inline-block mt-6 px-8 py-3 bg-primary-luxe text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-secondary-luxe transition-all">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;