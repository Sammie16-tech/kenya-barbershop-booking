import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { toast } from 'react-toastify';

export default function ReviewsSection({ shopId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (shopId) fetchReviews();
  }, [shopId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews/shop/${shopId}`);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please log in to leave a review');
    
    setSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        shopId,
        rating,
        comment
      });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchReviews(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-8">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Client Reviews</h2>
      </div>

      <div className="p-6">
        {user && user.role === 'client' && (
          <form onSubmit={submitReview} className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Leave a Review</h3>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <FaStar className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows="3"
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-blue-500 focus:border-blue-500"
                placeholder="How was your experience?"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {review.User?.profilePicture ? (
                      <img src={review.User.profilePicture} alt="User" className="w-10 h-10 rounded-full" />
                    ) : (
                      <FaUserCircle className="w-10 h-10 text-gray-300" />
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{review.User?.firstName} {review.User?.lastName}</p>
                      <p className="text-xs text-gray-400">{dayjs(review.createdAt).fromNow()}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mt-2 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
}
