import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { orderAPI } from '../services/api';
import { ShieldCheck, Truck, CreditCard, ChevronRight, CheckCircle2, Lock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useStore();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    if (user?.address) {
      setShippingAddress(user.address);
    }
  }, [user]);

  const shipping = cartTotal > 5000 ? 0 : 250;
  const total = cartTotal + shipping;

  const handlePlaceOrder = async () => {
    if (!user) {
      showNotification('Please login to checkout', 'error');
      navigate('/auth');
      return;
    }
    if (cart.length === 0) {
      showNotification('Your cart is empty', 'error');
      navigate('/cart');
      return;
    }
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      showNotification('Please fill in all shipping details', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // Prepare order items with product IDs and details
      const orderItems = cart.map(item => ({
        product: item.product?._id || item.product?.id,
        name: item.product?.name,
        price: item.product?.price,
        quantity: item.quantity,
        size: item.size,
        image: item.product?.image,
      }));

      const orderData = {
        shippingAddress,
        paymentMethod: 'stripe', // or 'cod'
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        totalPrice: total,
        orderItems, // Send items along
      };
      const { data } = await orderAPI.createOrder(orderData);
      setOrderId(data.data?._id || data.data?.order?._id);
      setIsSuccess(true);
      await clearCart(); // Ensure cart is cleared after successful order
      showNotification('Order placed successfully!', 'success');
    } catch (error) {
      console.error('Order error:', error);
      showNotification(error.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 p-12 bg-layer-luxe/30 rounded-[4rem] max-w-xl mx-auto">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={48} /></div>
          <div className="space-y-4"><h1 className="text-4xl font-display uppercase tracking-tight">Acquisition <span className="italic">Manifested</span></h1><p className="text-text-luxe/60">Your order protocol #{orderId?.slice?.(-8) || 'CONFIRMED'}. A confirmation has been sent to your email.</p></div>
          <div className="flex flex-col space-y-4"><Link to="/orders" className="bg-primary-luxe text-white px-10 py-5 rounded-full uppercase tracking-widest text-xs font-bold shadow-xl">Track Dispatch Status</Link><Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40 hover:text-primary-luxe underline">Return to Archive</Link></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-10 lg:py-20 pb-40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 xl:gap-40">
        <div className="space-y-12 lg:space-y-16">
          <div className="space-y-4"><span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Acquisition Protocol</span><h1 className="text-4xl lg:text-6xl font-display uppercase tracking-tight">Final <span className="italic">Verification</span></h1></div>

          <div className="space-y-12">
            {/* Shipping Section */}
            <div className={`space-y-8 transition-opacity ${step !== 1 ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex items-center space-x-4"><div className="w-10 h-10 rounded-full bg-primary-luxe text-white flex items-center justify-center text-xs font-bold">1</div><h2 className="text-2xl font-display uppercase tracking-tight">Logistics <span className="italic">Destination</span></h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <input placeholder="Street address" value={shippingAddress.street} onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})} className="input-luxe col-span-2" />
                 <input placeholder="City" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} className="input-luxe" />
                 <input placeholder="Postal Code" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})} className="input-luxe" />
                 <input placeholder="Country" value={shippingAddress.country} onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})} className="input-luxe col-span-2" />
                 <div className="col-span-2 flex items-center space-x-2 p-6 bg-layer-luxe/50 rounded-2xl border border-border-luxe/10"><Truck size={18} className="text-secondary-luxe" /><span className="text-xs font-bold uppercase tracking-widest">White Glove Delivery (3-5 Days)</span></div>
              </div>
              <button onClick={() => setStep(2)} className="w-full h-16 bg-primary-luxe text-white rounded-xl uppercase tracking-widest text-xs font-bold hover:bg-secondary-luxe transition-all flex items-center justify-center space-x-3">Proceed to Payment Protocol<ChevronRight size={16} /></button>
            </div>

            {/* Payment Section */}
            <div className={`space-y-8 transition-opacity ${step !== 2 ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex items-center space-x-4"><div className="w-10 h-10 rounded-full bg-primary-luxe text-white flex items-center justify-center text-xs font-bold">2</div><h2 className="text-2xl font-display uppercase tracking-tight">Financial <span className="italic">Transaction</span></h2></div>
              <div className="card-luxe p-8 space-y-8 bg-layer-luxe/30 border border-secondary-luxe/20">
                 <div className="flex justify-between items-center pb-4 border-b border-border-luxe/10"><div className="flex items-center space-x-3"><CreditCard size={20} className="text-primary-luxe" /><span className="text-sm font-bold uppercase tracking-widest">Vault Secure Entry</span></div><div className="flex gap-2"><div className="w-10 h-6 bg-border-luxe/20 rounded"></div><div className="w-10 h-6 bg-border-luxe/20 rounded"></div></div></div>
                 <div className="grid grid-cols-2 gap-4"><input placeholder="CARD NUMBER" className="input-luxe col-span-2 bg-white" /><input placeholder="EXP MM/YY" className="input-luxe bg-white" /><input placeholder="CVC PROTOCOL" className="input-luxe bg-white" /></div>
                 <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-green-600"><Lock size={12} /><span>256-bit AES Encryption Active</span></div>
              </div>
              <button disabled={isProcessing} onClick={handlePlaceOrder} className="w-full h-20 bg-primary-luxe text-white rounded-xl uppercase tracking-widest text-xs font-bold hover:bg-secondary-luxe transition-all shadow-2xl relative overflow-hidden flex items-center justify-center space-x-4">
                {isProcessing ? <span className="animate-pulse">Processing Acquisition...</span> : <><ShieldCheck size={18} /><span>Authorize Transaction (${total.toLocaleString()})</span></>}
              </button>
              <button onClick={() => setStep(1)} className="w-full text-[10px] font-bold uppercase tracking-widest text-text-luxe/40 hover:text-primary-luxe">Return to Logistics</button>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="space-y-12">
          <div className="card-luxe p-8 md:p-12 space-y-12 bg-layer-luxe/30 sticky top-32">
             <h3 className="text-2xl font-display uppercase tracking-tight">Archive <span className="italic">Selection</span></h3>
             <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4">
                {cart.map((item, i) => (
                  <div key={item._id || i} className="flex space-x-6 items-center">
                     <img src={item.product?.image} alt={item.product?.name} className="w-20 h-20 rounded-xl object-cover grayscale opacity-80" />
                     <div className="flex-1 space-y-1"><h4 className="text-sm font-bold truncate max-w-[200px]">{item.product?.name}</h4><p className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Unit: {item.quantity} | Size: {item.size}</p></div>
                     <span className="font-mono font-bold text-sm text-primary-luxe">${(item.product?.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
             </div>
             <div className="pt-8 border-t border-border-luxe/10 space-y-6">
                <div className="flex justify-between items-center text-xs opacity-60"><span className="font-bold uppercase tracking-widest">Subtotal</span><span className="font-mono font-bold">${cartTotal.toLocaleString()}</span></div>
                <div className="flex justify-between items-center text-xs opacity-60"><span className="font-bold uppercase tracking-widest">Logistics</span><span className="font-mono font-bold">{shipping === 0 ? 'Complimentary' : `$${shipping}`}</span></div>
                <div className="pt-6 flex justify-between items-end"><span className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary-luxe">Final Valuation</span><span className="text-4xl font-mono font-bold tracking-tighter text-primary-luxe">${total.toLocaleString()}</span></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;