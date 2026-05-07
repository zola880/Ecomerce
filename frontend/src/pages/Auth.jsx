import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { motion } from 'motion/react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        showNotification('Welcome back to Aura Luxe', 'success');
      } else {
        await register(formData.name, formData.email, formData.password);
        showNotification('Account created successfully', 'success');
      }
      navigate('/');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full card-luxe p-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display uppercase tracking-tight">{isLogin ? 'Welcome Back' : 'Join the Sphere'}</h1>
          <p className="text-text-luxe/60 text-sm">{isLogin ? 'Enter your credentials to access your archive.' : 'Create an account to begin your curation journey.'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-luxe w-full" required />}
          <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-luxe w-full" required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="input-luxe w-full" required />
          <button type="submit" disabled={loading} className="w-full py-5 bg-primary-luxe text-white rounded-full uppercase tracking-widest text-xs font-bold hover:bg-secondary-luxe transition-all disabled:opacity-50">
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>
        <p className="text-center text-sm text-text-luxe/60">{isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary-luxe font-bold hover:underline">{isLogin ? 'Register' : 'Sign In'}</button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;