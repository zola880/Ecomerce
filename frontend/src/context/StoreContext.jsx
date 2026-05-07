import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI, wishlistAPI, productAPI } from '../services/api';
import { useNotification } from './NotificationContext';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const loadCart = useCallback(async () => {
    try {
      const { data } = await cartAPI.getCart();
      setCart(data.data.items || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }, []);

  const loadWishlist = useCallback(async () => {
    try {
      const { data } = await wishlistAPI.getWishlist();
      setWishlist(data.data.products || []);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadCart();
      loadWishlist();
    }
    setLoading(false);
  }, [loadCart, loadWishlist]);

  const addToCart = async (product, quantity = 1, size = 'M') => {
    try {
      const productId = product._id || product.id; // fallback for mock data
      const { data } = await cartAPI.addToCart(productId, quantity, size);
      setCart(data.data.items);
      showNotification(`Added ${product.name} to cart`, 'success');
    } catch (error) {
      console.error('Add to cart error:', error);
      showNotification(error.response?.data?.message || 'Failed to add to cart', 'error');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await cartAPI.removeFromCart(itemId);
      setCart(data.data.items);
      showNotification('Item removed from cart', 'info');
    } catch (error) {
      console.error('Remove from cart error:', error);
      showNotification('Failed to remove item', 'error');
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    try {
      const { data } = await cartAPI.updateCartItem(itemId, quantity);
      setCart(data.data.items);
    } catch (error) {
      console.error('Update cart error:', error);
      showNotification('Failed to update quantity', 'error');
    }
  };

  const toggleWishlist = async (product) => {
    try {
      const productId = product._id || product.id;
      const isInWishlist = wishlist.some(item => (item._id || item.id) === productId);
      if (isInWishlist) {
        await wishlistAPI.removeFromWishlist(productId);
        setWishlist(prev => prev.filter(p => (p._id || p.id) !== productId));
        showNotification('Removed from wishlist', 'info');
      } else {
        await wishlistAPI.addToWishlist(productId);
        setWishlist(prev => [...prev, product]);
        showNotification('Added to wishlist', 'success');
      }
    } catch (error) {
      console.error('Toggle wishlist error:', error);
      showNotification('Failed to update wishlist', 'error');
    }
  };

  const addRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => (p._id || p.id) !== (product._id || product.id));
      return [product, ...filtered].slice(0, 5);
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      cart, wishlist, recentlyViewed, loading,
      addToCart, removeFromCart, updateCartQuantity, toggleWishlist, addRecentlyViewed,
      cartTotal
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);