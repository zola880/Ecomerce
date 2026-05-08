import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Search, Heart, User, Menu, X, ChevronDown, 
  ArrowRight, Zap, Scale, LogOut, ChevronRight, Bell, Settings,
  Grid, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────
// 🔹 Sub‑components (DesktopNavDropdown, ActionButton, UserDropdown unchanged)
// ─────────────────────────────────────────────────────────────

const DesktopNavDropdown = memo(({ onHover }) => {
  // ... (exactly same as original)
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
      <div className="bg-white dark:bg-neutral-900 border border-border-luxe/20 shadow-2xl rounded-[2rem] overflow-hidden grid grid-cols-2 backdrop-blur-none">
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

const ActionButton = memo(({ icon: Icon, label, badge, onClick, href, badgeColor = 'bg-[#8B5E3C]' }) => {
  // ... (already using brand colors)
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

const UserDropdown = memo(({ user, getUserInitials, onLogout }) => {
  // ... (unchanged)
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
// 🔹 Sphere Dropdown for Mobile (new component)
// ─────────────────────────────────────────────────────────────
const MobileSphereDropdown = memo(({ isOpen, onClose }) => {
  const categories = ['Furniture', 'Lighting', 'Decor', 'Lifestyle'];
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-border-luxe/20 z-50 overflow-hidden"
        >
          <div className="p-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-secondary-luxe mb-3">Curated Spheres</h4>
            <div className="flex flex-col space-y-2">
              {categories.map(cat => (
                <Link
                  key={cat}
                  to={`/products?category=${cat}`}
                  onClick={onClose}
                  className="block py-2 px-3 text-sm font-medium hover:bg-[#8B5E3C]/10 rounded-lg transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ─────────────────────────────────────────────────────────────
// 🔹 Main Navbar
// ─────────────────────────────────────────────────────────────
const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isSphereDropdownOpen, setIsSphereDropdownOpen] = useState(false);
  
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

          {/* Desktop Navigation (unchanged) */}
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

            {/* Sphere icon button (visible only on mobile/tablet) */}
            <div className="relative xl:hidden">
              <button
                onClick={() => setIsSphereDropdownOpen(!isSphereDropdownOpen)}
                className="p-2.5 bg-[#8B5E3C] text-white hover:bg-[#6F472C] rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50"
                aria-label="Sphere categories"
              >
                <Grid size={20} />
              </button>
              <MobileSphereDropdown isOpen={isSphereDropdownOpen} onClose={() => setIsSphereDropdownOpen(false)} />
            </div>

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

      {/* Search Overlay (unchanged) */}
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

      {/* NEW Mobile Menu – Dropdown from top‑right */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop that closes menu when clicked */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60] xl:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            {/* Menu panel – slides down from top‑right corner */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-16 right-4 w-[calc(100%-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl z-[70] max-h-[85vh] overflow-y-auto xl:hidden"
              style={{ backgroundColor: 'white' }}
            >
              <div className="p-5 space-y-6">
                {/* Header with logo and close */}
                <div className="flex justify-between items-center pb-2 border-b border-border-luxe/10">
                  <span className="font-display text-xl font-bold tracking-tighter text-primary-luxe uppercase">
                    Aura<span className="text-secondary-luxe"> Luxe</span>
                  </span>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 bg-[#8B5E3C] text-white rounded-full hover:bg-[#6F472C] transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Main navigation (without search and spheres) */}
                <nav className="space-y-1">
                  {['Products', 'Deals', 'Brands', 'Comparison', 'About', 'Help'].map((link) => (
                    <Link
                      key={link}
                      to={`/${link.toLowerCase() === 'products' ? 'products' : link.toLowerCase()}`}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center justify-between w-full py-3 px-3 text-base font-display font-medium hover:bg-[#8B5E3C]/10 rounded-xl transition-colors"
                    >
                      <span>{link}</span>
                      <ChevronRight size={16} className="text-text-luxe/40" />
                    </Link>
                  ))}
                </nav>

                {/* User section (if logged in / out) */}
                <div className="pt-2 border-t border-border-luxe/20">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 px-3 py-2 bg-layer-luxe rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#8B5E3C] to-[#6F472C] text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {getUserInitials()}
                        </div>
                        <div>
                          <p className="text-sm font-bold">Hello, {user.name?.split(' ')[0]}</p>
                          <p className="text-xs text-text-luxe/60">{user.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          to="/profile"
                          onClick={() => setIsMobileOpen(false)}
                          className="py-3 text-center bg-[#8B5E3C] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsMobileOpen(false)}
                          className="py-3 text-center bg-[#8B5E3C] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors"
                        >
                          Orders
                        </Link>
                      </div>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileOpen(false)}
                          className="block py-3 text-center bg-[#8B5E3C]/20 text-[#8B5E3C] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#8B5E3C] hover:text-white transition-colors"
                        >
                          Admin Console
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
                      >
                        <LogOut size={14} />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/auth"
                        onClick={() => setIsMobileOpen(false)}
                        className="block w-full py-3 bg-[#8B5E3C] text-white text-center rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors"
                      >
                        Sign In / Register
                      </Link>
                      <p className="text-center text-xs text-text-luxe/60">
                        Get exclusive access to new drops & member pricing
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-border-luxe/20 text-center">
                  <p className="text-xs text-text-luxe/50">© 2026 Aura Luxe</p>
                  <div className="flex justify-center gap-4 mt-2">
                    <a href="/privacy" className="text-[10px] text-text-luxe/40 hover:text-secondary-luxe transition-colors">Privacy</a>
                    <a href="/terms" className="text-[10px] text-text-luxe/40 hover:text-secondary-luxe transition-colors">Terms</a>
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