import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { HiStar, HiLocationMarker, HiPhone, HiMail, HiGlobe } from 'react-icons/hi';
import BookingForm from '../../components/BookingForm';
import ReviewsSection from '../../components/ReviewsSection';

export default function ShopDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchShopDetails();
    }
  }, [id]);

  const fetchShopDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shops/${id}`);
      
      if (response.data.shop) {
        setShop(response.data.shop);
      }
    } catch (error) {
      console.error('Error fetching shop details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Shop Not Found</h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Header */}
      <div className="relative h-80 w-full bg-primary overflow-hidden">
        <img 
          src={shop.image} 
          alt={shop.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{shop.name}</h1>
              <div className="flex items-center text-gray-200 gap-4">
                <div className="flex items-center">
                  <HiStar className="text-yellow-400 w-5 h-5 mr-1" />
                  <span className="font-bold">{shop.rating}</span>
                </div>
                <div className="flex items-center">
                  <HiLocationMarker className="w-5 h-5 mr-1 text-blue-400" />
                  <span>{shop.address}, {shop.city}</span>
                </div>
              </div>
            </div>
            <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg active:scale-95">
              Contact Shop
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info & Services */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <HiPhone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Call us</p>
                  <p className="text-sm font-bold text-gray-900">+254 700 000000</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                <div className="bg-green-50 p-3 rounded-xl text-green-600">
                  <HiMail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                  <p className="text-sm font-bold text-gray-900">info@shop.co.ke</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                  <HiGlobe className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Website</p>
                  <p className="text-sm font-bold text-gray-900">www.shop.co.ke</p>
                </div>
              </div>
            </div>

            {/* Services List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {shop.services.map((service) => (
                  <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                        <p className="text-gray-500 text-sm">{service.description}</p>
                      </div>
                      <span className="text-xl font-bold text-blue-600">KES {service.price}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      <span>{service.duration} mins</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewsSection shopId={id} />
          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingForm 
                shop={shop} 
                services={shop.services} 
                staff={shop.staff} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
