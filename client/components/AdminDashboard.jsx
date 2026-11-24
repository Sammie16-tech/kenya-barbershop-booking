import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { FaCalendarCheck, FaMoneyBillWave, FaUsers, FaStar, FaSignOutAlt, FaUserCircle, FaCut, FaClock, FaHistory, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const { user, logout, supabase } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardStats();

    // Real-time subscription for shop appointments
    if (user?.Shop?.id) {
      const channel = supabase
        .channel('public:Appointments')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'Appointments',
          filter: `shopId=eq.${user.Shop.id}`
        }, (payload) => {
          console.log('Admin: Change received!', payload);
          fetchDashboardStats();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchDashboardStats();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const formatKES = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const dailyRevenueChartData = {
    labels: stats?.dailyRevenue?.days || [],
    datasets: [
      {
        label: 'Daily Revenue (KES)',
        data: stats?.dailyRevenue?.revenueData || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        borderWidth: 2
      }
    ]
  };

  const revenueChartData = {
    labels: stats?.monthlyRevenue?.months || ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Monthly Revenue (KES)',
        data: stats?.monthlyRevenue?.revenueData || [12000, 19000, 15000, 22000],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const bookingStatsData = {
    labels: stats?.bookingStats?.labels || ['Confirmed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: stats?.bookingStats?.data || [65, 25, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <FaCut className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Partner Dashboard</h1>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Kenya Barbers Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pr-6 border-r">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{user?.role?.replace('_', ' ')}</p>
              </div>
              <FaUserCircle className="text-3xl text-gray-400" />
            </div>
            
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors font-bold text-xs uppercase tracking-wider"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Switcher */}
        <div className="flex gap-8 mb-8 border-b">
          {['overview', 'team', 'services', 'schedule'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-bold text-xs uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Today's Bookings", val: stats?.todayBookings || 0, icon: FaCalendarCheck, color: 'blue' },
                { label: "Today's Revenue", val: formatKES(stats?.todayRevenue || 0), icon: FaMoneyBillWave, color: 'green' },
                { label: "Weekly Revenue", val: formatKES(stats?.weeklyRevenue || 0), icon: FaMoneyBillWave, color: 'purple' },
                { label: "Shop Rating", val: user?.Shop?.rating || "0.0", icon: FaStar, color: 'yellow' }
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-sm border p-6 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-${s.color}-50 rounded-2xl text-${s.color}-600`}>
                      <s.icon className="text-xl" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                      <p className="text-2xl font-black text-gray-900">{s.val}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promotion Center */}
            <div className="bg-gradient-to-br from-indigo-900 to-black rounded-[2.5rem] p-8 mb-8 text-white relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                <FaRocket size={150} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-500/30 text-blue-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/30">Growth Hub</span>
                    {user?.Shop?.isFeatured && (
                      <span className="bg-amber-500/30 text-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/30">Currently Featured ✨</span>
                    )}
                  </div>
                  <h2 className="text-3xl font-black mb-2 tracking-tight">Boost Your Shop's Visibility 🚀</h2>
                  <p className="text-indigo-200 text-sm font-medium leading-relaxed">
                    Featured shops appear at the top of all search results and get <span className="text-white font-bold underline decoration-blue-500 underline-offset-4">3x more bookings</span> on average. 
                    Promote your business to the "Kenya Barbers" elite circle.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-4 min-w-[200px]">
                  <button 
                    onClick={async () => {
                      if (confirm('Promote your shop to Featured status for 30 days? (Mock payment)')) {
                        try {
                          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/promote`, { plan: 'featured_30' });
                          alert('Shop Promoted! Refreshing...');
                          window.location.reload();
                        } catch (err) {
                          alert('Promotion failed. Please try again.');
                        }
                      }
                    }}
                    disabled={user?.Shop?.isFeatured}
                    className={`w-full py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
                      user?.Shop?.isFeatured 
                      ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/10' 
                      : 'bg-white text-indigo-900 hover:bg-indigo-50 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {user?.Shop?.isFeatured ? 'Already Featured' : 'Upgrade to Featured'}
                  </button>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter italic">Starting from KES 2,500 / month</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Daily Trend (Main Chart) */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Revenue Trend</h3>
                    <p className="text-xs text-gray-500 font-bold mt-1">Daily income for the last 30 days</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      Daily
                    </span>
                  </div>
                </div>
                <div className="h-72">
                  <Line 
                    data={dailyRevenueChartData} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false, 
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: true, grid: { display: true, borderDash: [5, 5] } },
                        x: { grid: { display: false } }
                      }
                    }} 
                  />
                </div>
              </div>

              {/* Booking Stats (Side Chart) */}
              <div className="bg-white rounded-3xl shadow-sm border p-8">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Booking Status</h3>
                <div className="h-56 flex justify-center items-center relative">
                  <Doughnut 
                    data={bookingStatsData} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      cutout: '75%',
                      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 10, weight: 'bold' } } } }
                    }} 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
                    <span className="text-3xl font-black text-gray-900">{stats?.bookingStats?.data?.reduce((a, b) => a + b, 0) || 0}</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
               <div className="bg-white rounded-3xl shadow-sm border p-8">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Monthly Growth</h3>
                  <div className="h-48">
                    <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                  </div>
               </div>
               <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-xl p-8 text-white flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Pro Tip</h3>
                    <p className="text-xl font-bold leading-relaxed">
                      "Offering early-bird discounts for weekday mornings can increase your total monthly revenue by up to <span className="text-blue-400">15%</span>."
                    </p>
                  </div>
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                    View Business Insights
                  </button>
               </div>
            </div>

            {/* Staff Leaderboard */}
            <div className="bg-white rounded-3xl shadow-sm border p-8 mb-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Top Performers</h3>
                  <p className="text-xs text-gray-500 font-bold mt-1">Based on total revenue generated</p>
                </div>
                <button className="text-blue-600 font-bold text-xs hover:underline">View All Staff</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats?.staffStats?.slice(0, 3).map((member, idx) => (
                  <div key={member.id} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex items-center gap-4 group hover:bg-blue-50 transition-all cursor-pointer">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-black text-blue-600 border-4 border-white shadow-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm border flex items-center justify-center text-[10px] font-black text-gray-900">
                        #{idx + 1}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{member.name}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{member.role}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase">Revenue</span>
                          <span className="text-sm font-black text-gray-900">KES {member.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[8px] font-black text-gray-400 uppercase">Bookings</span>
                          <span className="text-sm font-black text-gray-900">{member.bookings}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments Table */}
            <div className="bg-white rounded-3xl shadow-sm border p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Upcoming Appointments</h3>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full">{stats?.upcomingAppointments?.length || 0} PENDING</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] text-gray-400 font-black uppercase tracking-widest border-b">
                      <th className="pb-4">Client</th>
                      <th className="pb-4">Service</th>
                      <th className="pb-4">Time</th>
                      <th className="pb-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats?.upcomingAppointments?.map((apt) => (
                      <tr key={apt.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <p className="font-bold text-gray-900">{apt.User?.firstName} {apt.User?.lastName}</p>
                          <p className="text-[10px] text-gray-500">{apt.User?.phoneNumber}</p>
                        </td>
                        <td className="py-4">
                          <p className="font-bold text-gray-900">{apt.Service?.name}</p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">KES {apt.price}</p>
                        </td>
                        <td className="py-4">
                          <p className="font-bold text-gray-900">{dayjs(apt.startTime).format('hh:mm A')}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{dayjs(apt.appointmentDate).format('MMM DD')}</p>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleStatusUpdate(apt.id, 'completed')}
                              className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-green-600 hover:text-white transition-all"
                            >
                              Complete
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                              className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!stats?.upcomingAppointments || stats.upcomingAppointments.length === 0) && (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-gray-400 font-medium italic">No pending appointments found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-3xl shadow-sm border p-8 animate-in fade-in duration-500">
            {/* Team Content ... (Restoring from previous read) */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold">Team Management</h3>
                <p className="text-sm text-gray-500">Manage your barbers and stylists</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                + Add Member
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats?.staff?.map((member, i) => (
                <div key={i} className="p-6 border rounded-3xl hover:border-blue-600 transition-all group">
                   <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center group-hover:border-blue-600 border-2 border-transparent transition-all">
                        <div className="text-xl font-bold text-gray-400">
                          {member.firstName?.[0]}{member.lastName?.[0]}
                        </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{member.firstName} {member.lastName}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                </div>
              )) || <p className="text-gray-400 italic">No team members added yet.</p>}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl shadow-sm border p-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold">Services & Pricing</h3>
                <p className="text-sm text-gray-500">Set your menu and rates</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg">
                + New Service
              </button>
            </div>
            <div className="space-y-4">
              {stats?.services?.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-6 border rounded-3xl hover:bg-gray-50 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                      <FaCut />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                        <FaClock className="text-[10px]" /> {s.duration} MINS
                      </p>
                      <p className="text-xl font-black text-blue-600">KES {s.price}</p>
                    </div>
                  </div>
                </div>
              )) || <p className="text-gray-400 italic">No services added yet.</p>}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white rounded-3xl shadow-sm border p-8 animate-in fade-in duration-500">
            <h3 className="text-xl font-bold mb-4">Operating Hours</h3>
            <p className="text-sm text-gray-500 mb-8">Set when your shop is open for bookings</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex items-center justify-between p-4 border rounded-2xl">
                  <span className="font-bold text-gray-700">{day}</span>
                  <div className="flex items-center gap-4">
                    <input type="time" defaultValue="09:00" className="border-none bg-gray-50 rounded-lg p-2 text-sm font-bold" />
                    <span className="text-gray-400 text-xs">to</span>
                    <input type="time" defaultValue="18:00" className="border-none bg-gray-50 rounded-lg p-2 text-sm font-bold" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}