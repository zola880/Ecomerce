import React, { useState } from 'react';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Bell, Shield, Edit2, Check } from 'lucide-react';
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
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-20 pb-40 text-center">
        <div className="card-luxe p-8 sm:p-20 space-y-8">
          <User size={48} className="mx-auto text-border-luxe" />
          <h2 className="text-2xl sm:text-3xl font-display">Please Login to View Your Profile</h2>
          <Link to="/auth" className="inline-block px-8 py-4 bg-[#8B5E3C] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-colors">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-20 pb-24 md:pb-40">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8 text-center lg:text-left">
          <div className="space-y-5">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-layer-luxe rounded-2xl md:rounded-[3rem] mx-auto lg:mx-0 flex items-center justify-center relative overflow-hidden border-2 border-[#8B5E3C]/20 shadow-lg">
              <img
                src={user.avatar || "https://picsum.photos/seed/profile/400/400"}
                alt={user.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-display uppercase tracking-tight">{user.name}</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary-luxe">{user.membershipTier || 'Collector'} Status</p>
              <p className="text-text-luxe/40 text-xs italic">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Link
              to="/orders"
              className="group flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-layer-luxe transition-all border border-transparent hover:border-border-luxe/10"
            >
              <div className="flex items-center space-x-3">
                <Package size={18} className="text-text-luxe/40 group-hover:text-[#8B5E3C]" />
                <span className="text-xs font-bold uppercase tracking-widest">Active Curations</span>
              </div>
              <ChevronRight size={14} className="text-text-luxe/30 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/wishlist"
              className="group flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-layer-luxe transition-all border border-transparent hover:border-border-luxe/10"
            >
              <div className="flex items-center space-x-3">
                <Heart size={18} className="text-text-luxe/40 group-hover:text-[#8B5E3C]" />
                <span className="text-xs font-bold uppercase tracking-widest">Aspirations</span>
              </div>
              <div className="flex items-center space-x-2">
                {wishlist.length > 0 && (
                  <span className="w-5 h-5 bg-[#8B5E3C] text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {wishlist.length}
                  </span>
                )}
                <ChevronRight size={14} className="text-text-luxe/30 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <div className="pt-6 mt-4 border-t border-border-luxe/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-red-50 text-red-500 transition-all group"
              >
                <span className="text-xs font-bold uppercase tracking-widest">Logout Protocol</span>
                <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-10 md:space-y-16">
          <div className="card-luxe p-6 md:p-10 space-y-6 md:space-y-8">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h3 className="text-2xl md:text-3xl font-display">Identity <span className="italic">Integrity</span></h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#8B5E3C] hover:text-[#6F472C] flex items-center space-x-2 transition-colors"
                >
                  <Edit2 size={14} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-5">
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-luxe w-full"
                  placeholder="Full Name"
                  required
                />
                <input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-luxe w-full"
                  placeholder="Email Address"
                  type="email"
                  required
                />
                <input
                  value={formData.address?.street || ''}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                  className="input-luxe w-full"
                  placeholder="Street Address"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={formData.address?.city || ''}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                    className="input-luxe"
                    placeholder="City"
                  />
                  <input
                    value={formData.address?.postalCode || ''}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })}
                    className="input-luxe"
                    placeholder="Postal Code"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex-1 py-3 md:py-4 bg-[#8B5E3C] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updateLoading ? 'Saving...' : <><Check size={14} /> Save Changes</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 md:py-4 border border-border-luxe rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-layer-luxe transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row justify-between border-b border-border-luxe/10 pb-3 gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-luxe/40">Name</span>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between border-b border-border-luxe/10 pb-3 gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-luxe/40">Email</span>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between pb-1 gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-luxe/40">Address</span>
                  <span className="text-sm font-medium">
                    {user.address?.street ? `${user.address.street}, ${user.address.city || ''} ${user.address.postalCode || ''}` : 'No address saved'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Optional: Security / Membership card */}
          <div className="card-luxe p-6 md:p-10 bg-gradient-to-r from-[#8B5E3C]/5 to-transparent">
            <div className="flex items-start gap-4 flex-wrap">
              <Shield size={28} className="text-[#8B5E3C] flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Secure Account</h4>
                <p className="text-text-luxe/60 text-xs">Your data is protected with industry-standard encryption.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;