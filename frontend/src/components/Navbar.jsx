import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Search, Heart, User, Menu, X, ChevronDown, 
  ArrowRight, Zap, Scale, LogOut, ChevronRight, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────
// 🔹 Desktop Navigation Dropdown (unchanged)
// ─────────────────────────────────────────────────────────────
const DesktopNavDropdown = memo(({ onHover }) => {
  const categories = ['Furniture', 'Lighting', 'Decor', 'Lifestyle', 'Accessories'];
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
      <div className="bg-white dark:bg-neutral-900 border border-border-luxe/20 shadow-2xl rounded-[2rem] overflow-hidden grid grid-cols-2">
        <div className="p-8 space-y-6">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Curated Spheres</h4>
          <nav className="flex flex-col space-y-2">
            {categories.map(cat => (
              <Link 
                key={cat} 
                to={`/products?category=${cat}`} 
                className="text-lg font-display hover:text-secondary-luxe transition-colors py-1 px-2 rounded-lg hover:bg-layer-luxe/50"
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-8 space-y-6">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary-luxe">Highlights</h4>
          <div className="space-y-4">
            {highlights.map(item => (
              <Link key={item.title} to={item.path} className="block p-3 rounded-xl hover:bg-layer-luxe/50 transition-colors">
                <span className="text-sm font-bold block">{item.title}</span>
                <span className="text-xs text-text-luxe/50 group-hover:text-secondary-luxe transition-colors">
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

// ─────────────────────────────────────────────────────────────
// 🔹 Lightweight Icon Button (no background, only hover color)
// ─────────────────────────────────────────────────────────────
const NavIcon = memo(({ icon: Icon, label, badge, onClick, href }) => {
  const content = (
    <>
      <Icon size={20} className="transition-colors" />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-2 bg-[#8B5E3C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </>
  );

  const commonProps = {
    className: "relative text-primary-luxe hover:text-secondary-luxe transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 rounded-full",
    'aria-label': label,
  };

  return href ? (
    <Link {...commonProps} to={href}>{content}</Link>
  ) : (
    <button {...commonProps} onClick={onClick}>{content}</button>
  );
});

// ─────────────────────────────────────────────────────────────
// 🔹 User Dropdown (opens on click, nice and clean)
// ─────────────────────────────────────────────────────────────
const UserDropdown = memo(({ user, getUserInitials, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Orders', path: '/orders', icon: ShoppingBag },
    { label: 'Wishlist', path: '/wishlist', icon: Heart },
    ...(user.role === 'admin' ? [{ label: 'Admin', path: '/admin', icon: Settings, highlight: true }] : []),
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-primary-luxe hover:text-secondary-luxe transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 rounded-full"
        aria-label="User menu"
      >
        <User size={20} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click outside closes the dropdown */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 8, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white border border-border-luxe/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
              role="menu"
            >
              {menuItems.map((item, idx) => (
                <Link 
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-5 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors ${
                    item.highlight ? 'text-[#8B5E3C]' : 'text-gray-700'
                  }`}
                >
                  {item.icon && <item.icon size={14} />}
                  <span>{item.label}</span>
                  <ChevronRight size={12} className="ml-auto text-gray-300" />
                </Link>
              ))}
              <div className="border-t border-gray-100">
                <button 
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="w-full flex items-center space-x-3 px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
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

  // Close menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize (if screen becomes large)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280 && isMobileOpen) setIsMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
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
    { label: 'Shop All', path: '/products' },
    { label: 'Deals', path: '/deals' },
    { label: 'Brands', path: '/brands' },
  ];

  const trendingSearches = ['Minimalist Vases', 'Soft Lighting', 'Linen Textures'];
  const curatedResults = ['New Arrivals', 'Clearance Archive', 'Best Sellers'];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'premium-blur shadow-md' : 'premium-blur'}`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo – always visible */}
          <Link to="/" className="font-display text-xl sm:text-2xl font-bold tracking-tighter text-primary-luxe uppercase focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 rounded-lg p-1">
            Aura<span className="text-secondary-luxe"> Luxe</span>
          </Link>

          {/* Desktop Center Navigation (visible only on large screens) */}
          <div className="hidden xl:flex items-center space-x-10">
            {/* Spheres Dropdown */}
            <div className="relative group" onMouseEnter={() => setIsDropdownHovered(true)} onMouseLeave={() => setIsDropdownHovered(false)}>
              <button className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-secondary-luxe transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 rounded-lg px-2">
                <span>Spheres</span>
                <ChevronDown size={12} className={`transition-transform duration-500 ${isDropdownHovered ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isDropdownHovered && <DesktopNavDropdown onHover={() => setIsDropdownHovered(true)} />}
              </AnimatePresence>
            </div>
            {/* Main Nav Links */}
            {navLinks.map(link => (
              <Link key={link.label} to={link.path} className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-secondary-luxe transition-colors py-2 px-1 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 rounded-lg">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Utility Icons (always visible) */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <NavIcon icon={Search} label="Search" onClick={() => setIsSearchOpen(!isSearchOpen)} />
            <NavIcon icon={Heart} label="Wishlist" href="/wishlist" badge={wishlist.length > 0 ? 1 : undefined} />
            <NavIcon icon={ShoppingBag} label="Cart" href="/cart" badge={cart.length} />
            
            {user ? (
              <UserDropdown user={user} getUserInitials={getUserInitials} onLogout={handleLogout} />
            ) : (
              <NavIcon icon={User} label="Sign In" href="/auth" />
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="xl:hidden relative text-primary-luxe hover:text-secondary-luxe transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/50 rounded-full"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay – solid white, no transparency */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl z-40 border-t border-gray-100"
          >
            <div className="max-w-4xl mx-auto py-6 px-4">
              <form onSubmit={handleSearch} className="relative">
                <input 
                  autoFocus 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search for furniture, lighting, decor..." 
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-24 text-base outline-none focus:border-[#8B5E3C] transition-all shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#8B5E3C] text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#6F472C] transition-all">
                  Go
                </button>
              </form>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Trending</span>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {trendingSearches.map(s => (
                      <button key={s} onClick={() => { setSearchQuery(s); handleSearch(); }} className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-[#8B5E3C] hover:text-white transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Quick Links</span>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {curatedResults.map(s => (
                      <button key={s} onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)} className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-[#8B5E3C] hover:text-white transition-colors">
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

      {/* Mobile Menu Drawer (slide from top-right) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60] xl:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-16 right-4 w-[calc(100%-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl z-[70] max-h-[85vh] overflow-y-auto xl:hidden"
            >
              <div className="p-5 space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="font-display text-xl font-bold tracking-tighter text-primary-luxe uppercase">
                    Aura<span className="text-secondary-luxe"> Luxe</span>
                  </span>
                  <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-[#8B5E3C] text-white rounded-full hover:bg-[#6F472C] transition-colors">
                    <X size={18} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {['Products', 'Deals', 'Brands', 'Comparison', 'About', 'Help'].map((link) => (
                    <Link
                      key={link}
                      to={`/${link.toLowerCase() === 'products' ? 'products' : link.toLowerCase()}`}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center justify-between w-full py-3 px-3 text-base font-display font-medium hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <span>{link}</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </Link>
                  ))}
                </nav>

                <div className="pt-2 border-t border-gray-100">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#8B5E3C] to-[#6F472C] text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {getUserInitials()}
                        </div>
                        <div>
                          <p className="text-sm font-bold">Hello, {user.name?.split(' ')[0]}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link to="/profile" onClick={() => setIsMobileOpen(false)} className="py-3 text-center bg-[#8B5E3C] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors">
                          Profile
                        </Link>
                        <Link to="/orders" onClick={() => setIsMobileOpen(false)} className="py-3 text-center bg-[#8B5E3C] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors">
                          Orders
                        </Link>
                      </div>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setIsMobileOpen(false)} className="block py-3 text-center bg-[#8B5E3C]/20 text-[#8B5E3C] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#8B5E3C] hover:text-white transition-colors">
                          Admin Console
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full py-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center space-x-2">
                        <LogOut size={14} /><span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link to="/auth" onClick={() => setIsMobileOpen(false)} className="block w-full py-3 bg-[#8B5E3C] text-white text-center rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors">
                        Sign In / Register
                      </Link>
                      <p className="text-center text-xs text-gray-500">Get exclusive access to new drops & member pricing</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400">© 2026 Aura Luxe</p>
                  <div className="flex justify-center gap-4 mt-2">
                    <a href="/privacy" className="text-[10px] text-gray-400 hover:text-secondary-luxe transition-colors">Privacy</a>
                    <a href="/terms" className="text-[10px] text-gray-400 hover:text-secondary-luxe transition-colors">Terms</a>
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