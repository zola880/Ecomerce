import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <span className="font-mono text-8xl md:text-[12rem] font-bold text-border-luxe/20 absolute -top-12 left-1/2 -translate-x-1/2 -z-10 select-none">
          404
        </span>
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-display tracking-tight">LOST IN THE <br /> <span className="italic font-light">ARCHIVE</span></h1>
          <p className="text-text-luxe/60 max-w-md mx-auto">
            The collection you are looking for has been moved or curated out of existence. Explore our current essentials instead.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/" className="flex items-center justify-center space-x-3 bg-primary-luxe text-white px-10 py-5 rounded-full hover:bg-secondary-luxe transition-all uppercase tracking-widest text-xs font-bold shadow-xl shadow-primary-luxe/10">
            <HomeIcon size={16} />
            <span>Return Home</span>
          </Link>
          <Link to="/products" className="flex items-center justify-center space-x-3 border border-border-luxe px-10 py-5 rounded-full hover:bg-layer-luxe transition-all uppercase tracking-widest text-xs font-bold">
            <ArrowLeft size={16} />
            <span>Browse Shop</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
