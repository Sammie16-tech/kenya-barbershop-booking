import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { FaMapMarkerAlt, FaSearch, FaStar, FaChevronRight, FaFilter } from 'react-icons/fa';
const MapView = dynamic(() => import('../components/MapView'), { ssr: false });
import ShopCard from '../components/ShopCard';
import { kenyaLocations } from '../utils/kenyaLocations';

export default function Home() {
  const [shops, setShops] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'map'
  const router = useRouter();

  useEffect(() => {
    getUserLocation();
    fetchShops();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => setUserLocation({ lat: -1.2921, lng: 36.8219 }) // Default Nairobi
      );
    }
  };

  const fetchShops = async (params = {}) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shops`, { params });
      setShops(response.data.shops || []);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-3xl rounded-full bg-blue-600 -mr-24 -mt-24 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent -skew-x-12 transform origin-right hidden lg:block"></div>
        
        {/* Background Decorative Image */}
        <div className="absolute bottom-0 right-0 w-2/5 h-4/5 opacity-20 pointer-events-none hidden lg:block">
          <img src="/images/shop1.png" alt="" className="w-full h-full object-cover rounded-tl-[10rem]" />
        </div>

        <div className="layout-container relative z-10">
          <div className="max-w-3xl animate-slide-up">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
              Kenya's #1 Booking Platform
            </span>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-8">
              Style that <span className="text-blue-600">moves</span> with you.
            </h1>
            <p className="text-xl text-gray-500 mb-12 max-w-xl leading-relaxed">
              Discover top-rated barbers and salons near you. Book instantly, pay securely, and look your best without the wait.
            </p>
            
            {/* Modern Search Bar */}
            <div className="relative max-w-5xl mx-auto mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white/80 backdrop-blur-2xl p-3 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col lg:flex-row items-stretch gap-2">
                
                {/* Search Input */}
                <div className="flex-grow flex items-center px-6 py-3 gap-4 group">
                  <div className="bg-blue-50 p-2.5 rounded-2xl text-blue-600 transition-colors group-focus-within:bg-blue-600 group-focus-within:text-white">
                    <FaSearch className="text-sm" />
                  </div>
                  <input 
                    placeholder="Barber or Salon name..." 
                    className="w-full bg-transparent text-gray-900 outline-none font-bold placeholder:text-gray-400 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="hidden lg:block w-px bg-gray-100 my-4"></div>

                {/* County Selector */}
                <div className="flex items-center px-6 py-3 gap-4 min-w-[200px] hover:bg-gray-50/50 rounded-2xl transition-colors cursor-pointer relative group">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <div className="flex flex-col flex-grow">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">County</span>
                    <select 
                      className="w-full bg-transparent text-gray-900 outline-none font-bold text-sm appearance-none cursor-pointer"
                      value={selectedLocation}
                      onChange={(e) => {
                        setSelectedLocation(e.target.value);
                        setSelectedConstituency('');
                      }}
                    >
                      <option value="">All Counties</option>
                      {kenyaLocations.counties.map(c => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="hidden lg:block w-px bg-gray-100 my-4"></div>

                {/* Constituency Selector (Conditional) */}
                <div className={`flex items-center px-6 py-3 gap-4 min-w-[200px] hover:bg-gray-50/50 rounded-2xl transition-all ${selectedLocation ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                  <FaMapMarkerAlt className={selectedLocation ? 'text-blue-400' : 'text-gray-300'} />
                  <div className="flex flex-col flex-grow">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Constituency</span>
                    <select 
                      className="w-full bg-transparent text-gray-900 outline-none font-bold text-sm appearance-none cursor-pointer"
                      value={selectedConstituency}
                      onChange={(e) => setSelectedConstituency(e.target.value)}
                    >
                      <option value="">All Areas</option>
                      {selectedLocation && kenyaLocations.counties.find(c => c.name === selectedLocation)?.constituencies.map(cons => (
                        <option key={cons} value={cons}>{cons}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="hidden lg:block w-px bg-gray-100 my-4"></div>

                {/* Search Button */}
                <button 
                  onClick={() => fetchShops({ 
                    search: searchQuery, 
                    city: selectedLocation, 
                    constituency: selectedConstituency,
                    service: selectedService 
                  })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(37,99,235,0.3)] active:scale-95 flex items-center justify-center gap-2"
                >
                  <FaSearch className="text-xs" />
                  Find Style
                </button>
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                {['Haircut', 'Beard Trim', 'Massage', 'Styling'].map(service => (
                  <button 
                    key={service}
                    onClick={() => {
                      setSelectedService(service);
                      fetchShops({ service });
                    }}
                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all border ${
                      selectedService === service 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:text-blue-600'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200"></div>
                ))}
              </div>
              <p className="text-sm font-bold text-gray-900">
                <span className="text-blue-600">5,000+</span> happy clients in Nairobi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="layout-container -mt-16 relative z-20 pb-24">
        <div className="flex flex-col gap-12">
          {/* Header & View Switcher */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Discovery Hub</h2>
              <p className="text-gray-500 font-medium">Explore {shops.length} professional shops near you</p>
            </div>
            
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
              <button 
                onClick={() => setViewType('grid')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  viewType === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <FaSearch className="text-[10px]" /> Grid
              </button>
              <button 
                onClick={() => setViewType('map')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  viewType === 'map' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <FaMapMarkerAlt className="text-[10px]" /> Map
              </button>
            </div>
          </div>

          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* List Section */}
              <div className="lg:col-span-8">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-80 bg-gray-200 rounded-3xl animate-pulse"></div>
                    ))}
                  </div>
                ) : shops.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {shops.map((shop) => (
                      <div key={shop.id} className="animate-slide-up" style={{ animationDelay: `${shops.indexOf(shop) * 0.1}s` }}>
                        <ShopCard shop={shop} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <p className="text-xl font-bold text-gray-400">No shops found matching your criteria</p>
                    <button onClick={() => fetchShops()} className="mt-4 text-blue-600 font-bold hover:underline">Show all shops</button>
                  </div>
                )}
              </div>

              {/* Map & Promo Section */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-8">
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold">Quick Map</h3>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Live</span>
                    </div>
                    <div className="h-[400px] rounded-3xl overflow-hidden shadow-inner">
                      <MapView shops={shops} userLocation={userLocation} height="100%" />
                    </div>
                  </div>

                  {/* Promo Card */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <h3 className="text-2xl font-black mb-4">Are you a shop owner?</h3>
                    <p className="text-blue-100 mb-8 font-medium">Join 200+ salons and barbers growing their business with us.</p>
                    <button 
                      onClick={() => router.push('/auth/register')}
                      className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      List Your Shop <FaChevronRight className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Full Screen Map View */
            <div className="h-[700px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative animate-in fade-in zoom-in-95 duration-500">
              <MapView shops={shops} userLocation={userLocation} height="100%" />
              
              {/* Floating Results Counter */}
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-2xl border border-white/50 z-[1000]">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Found</p>
                <p className="text-2xl font-black text-gray-900">{shops.length} Shops</p>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500 font-medium">Everything you need to know about Kenya Barbers.</p>
          </div>
          <div className="space-y-6">
            {[
              { q: 'How do I book an appointment?', a: 'Simply search for a barber or salon near you, select your preferred service and time, and confirm your booking. You can pay securely via M-Pesa.' },
              { q: 'Can I cancel or reschedule my booking?', a: 'Yes! You can manage all your appointments from your "My Bookings" dashboard. Cancellations made 2 hours before the appointment are fully refunded.' },
              { q: 'How do I list my shop on Kenya Barbers?', a: 'Click the "List Your Shop" button, create a business account, and follow the easy setup guide to add your services, staff, and location.' },
              { q: 'Is my payment secure?', a: 'Absolutely. We integrate directly with Safaricom M-Pesa using their official secure APIs to process all transactions safely.' }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}