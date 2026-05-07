import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  BarChart3, Plus, Search, Filter, MoreVertical,
  ArrowUpRight, ArrowDownRight, CheckCircle2, AlertCircle,
  MessageSquare, Tag, FileText, Edit2, Trash2, X, Save, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminAPI, productAPI, orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '', price: '', category: 'Furniture', description: '', image: '', stock: 10,
    isNew: false, isBestSeller: false, isSale: false, salePrice: ''
  });

  useEffect(() => {
    if (user?.role !== 'admin') return;
    loadDashboardData();
  }, [activeTab, user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const { data } = await adminAPI.getStats();
        setStats(data.data);
      } else if (activeTab === 'inventory') {
        const { data } = await productAPI.getProducts({ limit: 100 });
        setProducts(data.data.products);
      } else if (activeTab === 'orders') {
        const { data } = await orderAPI.getOrders({ limit: 50 });
        setOrders(data.data.orders);
      } else if (activeTab === 'users') {
        const { data } = await adminAPI.getUsers();
        setUsers(data.data);
      }
    } catch (error) {
      showNotification('Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Permanently delete this piece from the archive?')) {
      try {
        await productAPI.deleteProduct(id);
        showNotification('Product deleted', 'success');
        loadDashboardData();
      } catch (error) {
        showNotification('Delete failed', 'error');
      }
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, productForm);
        showNotification('Product updated', 'success');
      } else {
        await productAPI.createProduct(productForm);
        showNotification('Product created', 'success');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', price: '', category: 'Furniture', description: '', image: '', stock: 10, isNew: false, isBestSeller: false, isSale: false, salePrice: '' });
      loadDashboardData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateOrderStatus(orderId, status);
      showNotification(`Order status updated to ${status}`, 'success');
      loadDashboardData();
    } catch (error) {
      showNotification('Status update failed', 'error');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Delete this user permanently?')) {
      try {
        await adminAPI.deleteUser(userId);
        showNotification('User deleted', 'success');
        loadDashboardData();
      } catch (error) {
        showNotification('Delete failed', 'error');
      }
    }
  };

  if (user?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center">Access Denied. Admin privileges required.</div>;
  }

  // Sidebar navigation items
  const navItems = [
    { id: 'dashboard', label: 'Analytics', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Logistics', icon: ShoppingCart },
    { id: 'users', label: 'Collectors', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-bg-luxe">
      {/* Mobile hamburger button (visible below lg) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-luxe text-white rounded-full shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar for desktop & mobile drawer */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-80 bg-layer-luxe border-r border-border-luxe/20
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6 md:p-8">
          <div className="flex justify-between items-center mb-8 lg:mb-16">
            <span className="font-display text-xl font-bold uppercase tracking-tighter">Aura <span className="italic font-light">Terminal</span></span>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-border-luxe/20 rounded-full">
              <X size={20} />
            </button>
          </div>
          <nav className="space-y-2 flex-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === item.id
                    ? 'bg-primary-luxe text-white shadow-xl shadow-primary-luxe/20'
                    : 'hover:bg-border-luxe/20 text-text-luxe/60'
                }`}
              >
                <item.icon size={18} /><span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          {/* Header with title and action button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border-luxe/10 pb-6 md:pb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Operational Console</span>
              <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight">System <span className="italic">Overview</span></h1>
            </div>
            <div className="flex items-center space-x-3">
              {activeTab === 'inventory' && (
                <button
                  onClick={() => { setEditingProduct(null); setProductForm({ name: '', price: '', category: 'Furniture', description: '', image: '', stock: 10, isNew: false, isBestSeller: false, isSale: false, salePrice: '' }); setShowProductModal(true); }}
                  className="flex items-center space-x-2 px-4 py-3 md:px-6 md:py-4 bg-primary-luxe text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-secondary-luxe transition-all shadow-xl"
                >
                  <Plus size={16} /><span>Enact New Piece</span>
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && stats && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10 md:space-y-12">
                {/* Stats grid - responsive: 1 on mobile, 2 on tablet, 4 on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                  <div className="card-luxe p-5 md:p-8 space-y-4 md:space-y-6">
                    <div className="flex justify-between"><div className="p-3 md:p-4 bg-primary-luxe rounded-2xl text-white"><BarChart3 size={20} className="md:w-6 md:h-6" /></div><span className="text-green-600 text-[10px] font-bold">+12.5%</span></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Total Revenue</p><h3 className="text-2xl md:text-3xl font-display">${stats?.totalRevenue?.toLocaleString() || 0}</h3></div>
                  </div>
                  <div className="card-luxe p-5 md:p-8 space-y-4 md:space-y-6">
                    <div className="flex justify-between"><div className="p-3 md:p-4 bg-secondary-luxe rounded-2xl text-white"><ShoppingCart size={20} className="md:w-6 md:h-6" /></div><span className="text-green-600 text-[10px] font-bold">+5.2%</span></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Active Orders</p><h3 className="text-2xl md:text-3xl font-display">{stats?.totalOrders || 0}</h3></div>
                  </div>
                  <div className="card-luxe p-5 md:p-8 space-y-4 md:space-y-6">
                    <div className="flex justify-between"><div className="p-3 md:p-4 bg-highlight-luxe rounded-2xl text-white"><Package size={20} className="md:w-6 md:h-6" /></div><span className="text-green-600 text-[10px] font-bold">+8%</span></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Products</p><h3 className="text-2xl md:text-3xl font-display">{stats?.totalProducts || 0}</h3></div>
                  </div>
                  <div className="card-luxe p-5 md:p-8 space-y-4 md:space-y-6">
                    <div className="flex justify-between"><div className="p-3 md:p-4 bg-primary-luxe rounded-2xl text-white"><Users size={20} className="md:w-6 md:h-6" /></div><span className="text-green-600 text-[10px] font-bold">+18.4%</span></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Collectors</p><h3 className="text-2xl md:text-3xl font-display">{stats?.totalUsers || 0}</h3></div>
                  </div>
                </div>
                <div className="card-luxe p-6 md:p-10 space-y-6 md:space-y-8">
                  <h3 className="text-xl md:text-2xl font-display">Recent <span className="italic">Logistics</span></h3>
                  <div className="space-y-4">
                    {stats?.recentOrders?.map(order => (
                      <div key={order._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border-luxe/10 pb-4">
                        <div><p className="text-sm font-bold">{order._id.slice(-8)}</p><p className="text-xs text-text-luxe/40">{order.user?.name}</p></div>
                        <div><span className="text-xs font-mono">${order.totalPrice}</span><span className="ml-4 text-[9px] font-bold uppercase bg-secondary-luxe/10 px-2 py-1 rounded-full">{order.status}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="card-luxe overflow-x-auto">
                  <table className="w-full border-collapse text-left min-w-[800px]">
                    <thead><tr className="border-b border-border-luxe/10 bg-layer-luxe/50"><th className="py-4 md:py-6 px-4 md:px-8 text-[10px] font-bold uppercase tracking-widest">Piece</th><th className="py-4 md:py-6 px-4 md:px-8">Status</th><th className="py-4 md:py-6 px-4 md:px-8">Valuation</th><th className="py-4 md:py-6 px-4 md:px-8">Sphere</th><th className="py-4 md:py-6 px-4 md:px-8">Stock</th><th className="py-4 md:py-6 px-4 md:px-8"></th></tr></thead>
                    <tbody className="divide-y divide-border-luxe/10">
                      {loading ? <tr><td colSpan="6" className="text-center py-12 md:py-20">Loading inventory...</td></tr> : products.map(p => (
                        <tr key={p._id} className="hover:bg-layer-luxe/20 transition-all group">
                          <td className="py-4 md:py-6 px-4 md:px-8"><div className="flex items-center space-x-3 md:space-x-4"><div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-layer-luxe overflow-hidden"><img src={p.image} alt={p.name} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" /></div><span className="text-sm font-bold">{p.name}</span></div></td>
                          <td className="py-4 md:py-6 px-4 md:px-8"><span className="flex items-center space-x-2 text-[10px] font-bold uppercase text-green-600"><CheckCircle2 size={12} /><span>Active</span></span></td>
                          <td className="py-4 md:py-6 px-4 md:px-8 text-sm font-mono">${p.price}</td>
                          <td className="py-4 md:py-6 px-4 md:px-8 text-xs">{p.category}</td>
                          <td className="py-4 md:py-6 px-4 md:px-8 text-xs">{p.stock} units</td>
                          <td className="py-4 md:py-6 px-4 md:px-8 text-right"><div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setEditingProduct(p); setProductForm({ name: p.name, price: p.price, category: p.category, description: p.description, image: p.image, stock: p.stock, isNew: p.isNew, isBestSeller: p.isBestSeller, isSale: p.isSale, salePrice: p.salePrice || '' }); setShowProductModal(true); }} className="p-2 hover:bg-border-luxe rounded-lg"><Edit2 size={16} /></button><button onClick={() => handleDeleteProduct(p._id)} className="p-2 hover:bg-red-100 rounded-lg text-red-500"><Trash2 size={16} /></button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="card-luxe overflow-x-auto">
                  <table className="w-full border-collapse text-left min-w-[900px]">
                    <thead><tr className="border-b border-border-luxe/10 bg-layer-luxe/50"><th className="py-4 md:py-6 px-4 md:px-8">Order ID</th><th className="py-4 md:py-6 px-4 md:px-8">Customer</th><th className="py-4 md:py-6 px-4 md:px-8">Date</th><th className="py-4 md:py-6 px-4 md:px-8">Total</th><th className="py-4 md:py-6 px-4 md:px-8">Status</th><th className="py-4 md:py-6 px-4 md:px-8">Actions</th></tr></thead>
                    <tbody className="divide-y divide-border-luxe/10">
                      {loading ? <tr><td colSpan="6" className="text-center py-12 md:py-20">Loading orders...</td></tr> : orders.map(order => (
                        <tr key={order._id} className="hover:bg-layer-luxe/20">
                          <td className="py-4 md:py-6 px-4 md:px-8 font-mono text-sm">{order._id.slice(-8)}</td>
                          <td className="py-4 md:py-6 px-4 md:px-8">{order.user?.name}</td>
                          <td className="py-4 md:py-6 px-4 md:px-8 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 md:py-6 px-4 md:px-8 font-mono font-bold">${order.totalPrice}</td>
                          <td className="py-4 md:py-6 px-4 md:px-8"><select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)} className="bg-transparent border border-border-luxe rounded-lg px-2 py-1 text-xs font-bold uppercase"><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td>
                          <td className="py-4 md:py-6 px-4 md:px-8"><Link to={`/orders/${order._id}`} className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">View</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="card-luxe overflow-x-auto">
                  <table className="w-full border-collapse text-left min-w-[800px]">
                    <thead><tr className="border-b border-border-luxe/10 bg-layer-luxe/50"><th className="py-4 md:py-6 px-4 md:px-8">Name</th><th className="py-4 md:py-6 px-4 md:px-8">Email</th><th className="py-4 md:py-6 px-4 md:px-8">Role</th><th className="py-4 md:py-6 px-4 md:px-8">Joined</th><th className="py-4 md:py-6 px-4 md:px-8">Actions</th></tr></thead>
                    <tbody className="divide-y divide-border-luxe/10">
                      {loading ? <tr><td colSpan="5" className="text-center py-12 md:py-20">Loading users...</td></tr> : users.map(u => (
                        <tr key={u._id} className="hover:bg-layer-luxe/20">
                          <td className="py-4 md:py-6 px-4 md:px-8 font-medium">{u.name}</td>
                          <td className="py-4 md:py-6 px-4 md:px-8">{u.email}</td>
                          <td className="py-4 md:py-6 px-4 md:px-8"><span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-primary-luxe/20 text-primary-luxe' : 'bg-secondary-luxe/20 text-secondary-luxe'}`}>{u.role}</span></td>
                          <td className="py-4 md:py-6 px-4 md:px-8">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 md:py-6 px-4 md:px-8"><button onClick={() => deleteUser(u._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Product Modal - remains mostly same, but make it responsive */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-luxe rounded-2xl md:rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 md:p-8 space-y-5 md:space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-xl md:text-2xl font-display">{editingProduct ? 'Edit Piece' : 'Enact New Piece'}</h2><button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-layer-luxe rounded-full"><X size={20} /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Name" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="input-luxe col-span-1 md:col-span-2" />
              <input placeholder="Price" type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="input-luxe" />
              <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="input-luxe"><option>Furniture</option><option>Lighting</option><option>Decor</option><option>Lifestyle</option></select>
              <input placeholder="Image URL" value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})} className="input-luxe col-span-1 md:col-span-2" />
              <textarea placeholder="Description" rows={3} value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="input-luxe col-span-1 md:col-span-2" />
              <input placeholder="Stock" type="number" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} className="input-luxe" />
              <div className="flex flex-wrap gap-6 col-span-1 md:col-span-2">
                <label className="flex items-center space-x-2"><input type="checkbox" checked={productForm.isNew} onChange={(e) => setProductForm({...productForm, isNew: e.target.checked})} /><span className="text-xs font-bold">New Archive</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" checked={productForm.isBestSeller} onChange={(e) => setProductForm({...productForm, isBestSeller: e.target.checked})} /><span className="text-xs font-bold">Best Seller</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" checked={productForm.isSale} onChange={(e) => setProductForm({...productForm, isSale: e.target.checked})} /><span className="text-xs font-bold">Sale</span></label>
              </div>
              {productForm.isSale && <input placeholder="Sale Price" type="number" value={productForm.salePrice} onChange={(e) => setProductForm({...productForm, salePrice: e.target.value})} className="input-luxe col-span-1 md:col-span-2" />}
            </div>
            <button onClick={handleSaveProduct} className="w-full py-4 bg-primary-luxe text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-secondary-luxe">Save Piece</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;