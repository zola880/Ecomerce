import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Twitter, Facebook, ArrowUpRight, Globe, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-luxe border-t border-border-luxe/20 pt-32 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-24 xl:gap-12 pb-32">
          {/* Brand Info */}
          <div className="space-y-10 xl:col-span-1">
            <div className="space-y-4">
               <span className="font-display text-4xl font-bold tracking-tighter text-primary-luxe uppercase">
                  Aura<span className="text-secondary-luxe"> Luxe</span>
               </span>
               <p className="text-text-luxe/60 text-lg leading-relaxed max-w-sm">
                  Curation for the contemporary consciousness. Establish your aesthetic hierarchy through architectural integrity and material honesty.
               </p>
            </div>
            <div className="space-y-4">
               <div className="flex items-center space-x-3 text-secondary-luxe">
                  <Globe size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Global Logistics Active</span>
               </div>
               <div className="flex items-center space-x-3 text-highlight-luxe">
                  <ShieldCheck size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Secure Acquisition Protocol</span>
               </div>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-luxe/40">The Archive</h4>
            <div className="flex flex-col space-y-4">
              {['New Arrivals', 'Best Sellers', 'Shop All', 'Categories', 'Deals'].map(link => (
                <Link key={link} to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-lg font-medium hover:text-secondary-luxe transition-colors flex items-center group">
                  <span>{link}</span>
                  <ArrowUpRight size={14} className="ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links 2 */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-luxe/40">Liaison</h4>
            <div className="flex flex-col space-y-4">
              {['My Account', 'Order Tracking', 'Wishlist', 'Help Center', 'Returns Policy'].map(link => (
                <Link key={link} to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-lg font-medium hover:text-secondary-luxe transition-colors">{link}</Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-luxe/40">The Intelligence</h4>
            <div className="space-y-6">
              <p className="text-text-luxe/60 text-sm leading-relaxed">Join the Aura Sphere for priority access to archive releases and aesthetic discourse.</p>
              <form className="relative group">
                <input 
                  type="email" 
                  placeholder="Inquiry Protocol (Email)" 
                  className="w-full bg-layer-luxe border border-border-luxe/20 rounded-xl py-6 pl-6 pr-16 outline-none focus:border-primary-luxe transition-all placeholder:text-[10px] placeholder:uppercase placeholder:font-bold placeholder:tracking-widest"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-primary-luxe text-white rounded-[10px] hover:bg-secondary-luxe transition-all shadow-xl">
                  <Mail size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="pt-12 border-t border-border-luxe/10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center space-x-12">
             <div className="flex space-x-6">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <button key={i} className="text-text-luxe/40 hover:text-primary-luxe transition-colors">
                    <Icon size={20} />
                  </button>
                ))}
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40 md:block hidden">
                © {currentYear} Aura Luxe Operations. All Rights Protected.
             </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">
             <button className="hover:text-primary-luxe transition-colors">Terms of Protocol</button>
             <button className="hover:text-primary-luxe transition-colors">Privacy Ethics</button>
             <button className="hover:text-primary-luxe transition-colors">Accessibility Manifest</button>
             <button className="hover:text-primary-luxe transition-colors">Cookie Strategy</button>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40 md:hidden block">
             © {currentYear} Aura Luxe Operations.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
