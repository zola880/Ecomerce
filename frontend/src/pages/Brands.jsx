import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For future API integration – keep static for now
    // If you have a brands endpoint, replace this with API call
    const staticBrands = [
      { name: 'OAK & IRON', origin: 'Norway', spec: 'Architectural Woodwork', image: 'https://picsum.photos/seed/b1/800/800' },
      { name: 'CLAY SOUL', origin: 'Japan', spec: 'Hand-thrown Stoneware', image: 'https://picsum.photos/seed/b2/800/800' },
      { name: 'LUMEN STUDIO', origin: 'Denmark', spec: 'Diffusion Research', image: 'https://picsum.photos/seed/b3/800/800' },
      { name: 'SILK ROUTE', origin: 'Italy', spec: 'Organic Textiles', image: 'https://picsum.photos/seed/b4/800/800' },
      { name: 'MARBLE MASTER', origin: 'Greece', spec: 'Cararra Extraction', image: 'https://picsum.photos/seed/b5/800/800' },
      { name: 'MINIMAL LABS', origin: 'Germany', spec: 'Hardware Engineering', image: 'https://picsum.photos/seed/b6/800/800' },
    ];
    setBrands(staticBrands);
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center py-20 md:py-40">Loading artisan guild...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 pb-24 md:pb-40">
      <div className="space-y-16 md:space-y-24">
        {/* Header */}
        <div className="text-center space-y-3 md:space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary-luxe">Our Partners</span>
          <h1 className="text-3xl sm:text-5xl font-display tracking-tight">The Artisan <span className="italic">Guild</span></h1>
          <p className="text-text-luxe/60 text-sm md:text-base">We partner exclusively with world-renowned studios that share our devotion to material honesty and heritage craftsmanship.</p>
        </div>

        {/* Brands Grid – responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {brands.map((brand, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="card-luxe p-6 md:p-8 space-y-6 md:space-y-8 flex flex-col items-center text-center group hover:bg-white transition-all hover:shadow-xl"
            >
              <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-border-luxe/20 group-hover:border-[#8B5E3C]/30 transition-all">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-display tracking-tighter uppercase">{brand.name}</h3>
                  <div className="flex items-center justify-center space-x-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text-luxe/50">
                    <span>{brand.origin}</span>
                    <span>•</span>
                    <span>Est. 1982</span>
                  </div>
                </div>
                <p className="text-sm font-medium tracking-tight text-text-luxe/70 italic">"{brand.spec}"</p>
                <div className="pt-2">
                  <button className="text-[10px] font-bold uppercase tracking-widest border-b border-[#8B5E3C] pb-1 text-[#8B5E3C] hover:text-[#6F472C] hover:border-[#6F472C] transition-colors">
                    View Portfolio
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Network Section – improved styling */}
        <div className="pt-12 md:pt-20 border-t border-border-luxe/20 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl leading-tight font-display">
                Tracing Origin: <br /> <span className="italic font-light">Global Integrity</span>
              </h2>
              <p className="text-text-luxe/60 leading-relaxed text-base">
                Every studio in our network undergoes a 6-month accreditation process to ensure their operational ethics, sustainability protocols, and artisanal standards align with the Aura Luxe manifest.
              </p>
              <div className="grid grid-cols-2 gap-6 md:gap-8 lg:text-left text-center">
                <div>
                  <h4 className="text-3xl md:text-4xl font-display text-[#8B5E3C]">24</h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/50">Certified Studios</span>
                </div>
                <div>
                  <h4 className="text-3xl md:text-4xl font-display text-[#8B5E3C]">12</h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/50">Countries of Origin</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl md:rounded-[2rem] overflow-hidden aspect-video bg-layer-luxe relative group shadow-lg">
              <img
                src="https://picsum.photos/seed/map1/1000/600?grayscale"
                alt="Global Network Map"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full">Worldwide presence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;