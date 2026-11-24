import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaStore, FaCut, FaUsers, FaClock, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { kenyaLocations } from '../../utils/kenyaLocations';

export default function ShopSetup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    address: '',
    city: '', // This will be the County
    constituency: '',
    phoneNumber: '',
    latitude: null,
    longitude: null,
    mpesaShortcode: '',
    mpesaPasskey: '',
    mpesaConsumerKey: '',
    mpesaConsumerSecret: '',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800'
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setShopData({
          ...shopData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        toast.success(`Location detected: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        setLoading(false);
      },
      (error) => {
        toast.error('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  const [services, setServices] = useState([
    { name: 'Basic Haircut', price: 500, duration: 30 },
    { name: 'Executive Haircut', price: 1000, duration: 45 }
  ]);

  const [staff, setStaff] = useState([
    { firstName: '', lastName: '', specialization: '' }
  ]);

  const handleShopChange = (e) => {
    setShopData({ ...shopData, [e.target.name]: e.target.value });
  };

  const addService = () => {
    setServices([...services, { name: '', price: 0, duration: 30 }]);
  };

  const addStaff = () => {
    setStaff([...staff, { firstName: '', lastName: '', specialization: '' }]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/shops`,
        {
          ...shopData,
          services,
          staff
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const shop = response.data.shop;
      
      // Trigger M-Pesa Subscription Prompt
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/subscribe`,
        {
          shopId: shop.id,
          plan: shopData.plan,
          phoneNumber: shopData.billingPhone || shopData.phoneNumber
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast.success('Shop registered! Please complete the M-Pesa prompt to activate.');
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to register shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s < step ? <FaCheckCircle /> : s}
                </div>
                <span className={`text-xs mt-2 font-semibold ${s <= step ? 'text-blue-600' : 'text-gray-400'}`}>
                  {s === 1 && 'Shop Info'}
                  {s === 2 && 'Services'}
                  {s === 3 && 'Team'}
                  {s === 4 && 'Billing'}
                  {s === 5 && 'Confirm'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FaStore className="text-blue-600" />
                  Register Your Shop
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Shop Name</label>
                    <input
                      name="name"
                      value={shopData.name}
                      onChange={handleShopChange}
                      className="mt-1 block w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. The Executive Cut"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">County</label>
                    <select
                      name="city"
                      value={shopData.city}
                      onChange={handleShopChange}
                      className="mt-1 block w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select County</option>
                      {kenyaLocations.counties.map(c => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {shopData.city && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Constituency</label>
                      <select
                        name="constituency"
                        value={shopData.constituency}
                        onChange={handleShopChange}
                        className="mt-1 block w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Constituency</option>
                        {kenyaLocations.counties.find(c => c.name === shopData.city)?.constituencies?.map(cons => (
                          <option key={cons} value={cons}>{cons}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">Physical Address / Landmark</label>
                      <button 
                        onClick={detectLocation}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg"
                      >
                        <FaClock className="text-[10px]" /> Auto-detect GPS
                      </button>
                    </div>
                    <input
                      name="address"
                      value={shopData.address}
                      onChange={handleShopChange}
                      className="mt-1 block w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Mpaka Road, near Westlands Mall"
                    />
                    {shopData.latitude && (
                      <p className="mt-2 text-[10px] font-mono text-green-600 font-bold uppercase tracking-widest">
                        GPS Locked: {shopData.latitude.toFixed(6)}, {shopData.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-dashed">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Integration (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">M-Pesa Shortcode</label>
                      <input
                        name="mpesaShortcode"
                        value={shopData.mpesaShortcode}
                        onChange={handleShopChange}
                        className="mt-1 block w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Till or Paybill"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">M-Pesa Passkey</label>
                      <input
                        name="mpesaPasskey"
                        type="password"
                        value={shopData.mpesaPasskey}
                        onChange={handleShopChange}
                        className="mt-1 block w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="API Passkey"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  Continue to Services
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FaCut className="text-blue-600" />
                  Your Services & Prices
                </h2>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-grow">
                        <label className="text-xs font-bold text-gray-400">Service Name</label>
                        <input
                          value={service.name}
                          onChange={(e) => {
                            const newServices = [...services];
                            newServices[index].name = e.target.value;
                            setServices(newServices);
                          }}
                          className="w-full border-gray-200 rounded-lg p-2"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-xs font-bold text-gray-400">Price (KES)</label>
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) => {
                            const newServices = [...services];
                            newServices[index].price = e.target.value;
                            setServices(newServices);
                          }}
                          className="w-full border-gray-200 rounded-lg p-2"
                        />
                      </div>
                    </div>
                  ))}
                  <button onClick={addService} className="text-blue-600 font-bold text-sm">+ Add Another Service</button>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold">Team Setup</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FaUsers className="text-blue-600" />
                  Build Your Team
                </h2>
                <div className="space-y-4">
                  {staff.map((member, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 border p-4 rounded-xl">
                      <input
                        placeholder="First Name"
                        value={member.firstName}
                        onChange={(e) => {
                          const newStaff = [...staff];
                          newStaff[index].firstName = e.target.value;
                          setStaff(newStaff);
                        }}
                        className="border-gray-200 rounded-lg p-2"
                      />
                      <input
                        placeholder="Specialization"
                        value={member.specialization}
                        onChange={(e) => {
                          const newStaff = [...staff];
                          newStaff[index].specialization = e.target.value;
                          setStaff(newStaff);
                        }}
                        className="border-gray-200 rounded-lg p-2"
                      />
                    </div>
                  ))}
                  <button onClick={addStaff} className="text-blue-600 font-bold text-sm">+ Add Team Member</button>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold">Back</button>
                  <button onClick={() => setStep(4)} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold">Choose Plan</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Select a Billing Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    onClick={() => setShopData({...shopData, plan: 'monthly'})}
                    className={`border-2 p-6 rounded-2xl cursor-pointer transition-all ${shopData.plan === 'monthly' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">Monthly Plan</h3>
                        <p className="text-sm text-gray-500">Pay as you go</p>
                      </div>
                      {shopData.plan === 'monthly' && <FaCheckCircle className="text-blue-600 text-2xl" />}
                    </div>
                    <div className="text-3xl font-black text-gray-900">300 KES <span className="text-sm text-gray-500 font-medium">/mo</span></div>
                  </div>

                  <div 
                    onClick={() => setShopData({...shopData, plan: 'yearly'})}
                    className={`border-2 p-6 rounded-2xl cursor-pointer transition-all relative ${shopData.plan === 'yearly' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <span className="bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Save 11%</span>
                    </div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">Yearly Plan</h3>
                        <p className="text-sm text-gray-500">Discounted rate</p>
                      </div>
                      {shopData.plan === 'yearly' && <FaCheckCircle className="text-blue-600 text-2xl" />}
                    </div>
                    <div className="text-3xl font-black text-gray-900">3,200 KES <span className="text-sm text-gray-500 font-medium">/yr</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl mt-6">
                  <p className="text-sm text-gray-600 mb-4"><strong>Note:</strong> A prompt will be sent to your phone to pay the subscription fee via M-Pesa once you click "Complete Registration".</p>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">M-Pesa Number for Subscription</label>
                  <input
                    type="text"
                    placeholder="0700000000"
                    value={shopData.billingPhone || shopData.phoneNumber || ''}
                    onChange={(e) => setShopData({...shopData, billingPhone: e.target.value})}
                    className="w-full border-gray-300 rounded-lg p-3"
                  />
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(3)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold">Back</button>
                  <button onClick={() => setStep(5)} disabled={!shopData.plan} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold disabled:opacity-50">Review Details</button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900">Final Confirmation</h2>
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <h3 className="font-bold text-blue-900 mb-2">{shopData.name}</h3>
                  <p className="text-blue-700 text-sm mb-4">{shopData.address}</p>
                  <div className="border-t border-blue-200 pt-4 mb-4">
                    <p className="text-sm font-bold text-blue-900">{services.length} Services • {staff.length} Staff Members</p>
                  </div>
                  <div className="border-t border-blue-200 pt-4 flex justify-between items-center">
                    <p className="font-bold text-blue-900">Subscription:</p>
                    <p className="font-black text-blue-900">{shopData.plan === 'yearly' ? '3,200 KES (Yearly)' : '300 KES (Monthly)'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(4)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold">Back</button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center"
                  >
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Pay & Launch My Shop'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
