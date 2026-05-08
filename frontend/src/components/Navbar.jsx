import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Search, Heart, User, Menu, X, ChevronDown, 
  ArrowRight, Zap, Scale, LogOut, ChevronRight, Bell, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────
// 🔹 Sub-Components
// ─────────────────────────────────────────────────────────────

const DesktopNavDropdown = memo(({ onHover }) => {
  const categories = ['Furniture', 'Lighting', 'Decor', 'Lifestyle'];
  const highlights = [
    { title: 'New Arrivals 2026', desc: 'View latest release protocol', path: '/deals' },
    { title: 'Artisan Spotlight', desc: 'Meet the Japanese ceramic masters', path: '/brands' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full -left-20 w-[600px] pt-6 z-50"
      onMouseEnter={onHover}
    >
      {/* Added explicit solid background, no blur, full opacity */}
      <div className="bg-white dark:bg-neutral-900 border border-border-luxe/20 shadow-2xl rounded-[2rem] overflow-hidden grid grid-cols-2 backdrop-blur-none">
        {/* Left column – Categories */}
        <div className="p-8 space-y-6 bg-layer-luxe/30 backdrop-blur-none">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Curated Spheres</h4>
          <nav className="flex flex-col space-y-2" role="menu">
            {categories.map(cat => (
              <Link 
                key={cat} 
                to={`/products?category=${cat}`} 
                className="text-lg font-display hover:text-secondary-luxe transition-colors py-1 px-2 rounded-lg hover:bg-layer-luxe/50"
                role="menuitem"
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
        {/* Right column – Highlights */}
        <div className="p-8 space-y-6 backdrop-blur-none">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary-luxe">Highlights</h4>
          <div className="space-y-4">
            {highlights.map(item => (
              <Link 
                key={item.title} 
                to={item.path} 
                className="group/item block p-3 rounded-xl hover:bg-layer-luxe/50 transition-colors"
              >
                <span className="text-sm font-bold block">{item.title}</span>
                <span className="text-xs text-text-luxe/50 group-hover/item:text-secondary-luxe transition-colors">
                  {item.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});


// Updated ActionButton with brand colors
const ActionButton = memo(({ icon: Icon, label, badge, onClick, href, badgeColor = 'bg-[#8B5E3C]' }) => {
  const content = (
    <>
      <Icon size={20} aria-hidden="true" />
      {badge !== undefined && badge > 0 && (
        <motion.span 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className={`${badgeColor} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center`}
        >
          {badge > 99 ? '99+' : badge}
        </motion.span>
      )}
      {badge === 'pulse' && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-[#8B5E3C] rounded-full animate-pulse" aria-label="New items" />
      )}
    </>
  );

  const commonProps = {
    className: "p-2.5 bg-[#8B5E3C] hover:bg-[#6F472C] text-white rounded-full transition-all relative group focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50",
    'aria-label': label,
  };

  return href ? (
    <Link {...commonProps} to={href}>{content}</Link>
  ) : (
    <button {...commonProps} onClick={onClick}>{content}</button>
  );
});

// Updated UserDropdown button
const UserDropdown = memo(({ user, getUserInitials, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Orders', path: '/orders', icon: ShoppingBag },
    { label: 'Wishlist', path: '/wishlist', icon: Heart },
    ...(user.role === 'admin' ? [{ label: 'Admin', path: '/admin', icon: Settings, highlight: true }] : []),
  ];

  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1.5 pl-4 pr-1.5 bg-[#8B5E3C] text-white rounded-full hover:bg-[#6F472C] transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
          {user.name?.split(' ')[0]}
        </span>
        <div className="w-8 h-8 bg-gradient-to-br from-[#8B5E3C] to-[#6F472C] text-white rounded-full flex items-center justify-center text-xs font-bold uppercase shadow-lg">
          {getUserInitials()}
        </div>
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 8, scale: 0.98 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-bg-luxe border border-border-luxe/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
            role="menu"
          >
            {menuItems.map((item, idx) => (
              <Link 
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-5 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-layer-luxe transition-colors ${
                  item.highlight ? 'text-[#8B5E3C]' : 'text-primary-luxe'
                } ${idx === menuItems.length - 1 && !user.admin ? 'border-b border-border-luxe/20' : ''}`}
                role="menuitem"
              >
                {item.icon && <item.icon size={14} />}
                <span>{item.label}</span>
                <ChevronRight size={12} className="ml-auto text-text-luxe/30" />
              </Link>
            ))}
            <button 
              onClick={() => { onLogout(); setIsOpen(false); }}
              className="w-full flex items-center space-x-3 px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50/50 transition-colors rounded-b-2xl"
              role="menuitem"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// 🔹 Main Navbar Component
// ─────────────────────────────────────────────────────────────

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, wishlist } = useStore();
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsMobileOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen]);

  useEffect(() => {
    if (isMobileOpen) {
      const handleKey = (e) => {
        if (e.key === 'Escape') setIsMobileOpen(false);
      };
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKey);
        document.body.style.overflow = '';
      };
    }
  }, [isMobileOpen]);

  const handleSearch = useCallback((e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    setIsMobileOpen(false);
  }, [logout, navigate]);

  const getUserInitials = useCallback(() => {
    if (!user?.name) return 'G';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }, [user?.name]);

  const navLinks = [
    { label: 'Deals', path: '/deals', icon: Zap },
    { label: 'Shop All', path: '/products', icon: ShoppingBag },
    { label: 'Comparison', path: '/comparison', icon: Scale },
    { label: 'Brands', path: '/brands', icon: null },
  ];

  const trendingSearches = ['Minimalist Vases', 'Soft Lighting', 'Linen Textures'];
  const curatedResults = ['New Arrivals', 'Clearance Archive', 'Best Sellers'];

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'premium-blur shadow-lg' : 'premium-blur'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 rounded-lg p-1"
            aria-label="Aura Luxe Home"
          >
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tighter text-primary-luxe uppercase">
              Aura<span className="text-secondary-luxe"> Luxe</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-10">
            <div 
              className="group relative"
              onMouseEnter={() => setIsDropdownHovered(true)}
              onMouseLeave={() => setIsDropdownHovered(false)}
            >
              <button 
                className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-secondary-luxe transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 rounded-lg px-2"
                aria-haspopup="true"
                aria-expanded={isDropdownHovered}
              >
                <span>Spheres</span>
                <ChevronDown 
                  size={12} 
                  className={`transition-transform duration-500 ${isDropdownHovered ? 'rotate-180' : ''}`} 
                />
              </button>
              <AnimatePresence>
                {isDropdownHovered && <DesktopNavDropdown onHover={() => setIsDropdownHovered(true)} />}
              </AnimatePresence>
            </div>

            {navLinks.map(link => (
              <Link 
                key={link.label} 
                to={link.path} 
                className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-secondary-luxe transition-colors flex items-center space-x-1.5 py-2 px-1 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 rounded-lg"
              >
                {link.icon && <link.icon size={12} aria-hidden="true" />}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <ActionButton 
              icon={Search} 
              label="Search" 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
            />
            <ActionButton 
              icon={Heart} 
              label="Wishlist" 
              href="/wishlist" 
              badge={wishlist.length > 0 ? 'pulse' : undefined} 
            />
            <ActionButton 
              icon={ShoppingBag} 
              label="Cart" 
              href="/cart" 
              badge={cart.length} 
            />

            {user ? (
              <div className="hidden md:block">
                <UserDropdown 
                  user={user} 
                  getUserInitials={getUserInitials} 
                  onLogout={handleLogout} 
                />
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="hidden md:flex items-center text-[10px] font-bold uppercase tracking-widest text-white px-4 py-2 bg-[#8B5E3C] rounded-full hover:bg-[#6F472C] transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="xl:hidden p-2.5 bg-[#8B5E3C] text-white hover:bg-[#6F472C] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileOpen}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-bg-luxe border-b border-border-luxe/30 shadow-2xl z-40"
          >
            <div className="max-w-4xl mx-auto py-8 px-4">
              <form onSubmit={handleSearch} className="flex items-center space-x-4 border-b-2 border-border-luxe/40 pb-4 focus-within:border-primary-luxe transition-colors">
                <Search className="text-border-luxe flex-shrink-0" size={24} aria-hidden="true" />
                <input 
                  autoFocus 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search for furniture, lighting, decor..." 
                  className="w-full bg-transparent outline-none text-lg sm:text-2xl font-display tracking-tight placeholder:text-border-luxe/40"
                  aria-label="Search products"
                />
                <button 
                  type="submit" 
                  className="p-3 bg-[#8B5E3C] text-white rounded-full hover:bg-[#6F472C] transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B5E3C]"
                  aria-label="Submit search"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Trending</span>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {trendingSearches.map(s => (
                      <button 
                        key={s} 
                        onClick={() => { setSearchQuery(s); handleSearch(); }} 
                        className="text-sm px-3 py-1.5 bg-[#8B5E3C] text-white rounded-full hover:bg-[#6F472C] transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Quick Links</span>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {curatedResults.map(s => (
                      <button 
                        key={s} 
                        onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)} 
                        className="text-sm px-3 py-1.5 bg-[#8B5E3C] text-white rounded-full hover:bg-[#6F472C] transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] xl:hidden" 
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-bg-luxe z-[70] shadow-2xl xl:hidden flex flex-col safe-area-pb"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="flex justify-between items-center p-5 border-b border-border-luxe/20">
                <span className="font-display text-xl font-bold tracking-tighter text-primary-luxe uppercase">
                  Aura<span className="text-secondary-luxe"> Luxe</span>
                </span>
                <button 
                  onClick={() => setIsMobileOpen(false)} 
                  className="p-2 bg-[#8B5E3C] text-white hover:bg-[#6F472C] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-5 space-y-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-border-luxe" size={18} aria-hidden="true" />
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder="Search..." 
                    className="w-full pl-11 pr-4 py-3 bg-layer-luxe rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 transition-all"
                    aria-label="Search in mobile menu"
                  />
                </div>

                <nav className="space-y-2" role="menu">
                  {['Products', 'Deals', 'Brands', 'Comparison', 'About', 'Help'].map((link, idx) => (
                    <Link 
                      key={link} 
                      to={`/${link.toLowerCase() === 'products' ? 'products' : link.toLowerCase()}`} 
                      className="flex items-center justify-between w-full py-4 px-4 text-lg font-display font-light hover:bg-[#8B5E3C] hover:text-white rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50"
                      onClick={() => setIsMobileOpen(false)}
                      role="menuitem"
                    >
                      <span>{link}</span>
                      <ChevronRight size={18} className="text-text-luxe/40" />
                    </Link>
                  ))}
                </nav>

                <div className="pt-4 border-t border-border-luxe/20">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe mb-4 px-4">Browse Spheres</h4>
                  <div className="grid grid-cols-2 gap-2 px-4">
                    {['Furniture', 'Lighting', 'Decor', 'Lifestyle'].map(cat => (
                      <Link 
                        key={cat} 
                        to={`/products?category=${cat}`}
                        onClick={() => setIsMobileOpen(false)}
                        className="py-3 px-4 bg-[#8B5E3C] text-white rounded-xl text-sm font-medium text-center hover:bg-[#6F472C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border-luxe/20 space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center justify-between px-4 py-3 bg-layer-luxe rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#8B5E3C] to-[#6F472C] text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
                            {getUserInitials()}
                          </div>
                          <div>
                            <p className="text-sm font-bold">Hello, {user.name?.split(' ')[0]}</p>
                            <p className="text-xs text-text-luxe/60">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 px-4">
                        <Link to="/profile" onClick={() => setIsMobileOpen(false)} className="py-3 px-4 bg-[#8B5E3C] text-white rounded-xl text-xs font-bold uppercase tracking-widest text-center hover:bg-[#6F472C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50">
                          Profile
                        </Link>
                        <Link to="/orders" onClick={() => setIsMobileOpen(false)} className="py-3 px-4 bg-[#8B5E3C] text-white rounded-xl text-xs font-bold uppercase tracking-widest text-center hover:bg-[#6F472C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50">
                          Orders
                        </Link>
                      </div>
                      
                      <button 
                        onClick={handleLogout} 
                        className="w-full mx-4 py-4 bg-red-50 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        <LogOut size={14} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="px-4 space-y-3">
                      <Link 
                        to="/auth" 
                        onClick={() => setIsMobileOpen(false)} 
                        className="block w-full py-4 bg-[#8B5E3C] text-white text-center rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50"
                      >
                        Sign In / Register
                      </Link>
                      <p className="text-center text-xs text-text-luxe/60">
                        Get exclusive access to new drops & member pricing
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-border-luxe/20 bg-layer-luxe/30 safe-area-pb">
                <div className="flex items-center justify-between text-xs text-text-luxe/70">
                  <span>© 2026 Aura Luxe</span>
                  <div className="flex space-x-4">
                    <a href="/privacy" className="hover:text-secondary-luxe transition-colors">Privacy</a>
                    <a href="/terms" className="hover:text-secondary-luxe transition-colors">Terms</a>
                  </div>
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