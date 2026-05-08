import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Auth from './pages/Auth';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import About from './pages/About';
import Help from './pages/Help';
import SearchResults from './pages/SearchResults';
import Deals from './pages/Deals';
import Comparison from './pages/Comparison';
import NotFound from './pages/NotFound';
import Brands from './pages/Brands';

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <StoreProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Landing page changed to Products */}
                <Route path="/" element={<Products />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/comparison" element={<Comparison />} />
                <Route path="/brands" element={<Brands />} />
                {/* Optional: original home page accessible at /home if you want to keep it */}
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </StoreProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}