import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If you have a brands endpoint, uncomment this:
    // const fetchBrands = async () => {
    //   try {
    //     const { data } = await api.get('/brands');
    //     setBrands(data.data);
    //   } catch (error) { console.error(error) } finally { setLoading(false) }
    // };
    // fetchBrands();

    // Fallback static data (can be moved to constants)
    setBrands([
      { name: 'OAK & IRON', origin: 'Norway', spec: 'Architectural Woodwork', image: 'https://picsum.photos/seed/b1/800/800' },
      { name: 'CLAY SOUL', origin: 'Japan', spec: 'Hand-thrown Stoneware', image: 'https://picsum.photos/seed/b2/800/800' },
      { name: 'LUMEN STUDIO', origin: 'Denmark', spec: 'Diffusion Research', image: 'https://picsum.photos/seed/b3/800/800' },
      { name: 'SILK ROUTE', origin: 'Italy', spec: 'Organic Textiles', image: 'https://picsum.photos/seed/b4/800/800' },
      { name: 'MARBLE MASTER', origin: 'Greece', spec: 'Cararra Extraction', image: 'https://picsum.photos/seed/b5/800/800' },
      { name: 'MINIMAL LABS', origin: 'Germany', spec: 'Hardware Engineering', image: 'https://picsum.photos/seed/b6/800/800' },
    ]);
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center py-40">Loading artisan guild...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40">
      <div className="space-y-24">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary-luxe">Our Partners</span>
          <h1 className="text-3xl sm:text-5xl font-display tracking-tight">The Artisan <span className="italic">Guild</span></h1>
          <p className="text-text-luxe/60">We partner exclusively with world-renowned studios that share our devotion to material honesty and heritage craftsmanship.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {brands.map((brand, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="card-luxe p-8 space-y-8 flex flex-col items-center text-center group transition-all hover:bg-primary-luxe hover:text-white">
              <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-border-luxe/20 group-hover:border-white/20 transition-all">
                <img src={brand.image} alt={brand.name} className="w-full h-full object-cover grayscale transition-transform scale-110 group-hover:scale-125" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-4">
                <div className="space-y-1"><h3 className="text-2xl font-display tracking-tighter uppercase">{brand.name}</h3><div className="flex items-center justify-center space-x-2 text-[10px] font-bold uppercase tracking-widest opacity-60"><span>{brand.origin}</span><span>•</span><span>Est. 1982</span></div></div>
                <p className="text-sm font-medium tracking-tight opacity-70 italic">"{brand.spec}"</p>
                <div className="pt-4"><button className="text-[10px] font-bold uppercase tracking-widest border-b border-current pb-1 hover:opacity-100 opacity-60 transition-opacity">View Portfolio</button></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Network Section - static remains */}
        <div className="pt-20 border-t border-border-luxe/20 text-center lg:text-left">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8"><h2 className="text-3xl lg:text-4xl leading-tight">Tracing Origin: <br /> <span className="italic font-light">Global Integrity</span></h2><p className="text-text-luxe/60 leading-relaxed text-base lg:text-lg">Every studio in our network undergoes a 6-month accreditation process to ensure their operational ethics, sustainability protocols, and artisanal standards align with the Aura Luxe manifest.</p><div className="grid grid-cols-2 gap-8 lg:text-left text-center"><div><h4 className="text-4xl font-display text-primary-luxe">24</h4><span className="text-[10px] font-bold uppercase tracking-widest text-border-luxe">Certified Studios</span></div><div><h4 className="text-4xl font-display text-primary-luxe">12</h4><span className="text-[10px] font-bold uppercase tracking-widest text-border-luxe">Countries of Origin</span></div></div></div>
              <div className="rounded-[3rem] overflow-hidden aspect-video bg-layer-luxe relative group"><img src="https://picsum.photos/seed/map1/1000/600?grayscale" alt="Map" className="w-full h-full object-cover opacity-60 mix-blend-overlay" /><div className="absolute inset-0 flex items-center justify-center"><div className="w-20 h-20 bg-primary-luxe rounded-full flex items-center justify-center animate-pulse shadow-2xl"><div className="w-4 h-4 bg-highlight-luxe rounded-full"></div></div></div></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;