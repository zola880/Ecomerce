import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, ShieldCheck, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { reviewAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const ReviewSystem = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await reviewAPI.getProductReviews(productId);
        setReviews(data.data);
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification('Please login to leave a review', 'info');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await reviewAPI.createReview(productId, newReview.rating, newReview.comment);
      setReviews([data.data, ...reviews]);
      setShowForm(false);
      setNewReview({ rating: 5, comment: '' });
      showNotification('Review submitted successfully', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = [...reviews].sort((a, b) => {
    if (activeFilter === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (activeFilter === 'highest rating') return b.rating - a.rating;
    return 0;
  });

  if (loading) return <div className="animate-pulse">Loading reviews...</div>;

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-border-luxe/10 pb-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-display">Collector <span className="italic">Sentiment</span></h2>
          <div className="flex items-center space-x-6">
             <div className="flex items-center space-x-1 text-highlight-luxe">
               {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
             </div>
             <span className="text-sm font-bold tracking-widest uppercase opacity-60">
               {reviews.length > 0 ? `${(reviews.reduce((a,b)=>a+b.rating,0)/reviews.length).toFixed(1)} Based on ${reviews.length} Curation Reviews` : 'No reviews yet'}
             </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
           {['Newest', 'Highest Rating'].map(f => (
             <button key={f} onClick={() => setActiveFilter(f.toLowerCase())} className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
               activeFilter === f.toLowerCase() ? 'bg-primary-luxe text-white' : 'bg-layer-luxe hover:bg-border-luxe/20'
             }`}>{f}</button>
           ))}
           <button onClick={() => setShowForm(!showForm)} className="px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-secondary-luxe text-white">
             Write Review
           </button>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-luxe p-10 space-y-8">
          <h3 className="text-2xl font-display">Share Your <span className="italic">Perspective</span></h3>
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest">Rating</label>
              <div className="flex space-x-2">
                {[1,2,3,4,5].map(r => (
                  <button type="button" key={r} onClick={() => setNewReview({...newReview, rating: r})} className="text-2xl">
                    <Star size={24} fill={newReview.rating >= r ? '#FFD700' : 'none'} color="#FFD700" />
                  </button>
                ))}
              </div>
            </div>
            <textarea rows={4} value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} placeholder="Describe your experience with this piece..." className="w-full bg-layer-luxe border border-border-luxe/20 rounded-2xl p-6 outline-none focus:border-primary-luxe" required />
            <button type="submit" disabled={submitting} className="px-10 py-4 bg-primary-luxe text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-secondary-luxe transition-all disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {filteredReviews.map((review, i) => (
           <motion.div key={review._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-luxe p-10 space-y-8">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                       <span className="font-bold text-sm">{review.name}</span>
                       {review.verified && <span className="text-[8px] font-bold uppercase tracking-widest bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center space-x-1"><ShieldCheck size={10} /> <span>Verified Curator</span></span>}
                    </div>
                    <p className="text-xs text-text-luxe/40">{new Date(review.createdAt).toLocaleDateString()}</p>
                 </div>
                 <div className="flex text-highlight-luxe">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                 </div>
              </div>
              <p className="text-text-luxe/70 leading-relaxed italic">"{review.comment}"</p>
           </motion.div>
         ))}
      </div>
    </div>
  );
};

export default ReviewSystem;