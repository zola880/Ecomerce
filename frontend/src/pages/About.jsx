import React from 'react';
import { motion } from 'motion/react';
import { Globe, Award, Heart, Leaf } from 'lucide-react';

const About = () => {
  return (
    <div className="pb-32">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-primary-luxe">
        <img 
          src="https://picsum.photos/seed/about-luxe/1920/1080?grayscale" 
          alt="Studio" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-10 text-center space-y-6">
          <span className="text-highlight-luxe text-xs font-bold uppercase tracking-[0.5em]">The Aura Philosophy</span>
          <h1 className="text-white text-6xl md:text-8xl font-display tracking-tight">CRAFTED FOR <br /> <span className="italic font-light">ETERNITY</span></h1>
        </div>
      </section>

      {/* Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6 text-xl text-text-luxe/80 leading-relaxed">
              <p>
                Founded in 2024, Aura Luxe emerged from a simple observation: the world was becoming noisy, cluttered, and temporary. We envisioned a marketplace where quiet sophistication and architectural integrity take precedence over fleeting trends.
              </p>
              <p>
                Every piece in our archive is selected through a rigorous curation process that evaluates three core pillars: Material Honesty, Functional Artistry, and Environmental Responsibility.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              {[
                { icon: Award, label: 'Excellence', val: 'Global Design Winner' },
                { icon: Leaf, label: 'Nature', val: '100% Sustainable' },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="p-3 bg-layer-luxe w-fit rounded-xl text-primary-luxe"><item.icon size={20} /></div>
                  <h4 className="text-xs font-bold uppercase tracking-widest">{item.label}</h4>
                  <p className="text-sm text-text-luxe/60">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden">
              <img src="https://picsum.photos/seed/craft1/800/1000" alt="Process" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-12 -left-12 p-12 bg-secondary-luxe rounded-[2.5rem] shadow-2xl hidden md:block">
              <p className="text-white text-2xl font-display leading-tight italic">
                "Design is not for philosophy, it's for life."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Grid */}
      <section className="bg-layer-luxe/30 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl">Our Core <span className="italic">Tenets</span></h2>
            <div className="w-24 h-1 bg-highlight-luxe mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Material Honesty', desc: 'We believe materials should speak for themselves. Raw oak, hand-thrown clay, and pure linen form the vocabulary of our products.' },
              { title: 'Silent Luxury', desc: 'Luxury isn\u2019t about being noticed; it\u2019s about being understood. Our pieces are designed to integrate seamlessly into your space.' },
              { title: 'Future Heritage', desc: 'We build for generations, not seasons. Every acquisition from Aura Luxe is a future heirloom in the making.' },
            ].map((tenet, i) => (
              <div key={i} className="card-luxe p-12 space-y-6 text-center hover:-translate-y-2 transition-transform">
                <span className="text-4xl font-display text-border-luxe opacity-40">0{i+1}</span>
                <h3 className="text-2xl font-display text-primary-luxe">{tenet.title}</h3>
                <p className="text-sm text-text-luxe/70 leading-relaxed">{tenet.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
