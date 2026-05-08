import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, ExternalLink, ArrowRight, ShoppingBag } from 'lucide-react';
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
        const orders = data.data || [];
        setActiveOrders(orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled'));
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
        <div className="card-luxe p-8 sm:p-20 space-y-8">
          <Package size={48} className="mx-auto text-border-luxe" />
          <h2 className="text-2xl sm:text-3xl font-display">Please Login to View Your Orders</h2>
          <Link to="/auth" className="inline-block px-8 py-4 bg-[#8B5E3C] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40">
        <div className="space-y-8">
          <div className="animate-pulse h-8 w-48 bg-border-luxe/20 rounded"></div>
          <div className="animate-pulse h-64 w-full bg-border-luxe/20 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const hasOrders = activeOrders.length > 0 || archivedOrders.length > 0;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-20 pb-24 md:pb-40">
      <div className="space-y-12 md:space-y-16">
        {/* Header */}
        <div className="space-y-3 border-b border-border-luxe/10 pb-8 md:pb-12 text-center md:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Logistics Intelligence</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight">Acquisition <span className="italic">History</span></h1>
        </div>

        {!hasOrders && (
          <div className="text-center py-16 md:py-24 bg-layer-luxe/20 rounded-3xl">
            <ShoppingBag size={48} className="mx-auto text-border-luxe/50 mb-4" />
            <h3 className="text-xl font-display mb-2">No orders yet</h3>
            <p className="text-text-luxe/60 mb-6">Your acquisition history will appear here once you place an order.</p>
            <Link to="/products" className="inline-block px-8 py-4 bg-[#8B5E3C] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors">Start Shopping</Link>
          </div>
        )}

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="space-y-8 md:space-y-10">
            <h2 className="text-xl md:text-2xl font-display flex items-center space-x-3">
              <Truck size={24} className="text-secondary-luxe" />
              <span>Active <span className="italic text-primary-luxe">Logistics</span></span>
            </h2>
            <div className="space-y-6">
              {activeOrders.map(order => (
                <div key={order._id} className="card-luxe p-6 md:p-10 border-l-4 border-l-[#8B5E3C]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Protocol ID</span>
                      <h3 className="text-base md:text-xl font-mono font-bold break-all">{order._id.slice(-12)}</h3>
                      <p className="text-xs text-text-luxe/60">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Dispatch Progress</span>
                      <div className="flex items-center space-x-2 text-secondary-luxe">
                        <Clock size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest animate-pulse">{order.status}</span>
                      </div>
                      <div className="w-full h-1.5 bg-layer-luxe rounded-full overflow-hidden">
                        <div className="h-full bg-[#8B5E3C]" style={{ width: order.status === 'shipped' ? '75%' : order.status === 'processing' ? '40%' : '15%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Total Valuation</span>
                      <p className="text-xl md:text-2xl font-mono font-bold text-[#8B5E3C]">${order.totalPrice.toLocaleString()}</p>
                      <p className="text-xs text-text-luxe/40">{order.orderItems.length} item(s)</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Link
                        to={`/orders/${order._id}`}
                        className="w-full py-3 bg-[#8B5E3C] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors text-center shadow-md"
                      >
                        Track Order
                      </Link>
                      <Link
                        to={`/products`}
                        className="w-full py-3 border border-border-luxe rounded-xl text-[10px] font-bold uppercase tracking-widest text-center hover:bg-layer-luxe transition-colors"
                      >
                        Reorder Items
                      </Link>
                    </div>
                  </div>
                  {order.trackingNumber && (
                    <div className="mt-6 pt-6 border-t border-border-luxe/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center space-x-3">
                        <MapPin size={18} className="text-secondary-luxe" />
                        <span className="text-xs font-medium">Tracking: {order.trackingNumber}</span>
                      </div>
                      <button className="text-[10px] font-bold uppercase tracking-widest text-[#8B5E3C] hover:text-[#6F472C] flex items-center space-x-1">
                        <span>Detailed logistics</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Archived Orders (table, mobile responsive) */}
        {archivedOrders.length > 0 && (
          <div className="space-y-8 md:space-y-10 pt-8 md:pt-16">
            <h2 className="text-xl md:text-2xl font-display flex items-center space-x-3">
              <Package size={24} className="text-text-luxe/40" />
              <span>Curation <span className="italic text-primary-luxe">Archive</span></span>
            </h2>
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="min-w-[600px]">
                <table className="w-full border-collapse">
                  <thead className="bg-layer-luxe/30 border-b border-border-luxe/10">
                    <tr>
                      <th className="py-4 px-4 md:px-6 text-left text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Order</th>
                      <th className="py-4 px-4 md:px-6 text-left text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Date</th>
                      <th className="py-4 px-4 md:px-6 text-left text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Total</th>
                      <th className="py-4 px-4 md:px-6 text-left text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Status</th>
                      <th className="py-4 px-4 md:px-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-luxe/10">
                    {archivedOrders.map(order => (
                      <tr key={order._id} className="hover:bg-layer-luxe/20 transition-colors group">
                        <td className="py-5 px-4 md:px-6 font-mono text-sm font-bold">{order._id.slice(-8)}</td>
                        <td className="py-5 px-4 md:px-6 text-sm text-text-luxe/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-5 px-4 md:px-6 font-mono font-bold text-[#8B5E3C]">${order.totalPrice.toLocaleString()}</td>
                        <td className="py-5 px-4 md:px-6">
                          <div className="flex items-center space-x-2 text-green-600 text-[10px] font-bold uppercase tracking-widest">
                            <CheckCircle2 size={12} />
                            <span>{order.status}</span>
                          </div>
                        </td>
                        <td className="py-5 px-4 md:px-6 text-right">
                          <Link
                            to={`/orders/${order._id}`}
                            className="text-[10px] font-bold uppercase tracking-widest text-[#8B5E3C] hover:text-[#6F472C] flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span>Details</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;