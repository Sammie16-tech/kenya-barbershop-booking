import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import { HiStar, HiLocationMarker, HiClock, HiArrowRight, HiHeart } from 'react-icons/hi';

export default function ShopCard({ shop }) {
  const [isFavorite, setIsFavorite] = useState(shop.isFavorite || false);
  const rating = shop.rating || 5.0;

  const toggleFavorite = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/favorites/toggle`, {
        shopId: shop.id
      });
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite');
    }
  };
  
  const fallbackImages = [
// ...
    '/images/shop1.png',
    '/images/shop2.png',
    '/images/shop3.png',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    'https://images.unsplash.com/photo-1599351431247-f10b21ce5602?w=800&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80'
  ];

  const displayImage = shop.image || fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover-lift border border-gray-100 group">
      {/* Image Section */}
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src={displayImage}
          alt={shop.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Heart Button */}
        <button 
          onClick={toggleFavorite}
          className={`absolute top-4 right-16 p-2 rounded-2xl backdrop-blur-md border border-white/50 transition-all ${
            isFavorite ? 'bg-red-500 text-white border-red-500 shadow-lg' : 'bg-white/90 text-gray-400 hover:text-red-500'
          }`}
        >
          <HiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl border border-white/50">
          <HiStar className="text-yellow-500 w-4 h-4" />
          <span className="text-sm font-black text-gray-900">{rating.toFixed(1)}</span>
        </div>

        {/* Featured Badge (Mock logic) */}
        {rating > 4.8 && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            Top Rated
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors truncate">
            {shop.name}
          </h3>
          <div className="flex items-center text-gray-400 font-bold text-xs uppercase tracking-tighter mt-1">
            <HiLocationMarker className="w-3 h-3 mr-1 text-blue-500" />
            <span className="truncate">{shop.address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-y border-dashed border-gray-100 mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</span>
            <span className="text-xl font-black text-gray-900">KES {shop.minPrice || '500'}+</span>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Availability</span>
            <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span>Open Now</span>
            </div>
          </div>
        </div>

        <Link 
          href={`/shop/${shop.id}`}
          className="w-full btn-primary flex justify-center items-center gap-3 py-4 text-sm"
        >
          View Details
          <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
