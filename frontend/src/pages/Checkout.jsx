import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { orderAPI } from '../services/api';
import { ShieldCheck, Truck, CreditCard, ChevronRight, CheckCircle2, Lock, MapPin, ArrowLeft } from 'lucide-react';
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
        paymentMethod: 'stripe',
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        totalPrice: total,
        orderItems,
      };
      const { data } = await orderAPI.createOrder(orderData);
      setOrderId(data.data?._id || data.data?.order?._id);
      setIsSuccess(true);
      await clearCart();
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
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 md:space-y-8 p-8 md:p-12 bg-layer-luxe/30 rounded-3xl md:rounded-[4rem] max-w-xl mx-auto">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={40} /></div>
          <div className="space-y-3"><h1 className="text-3xl md:text-4xl font-display uppercase tracking-tight">Acquisition <span className="italic">Manifested</span></h1><p className="text-text-luxe/60 text-sm">Your order protocol #{orderId?.slice?.(-8) || 'CONFIRMED'}. A confirmation has been sent to your email.</p></div>
          <div className="flex flex-col space-y-3"><Link to="/orders" className="bg-[#8B5E3C] text-white px-8 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-[#6F472C] transition-colors shadow-xl">Track Dispatch Status</Link><Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-text-luxe/40 hover:text-[#8B5E3C] underline">Return to Archive</Link></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 md:py-10 lg:py-20 pb-24 md:pb-40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-32">
        {/* Left side – Forms */}
        <div className="space-y-10 lg:space-y-14">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe">Acquisition Protocol</span>
            <h1 className="text-4xl lg:text-6xl font-display uppercase tracking-tight">Final <span className="italic">Verification</span></h1>
          </div>

          <div className="space-y-10">
            {/* Step 1 - Shipping */}
            <div className={`space-y-6 transition-opacity ${step !== 1 ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-[#8B5E3C] text-white' : 'bg-border-luxe/30 text-text-luxe/60'}`}>1</div>
                <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight">Logistics <span className="italic">Destination</span></h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <input placeholder="Street address" value={shippingAddress.street} onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})} className="input-luxe col-span-1 sm:col-span-2" />
                <input placeholder="City" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} className="input-luxe" />
                <input placeholder="Postal Code" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})} className="input-luxe" />
                <input placeholder="Country" value={shippingAddress.country} onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})} className="input-luxe col-span-1 sm:col-span-2" />
                <div className="col-span-1 sm:col-span-2 flex items-center space-x-3 p-5 bg-layer-luxe/50 rounded-xl border border-border-luxe/10">
                  <Truck size={18} className="text-secondary-luxe" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">White Glove Delivery (3-5 business days)</span>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full h-12 md:h-14 bg-[#8B5E3C] text-white rounded-xl uppercase tracking-widest text-xs font-bold hover:bg-[#6F472C] transition-all flex items-center justify-center space-x-2">
                <span>Proceed to Payment</span><ChevronRight size={14} />
              </button>
            </div>

            {/* Step 2 - Payment */}
            <div className={`space-y-6 transition-opacity ${step !== 2 ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-[#8B5E3C] text-white' : 'bg-border-luxe/30 text-text-luxe/60'}`}>2</div>
                <h2 className="text-xl md:text-2xl font-display uppercase tracking-tight">Financial <span className="italic">Transaction</span></h2>
              </div>
              <div className="card-luxe p-5 md:p-8 space-y-6 bg-layer-luxe/30 border border-[#8B5E3C]/20">
                <div className="flex justify-between items-center pb-3 border-b border-border-luxe/10">
                  <div className="flex items-center space-x-2"><CreditCard size={18} className="text-[#8B5E3C]" /><span className="text-xs md:text-sm font-bold uppercase tracking-widest">Vault Secure Entry</span></div>
                  <div className="flex gap-1"><div className="w-8 h-5 bg-border-luxe/20 rounded"></div><div className="w-8 h-5 bg-border-luxe/20 rounded"></div></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Card Number" className="input-luxe col-span-2 bg-white" />
                  <input placeholder="Expiry (MM/YY)" className="input-luxe bg-white" />
                  <input placeholder="CVC" className="input-luxe bg-white" />
                </div>
                <div className="flex items-center space-x-2 text-[9px] font-bold uppercase tracking-widest text-green-600"><Lock size={12} /><span>256-bit AES Encryption Active</span></div>
              </div>
              <button disabled={isProcessing} onClick={handlePlaceOrder} className="w-full h-14 md:h-20 bg-[#8B5E3C] text-white rounded-xl uppercase tracking-widest text-xs font-bold hover:bg-[#6F472C] transition-all shadow-xl flex items-center justify-center space-x-3">
                {isProcessing ? <span className="animate-pulse">Processing Acquisition...</span> : <><ShieldCheck size={16} /><span>Authorize Transaction (${total.toLocaleString()})</span></>}
              </button>
              <button onClick={() => setStep(1)} className="w-full text-[10px] font-bold uppercase tracking-widest text-text-luxe/40 hover:text-[#8B5E3C] transition-colors">Return to Logistics</button>
            </div>
          </div>
        </div>

        {/* Right side – Order Summary (mobile responsive) */}
        <div className="space-y-8">
          <div className="card-luxe p-5 md:p-8 lg:p-10 space-y-8 sticky top-24 bg-white shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-display uppercase tracking-tight">Archive <span className="italic">Selection</span></h3>
            <div className="space-y-5 max-h-[350px] md:max-h-[400px] overflow-y-auto pr-2">
              {cart.map((item, i) => (
                <div key={item._id || i} className="flex space-x-4 items-start">
                  <img src={item.product?.image} alt={item.product?.name} className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate">{item.product?.name}</h4>
                    <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text-luxe/40">Qty: {item.quantity} | Size: {item.size}</p>
                  </div>
                  <span className="font-mono font-bold text-sm md:text-base text-[#8B5E3C] whitespace-nowrap">${(item.product?.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-border-luxe/10 space-y-4">
              <div className="flex justify-between text-sm"><span className="font-bold text-[10px] uppercase tracking-widest text-text-luxe/40">Subtotal</span><span className="font-mono font-bold">${cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="font-bold text-[10px] uppercase tracking-widest text-text-luxe/40">Shipping</span><span className="font-mono font-bold">{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
              <div className="pt-4 flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary-luxe">Total</span>
                <span className="text-3xl md:text-4xl font-mono font-bold text-[#8B5E3C] tracking-tighter">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Link to="/cart" className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-widest text-secondary-luxe hover:text-[#6F472C] transition-colors">
            <ArrowLeft size={12} /><span>Back to Cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;