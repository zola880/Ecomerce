import React, { useState } from 'react';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Bell, Shield, Edit2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { wishlist } = useStore();
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || { street: '', city: '', postalCode: '', country: '' }
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40 text-center">
        <div className="card-luxe p-20 space-y-8">
          <User size={48} className="mx-auto text-border-luxe" />
          <h2 className="text-3xl font-display">Please Login to View Your Profile</h2>
          <Link to="/auth" className="inline-block px-10 py-4 bg-primary-luxe text-white rounded-full text-xs font-bold uppercase tracking-widest">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
        <div className="lg:col-span-1 space-y-12 text-center lg:text-left">
           <div className="space-y-6">
              <div className="w-40 h-40 bg-layer-luxe rounded-[3rem] mx-auto lg:mx-0 flex items-center justify-center relative overflow-hidden border-2 border-primary-luxe/10">
                 <img src={user.avatar || "https://picsum.photos/seed/profile/400/400?grayscale"} alt="User" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-2">
                 <h1 className="text-3xl font-display uppercase tracking-tight">{user.name}</h1>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary-luxe">{user.membershipTier || 'Collector'} Status</p>
                 <p className="text-text-luxe/40 text-xs italic">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
           </div>
           <div className="flex flex-col space-y-2">
              <Link to="/orders" className="group flex items-center justify-between p-6 rounded-3xl hover:bg-layer-luxe transition-all border border-transparent hover:border-border-luxe/10">
                <div className="flex items-center space-x-4"><Package size={20} className="text-text-luxe/40 group-hover:text-primary-luxe" /><span className="text-xs font-bold uppercase tracking-widest">Active Curations</span></div>
              </Link>
              <Link to="/wishlist" className="group flex items-center justify-between p-6 rounded-3xl hover:bg-layer-luxe transition-all">
                <div className="flex items-center space-x-4"><Heart size={20} className="text-text-luxe/40 group-hover:text-primary-luxe" /><span className="text-xs font-bold uppercase tracking-widest">Aspirations</span></div>
                <span className="w-6 h-6 bg-primary-luxe text-white rounded-full flex items-center justify-center text-[10px] font-bold">{wishlist.length}</span>
              </Link>
              <div className="pt-8 mt-8 border-t border-border-luxe/10">
                <button onClick={handleLogout} className="w-full flex items-center justify-between p-6 rounded-3xl hover:bg-red-50 text-red-500 transition-all"><span className="text-xs font-bold uppercase tracking-widest">Logout Protocol</span><LogOut size={16} /></button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-16">
           <div className="card-luxe p-10 space-y-8">
             <div className="flex justify-between items-center"><h3 className="text-2xl font-display">Identity <span className="italic">Integrity</span></h3><button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-bold uppercase tracking-widest text-secondary-luxe flex items-center space-x-2"><Edit2 size={14} /><span>Edit Profile</span></button></div>
             {isEditing ? (
               <form onSubmit={handleUpdate} className="space-y-6">
                 <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-luxe w-full" placeholder="Name" />
                 <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-luxe w-full" placeholder="Email" />
                 <input value={formData.address?.street || ''} onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})} className="input-luxe w-full" placeholder="Street Address" />
                 <div className="grid grid-cols-2 gap-4">
                   <input value={formData.address?.city || ''} onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})} className="input-luxe" placeholder="City" />
                   <input value={formData.address?.postalCode || ''} onChange={(e) => setFormData({...formData, address: {...formData.address, postalCode: e.target.value}})} className="input-luxe" placeholder="Postal Code" />
                 </div>
                 <button type="submit" className="w-full py-4 bg-primary-luxe text-white rounded-xl text-xs font-bold uppercase tracking-widest">Save Changes</button>
               </form>
             ) : (
               <div className="space-y-6">
                 <div className="flex justify-between border-b border-border-luxe/10 pb-4"><span className="text-xs font-bold uppercase tracking-widest text-text-luxe/40">Name</span><span>{user.name}</span></div>
                 <div className="flex justify-between border-b border-border-luxe/10 pb-4"><span className="text-xs font-bold uppercase tracking-widest text-text-luxe/40">Email</span><span>{user.email}</span></div>
                 <div className="flex justify-between"><span className="text-xs font-bold uppercase tracking-widest text-text-luxe/40">Address</span><span>{user.address?.street}, {user.address?.city}, {user.address?.postalCode}</span></div>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;