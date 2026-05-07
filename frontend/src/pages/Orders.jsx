import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const { data } = await orderAPI.getMyOrders();
        const orders = data.data;
        setActiveOrders(orders.filter(o => o.status !== 'delivered'));
        setArchivedOrders(orders.filter(o => o.status === 'delivered'));
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40 text-center">
        <div className="card-luxe p-20 space-y-8">
          <Package size={48} className="mx-auto text-border-luxe" />
          <h2 className="text-3xl font-display">Please Login to View Your Orders</h2>
          <Link to="/auth" className="inline-block px-10 py-4 bg-primary-luxe text-white rounded-full text-xs font-bold uppercase tracking-widest">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center py-40">Loading order history...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40">
      <div className="space-y-16">
        <div className="space-y-4 border-b border-border-luxe/10 pb-12 text-center lg:text-left">
           <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Logistics Intelligence</span>
           <h1 className="text-6xl font-display uppercase tracking-tight">Acquisition <span className="italic">History</span></h1>
        </div>

        {activeOrders.length > 0 && (
          <div className="space-y-10">
             <h2 className="text-2xl font-display flex items-center space-x-4"><Truck size={24} className="text-secondary-luxe" /><span>Active <span className="italic text-primary-luxe">Logistics</span></span></h2>
             <div className="space-y-6">
                {activeOrders.map(order => (
                  <div key={order._id} className="card-luxe p-10 border-2 border-primary-luxe/10 bg-layer-luxe/20">
                     <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
                        <div className="space-y-2"><span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Protocol ID</span><h3 className="text-xl font-bold font-mono">{order._id.slice(-8)}</h3><p className="text-xs text-text-luxe/60">Registered on {new Date(order.createdAt).toLocaleDateString()}</p></div>
                        <div className="space-y-2"><span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Dispatch Progress</span><div className="flex items-center space-x-3 text-secondary-luxe"><Clock size={16} /><span className="text-xs font-bold uppercase tracking-widest animate-pulse">{order.status}</span></div><div className="w-full h-1.5 bg-layer-luxe rounded-full overflow-hidden"><div className="w-2/3 h-full bg-secondary-luxe"></div></div></div>
                        <div className="space-y-2"><span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Valuation</span><p className="text-xl font-mono font-bold">${order.totalPrice.toLocaleString()}</p><p className="text-xs text-text-luxe/40">{order.orderItems.length} Archive Piece(s)</p></div>
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-4"><Link to={`/orders/${order._id}`} className="flex-1 py-4 bg-primary-luxe text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl text-center">Track Dispatch</Link></div>
                     </div>
                     <div className="mt-12 pt-12 border-t border-border-luxe/10 flex flex-col md:flex-row justify-between items-center gap-8">
                         <div className="flex items-center space-x-6"><div className="p-4 bg-white rounded-2xl shadow-inner border border-border-luxe/10"><MapPin size={24} className="text-primary-luxe" /></div><div className="space-y-1"><p className="text-sm font-bold">In Transit: Logistics Hub</p><p className="text-xs text-text-luxe/40">Estimated arrival: {new Date(Date.now() + 7*86400000).toLocaleDateString()}</p></div></div>
                         <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-primary-luxe cursor-pointer hover:translate-x-2 transition-transform"><span>Detailed logistics log</span><ExternalLink size={14} /></div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {archivedOrders.length > 0 && (
          <div className="space-y-10 pt-20">
             <h2 className="text-2xl font-display flex items-center space-x-4"><Package size={24} className="text-text-luxe/30" /><span>Curation <span className="italic text-primary-luxe">Archive</span></span></h2>
             <div className="card-luxe overflow-hidden border-border-luxe/10">
                <table className="w-full border-collapse text-left">
                  <thead><tr className="bg-layer-luxe/50 border-b border-border-luxe/10"><th className="py-6 px-10 text-[10px] font-bold uppercase tracking-widest text-text-luxe/30">Protocol</th><th className="py-6 px-10 text-[10px] font-bold uppercase tracking-widest text-text-luxe/30">Release Date</th><th className="py-6 px-10 text-[10px] font-bold uppercase tracking-widest text-text-luxe/30">Valuation</th><th className="py-6 px-10 text-[10px] font-bold uppercase tracking-widest text-text-luxe/30">Status</th><th></th></tr></thead>
                  <tbody className="divide-y divide-border-luxe/10">
                     {archivedOrders.map(order => (
                       <tr key={order._id} className="group hover:bg-layer-luxe transition-colors">
                          <td className="py-8 px-10 text-sm font-bold font-mono">{order._id.slice(-8)}</td>
                          <td className="py-8 px-10 text-sm text-text-luxe/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-8 px-10 text-sm font-mono font-bold">${order.totalPrice.toLocaleString()}</td>
                          <td className="py-8 px-10"><div className="flex items-center space-x-2 text-green-600 text-[10px] font-bold uppercase tracking-widest"><CheckCircle2 size={12} /><span>{order.status}</span></div></td>
                          <td className="py-8 px-10 text-right"><Link to={`/orders/${order._id}`} className="text-[10px] font-bold uppercase tracking-widest hover:text-secondary-luxe flex items-center justify-end space-x-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"><span>Details</span><ArrowRight size={12} /></Link></td>
                       </tr>
                     ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;