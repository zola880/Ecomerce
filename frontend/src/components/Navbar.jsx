import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Heart, User, Menu, X, ChevronDown, ArrowRight, Zap, Scale, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cart, wishlist } = useStore();
  const { user, logout } = useAuth();

  // Close mobile menu on window resize (if screen becomes large)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const getUserInitials = () => {
    if (!user?.name) return 'G';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navLinks = [
    { label: 'Deals', path: '/deals', icon: Zap },
    { label: 'Shop All', path: '/products', icon: ShoppingBag },
    { label: 'Comparison', path: '/comparison', icon: Scale },
    { label: 'Brands', path: '/brands', icon: null },
  ];

  const trendingSearches = ['Minimalist Vases', 'Soft Lighting', 'Linen Textures'];
  const curatedResults = ['New Arrivals', 'Clearance Archive', 'Best Sellers'];

  return (
    <nav className="sticky top-0 z-50 premium-blur">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="font-display text-xl md:text-2xl font-bold tracking-tighter text-primary-luxe uppercase">
              Aura<span className="text-secondary-luxe"> Luxe</span>
            </span>
          </Link>

          {/* Desktop Nav (xl and up) */}
          <div className="hidden xl:flex items-center space-x-12">
            <div className="group relative">
              <button className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-secondary-luxe transition-colors">
                <span>Spheres</span>
                <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <div className="absolute top-full -left-20 w-[600px] mt-0 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <div className="bg-bg-luxe border border-border-luxe/20 shadow-2xl rounded-[2rem] overflow-hidden grid grid-cols-2">
                  <div className="p-10 space-y-8 bg-layer-luxe/30">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Curated Spheres</h4>
                    <div className="flex flex-col space-y-4">
                      {['Furniture', 'Lighting', 'Decor', 'Lifestyle'].map(cat => (
                        <Link key={cat} to={`/products?category=${cat}`} className="text-xl font-display hover:text-secondary-luxe transition-colors">{cat}</Link>
                      ))}
                    </div>
                  </div>
                  <div className="p-10 space-y-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary-luxe">Highlights</h4>
                    <div className="space-y-6">
                      <Link to="/deals" className="group/item cursor-pointer block">
                        <span className="text-sm font-bold block">New Arrivals 2026</span>
                        <span className="text-xs text-text-luxe/40 group-hover/item:text-secondary-luxe transition-colors">View latest release protocol</span>
                      </Link>
                      <Link to="/brands" className="group/item cursor-pointer block">
                        <span className="text-sm font-bold block">Artisan Spotlight</span>
                        <span className="text-xs text-text-luxe/40 group-hover/item:text-secondary-luxe transition-colors">Meet the Japanese ceramic masters</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {navLinks.map(link => (
              <Link key={link.label} to={link.path} className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-secondary-luxe transition-colors flex items-center space-x-2">
                {link.icon && <link.icon size={12} />}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Actions (icons) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 hover:bg-layer-luxe rounded-full transition-colors relative group">
              <Search size={20} />
              <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-highlight-luxe rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>
            <Link to="/wishlist" className="p-2 hover:bg-layer-luxe rounded-full transition-colors relative">
              <Heart size={20} />
              {wishlist.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-secondary-luxe rounded-full animate-pulse"></span>}
            </Link>
            <Link to="/cart" className="p-2 hover:bg-layer-luxe rounded-full transition-colors relative flex items-center space-x-2 px-3 group">
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="bg-primary-luxe text-white text-[9px] font-bold px-2 py-0.5 rounded-full group-hover:bg-secondary-luxe transition-all whitespace-nowrap">
                  {cart.length}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center space-x-2 p-1.5 pl-4 pr-1.5 bg-layer-luxe rounded-full hover:bg-border-luxe/20 transition-all border border-border-luxe/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-luxe">{user.name?.split(' ')[0]}</span>
                  <div className="w-8 h-8 bg-primary-luxe text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">{getUserInitials()}</div>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-bg-luxe border border-border-luxe/20 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link to="/profile" className="block px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-layer-luxe rounded-t-2xl">Profile</Link>
                  <Link to="/orders" className="block px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-layer-luxe">Orders</Link>
                  <Link to="/wishlist" className="block px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-layer-luxe">Wishlist</Link>
                  {user.role === 'admin' && <Link to="/admin" className="block px-6 py-3 text-xs font-bold uppercase tracking-widest text-secondary-luxe hover:bg-layer-luxe">Admin</Link>}
                  <button onClick={handleLogout} className="w-full text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-b-2xl flex items-center space-x-2">
                    <LogOut size={12} /><span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-primary-luxe px-4 py-2 border border-border-luxe rounded-full hover:bg-primary-luxe hover:text-white transition-all">Sign In</Link>
            )}
            {/* Hamburger button - visible on screens < xl */}
            <button className="xl:hidden p-2 hover:bg-layer-luxe rounded-full" onClick={() => setIsOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay (same as before, keep as is) */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="absolute top-full left-0 w-full bg-bg-luxe border-b border-border-luxe/30 shadow-2xl z-50">
            <div className="max-w-4xl mx-auto py-12 px-4">
              <form onSubmit={handleSearch} className="flex items-center space-x-4 border-b-2 border-border-luxe/40 pb-4 focus-within:border-primary-luxe transition-colors">
                <Search className="text-border-luxe" size={24} />
                <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for furniture, lighting, decor..." className="w-full bg-transparent outline-none text-2xl font-display tracking-tight placeholder:text-border-luxe/30" />
                <button type="submit" className="p-3 bg-primary-luxe text-white rounded-full hover:bg-secondary-luxe transition-all shadow-xl"><ArrowRight size={18} /></button>
              </form>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div><span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Trending</span><div className="flex flex-col space-y-1 mt-2">{trendingSearches.map(s => <button key={s} onClick={() => { setSearchQuery(s); handleSearch(new Event('submit')); }} className="text-sm text-left hover:text-secondary-luxe">{s}</button>)}</div></div>
                <div><span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Quick Links</span><div className="flex flex-col space-y-1 mt-2">{curatedResults.map(s => <button key={s} onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)} className="text-sm text-left hover:text-secondary-luxe">{s}</button>)}</div></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer (Slide from right) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] xl:hidden" onClick={() => setIsOpen(false)} />
            {/* Drawer */}
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-bg-luxe z-[70] shadow-2xl xl:hidden flex flex-col overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-border-luxe/20">
                <span className="font-display text-2xl font-bold tracking-tighter text-primary-luxe uppercase">Aura<span className="text-secondary-luxe"> Luxe</span></span>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-layer-luxe rounded-full"><X size={24} /></button>
              </div>
              <div className="flex-1 py-8 px-6 space-y-8">
                <div className="space-y-4">
                  {['Products', 'Deals', 'Brands', 'About', 'Help'].map(link => (
                    <Link key={link} to={`/${link.toLowerCase()}`} className="block text-2xl font-display font-light hover:text-secondary-luxe transition-colors" onClick={() => setIsOpen(false)}>{link}</Link>
                  ))}
                </div>
                <div className="pt-8 border-t border-border-luxe/20 space-y-6">
                  {user ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold uppercase tracking-widest">Hello, {user.name?.split(' ')[0]}</span>
                        <div className="w-10 h-10 bg-primary-luxe text-white rounded-full flex items-center justify-center font-bold">{getUserInitials()}</div>
                      </div>
                      <button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-500 rounded-full text-xs font-bold uppercase tracking-widest">Logout</button>
                    </>
                  ) : (
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="block w-full py-4 bg-primary-luxe text-white text-center rounded-full text-xs font-bold uppercase tracking-widest">Sign In / Register</Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;