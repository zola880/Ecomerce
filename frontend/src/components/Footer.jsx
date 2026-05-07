import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Twitter, Facebook, ArrowUpRight, Globe, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-luxe border-t border-border-luxe/20 pt-12 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content – 3 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
          {/* Brand & tagline */}
          <div className="space-y-4">
            <span className="font-display text-2xl font-bold tracking-tighter text-primary-luxe uppercase">
              Aura<span className="text-secondary-luxe"> Luxe</span>
            </span>
            <p className="text-text-luxe/60 text-sm leading-relaxed max-w-xs">
              Curated essentials for the contemporary consciousness.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-text-luxe/40 hover:text-primary-luxe transition-colors"><Instagram size={18} /></a>
              <a href="#" className="text-text-luxe/40 hover:text-primary-luxe transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-text-luxe/40 hover:text-primary-luxe transition-colors"><Facebook size={18} /></a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Explore</h4>
            <div className="flex flex-col space-y-2">
              {['New Arrivals', 'Best Sellers', 'Shop All', 'Deals'].map(link => (
                <Link key={link} to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-text-luxe/70 hover:text-secondary-luxe transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Support & newsletter */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Support</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/help" className="text-sm text-text-luxe/70 hover:text-secondary-luxe transition-colors">Help Center</Link>
              <Link to="/orders" className="text-sm text-text-luxe/70 hover:text-secondary-luxe transition-colors">Order Tracking</Link>
              <Link to="/profile" className="text-sm text-text-luxe/70 hover:text-secondary-luxe transition-colors">My Account</Link>
            </div>
            <div className="pt-2">
              <div className="flex items-center space-x-2">
                <Mail size={14} className="text-secondary-luxe" />
                <span className="text-xs text-text-luxe/50">hello@auraluxe.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border-luxe/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">
          <p>© {currentYear} Aura Luxe. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="hover:text-primary-luxe">Terms</button>
            <button className="hover:text-primary-luxe">Privacy</button>
            <button className="hover:text-primary-luxe">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;