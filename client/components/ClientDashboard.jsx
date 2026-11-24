import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaHistory, FaStar, FaUserCircle, FaMapMarkerAlt, FaClock, FaTag, FaChevronRight, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function ClientDashboard() {
  const { user, logout, supabase } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const downloadReceipt = (apt) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('KENYA BARBERS', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Booking Receipt', 20, 32);
    
    // Receipt Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Receipt No: RB-${apt.id.slice(0, 8).toUpperCase()}`, 20, 60);
    doc.text(`Date: ${dayjs().format('MMMM DD, YYYY')}`, 20, 65);
    
    // Client & Shop Info
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 20, 80);
    doc.text('SHOP:', 120, 80);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`${user.firstName} ${user.lastName}`, 20, 85);
    doc.text(`${user.phoneNumber}`, 20, 90);
    
    doc.text(`${apt.Shop?.name}`, 120, 85);
    doc.text(`${apt.Shop?.address}`, 120, 90);
    
    // Table
    doc.autoTable({
      startY: 110,
      head: [['Service', 'Staff', 'Date', 'Time', 'Amount (KES)']],
      body: [[
        apt.Service?.name,
        `${apt.Staff?.firstName} ${apt.Staff?.lastName}`,
        dayjs(apt.appointmentDate).format('MMM DD, YYYY'),
        apt.startTime,
        `KES ${apt.price}`
      ]],
      headStyles: { fillStyle: [37, 99, 235], fontStyle: 'bold' },
      theme: 'grid'
    });
    
    // Footer
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL PAID: KES ${apt.price}`, pageWidth - 70, finalY);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for booking with Kenya Barbers. Powered by Litoh Graphics Studio.', pageWidth / 2, 280, { align: 'center' });
    
    doc.save(`Receipt-${apt.id.slice(0, 8)}.pdf`);
  };

  useEffect(() => {
    fetchDashboardData();

    // Real-time subscription
    const channel = supabase
      .channel('public:Appointments')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'Appointments',
        filter: `clientId=eq.${user?.id}`
      }, (payload) => {
        console.log('Change received!', payload);
        fetchAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [aptRes, favRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/favorites`)
      ]);
      setAppointments(aptRes.data.appointments || []);
      setFavorites(favRes.data.favorites || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingApts = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const pastApts = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-gray-900">My Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-blue-600 uppercase font-black tracking-widest">Premium Client</p>
            </div>
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-100 group-hover:border-blue-600 transition-all">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('image', file);
                      try {
                        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile-picture`, formData, {
                          headers: { 
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'multipart/form-data'
                          }
                        });
                        window.location.reload();
                      } catch (err) {
                        alert('Failed to upload image');
                      }
                    }
                  };
                  input.click();
                }}
                className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <FaUserCircle size={10} />
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <FaCalendarAlt size={180} />
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl font-black mb-4 leading-tight">Hello, {user?.firstName}! 👋</h2>
                <p className="text-blue-100 text-lg max-w-md font-medium leading-relaxed mb-8">
                  You have {upcomingApts.length} upcoming appointments. Ready to look your best?
                </p>
                <Link href="/" className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl transition-all active:scale-95">
                  Book New Session <FaChevronRight className="text-xs" />
                </Link>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900">Upcoming Bookings</h3>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">{upcomingApts.length} TOTAL</span>
              </div>
              
              <div className="space-y-4">
                {upcomingApts.length > 0 ? upcomingApts.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-600">
                        <span className="text-[10px] font-black uppercase">{dayjs(apt.appointmentDate).format('MMM')}</span>
                        <span className="text-xl font-black">{dayjs(apt.appointmentDate).format('DD')}</span>
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg">{apt.Service?.name}</h4>
                        <div className="flex gap-4 mt-1">
                          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                            <FaMapMarkerAlt className="text-blue-500" /> {apt.Shop?.name}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                            <FaClock className="text-blue-500" /> {dayjs(apt.startTime, 'HH:mm').format('hh:mm A')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      apt.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {apt.status}
                    </div>
                  </div>
                )) : (
                  <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-gray-100 text-center">
                    <p className="text-gray-400 font-bold mb-4">No upcoming bookings found</p>
                    <Link href="/" className="text-blue-600 font-black text-sm hover:underline">Browse shops now &rarr;</Link>
                  </div>
                )}
              </div>
            </div>

            {/* History */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900">Recent History</h3>
                <Link href="/appointments" className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">View All</Link>
              </div>
              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
                {pastApts.length > 0 ? pastApts.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="p-6 border-b border-gray-50 last:border-0 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <FaHistory />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{apt.Service?.name}</p>
                        <p className="text-xs text-gray-500">{dayjs(apt.appointmentDate).format('MMMM DD, YYYY')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-black text-gray-900 text-right">KES {apt.price}</p>
                      {apt.status === 'completed' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => downloadReceipt(apt)}
                            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                          >
                            Receipt
                          </button>
                          <button 
                            onClick={() => {
                              const rating = prompt('Rate your experience (1-5):', '5');
                              const comment = prompt('Leave a comment:');
                              if (rating && comment) {
                                axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
                                  shopId: apt.shopId,
                                  rating: parseInt(rating),
                                  comment
                                }).then(() => alert('Review submitted! Thank you.'))
                                  .catch(err => alert(err.response?.data?.message || 'Failed to submit review'));
                              }
                            }}
                            className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-600 hover:text-white transition-all flex items-center gap-2"
                          >
                            <FaStar className="text-[8px]" /> Review
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="p-10 text-center text-gray-400 font-medium italic">No history yet</div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <FaUserCircle />
                  </div>
                  <span className="font-bold text-gray-700">Edit Profile</span>
                </button>
                <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <FaStar />
                  </div>
                  <span className="font-bold text-gray-700">My Reviews</span>
                </button>
                <button onClick={logout} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 transition-colors group text-red-600">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <FaHistory />
                  </div>
                  <span className="font-bold">Logout</span>
                </button>
              </div>
            </div>

            {/* Referral Card */}
            <div className="bg-gradient-to-br from-blue-900 to-black rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <FaTag size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Referral Program</span>
                </div>
                <h3 className="text-xl font-black mb-2">Invite & Earn 🎁</h3>
                <p className="text-gray-400 text-xs font-medium mb-6 leading-relaxed">
                  Share your code with friends. For every 5 friends who book, you get <span className="text-white font-bold">1 Free Session!</span>
                </p>
                
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10 flex items-center justify-between mb-6">
                  <span className="font-mono font-black text-blue-400 tracking-widest">{user?.referralCode || 'BARBER254'}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(user?.referralCode || 'BARBER254');
                      alert('Code copied to clipboard!');
                    }}
                    className="text-[10px] font-black uppercase text-white hover:text-blue-400 transition-colors"
                  >
                    Copy
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Invites</p>
                    <p className="text-lg font-black">{user?.referralCount || 0}</p>
                  </div>
                  <div className="text-center bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Rewards</p>
                    <p className="text-lg font-black text-blue-400">{user?.referralRewards || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorite Shops */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Favorite Shops</h3>
              {favorites.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {favorites.map((shop) => (
                    <Link 
                      key={shop.id} 
                      href={`/shop/${shop.id}`}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 group"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm">
                        <img 
                          src={shop.image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&q=80'} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                          alt={shop.name}
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{shop.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{shop.city}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">VISIT</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FaStar className="text-yellow-400 text-4xl mx-auto mb-4 opacity-20" />
                  <p className="text-gray-400 font-medium text-sm">You haven't favorited any shops yet.</p>
                  <Link href="/" className="mt-4 inline-block text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">Explore Shops</Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
