import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaCut, FaBell } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`);
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img src="https://www.image2url.com/r2/default/images/1777987005192-2959afc3-e5cb-4a3d-b4ea-671b8b856bf6.png" alt="Kenya Barbers Logo" className="h-12 w-auto" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-6">
                <Link href="/appointments" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">
                  My Bookings
                </Link>
                <Link href="/messages" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">
                  Messages
                </Link>
                  <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">
                    Dashboard
                  </Link>
                  
                  {/* Notification Bell */}
                  <div className="relative group/notif">
                    <button className="text-gray-400 hover:text-blue-600 transition-all relative p-2">
                      <FaBell className="text-xl" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {/* Simple Dropdown Preview */}
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover/notif:opacity-100 group-hover/notif:visible transition-all duration-300 translate-y-2 group-hover/notif:translate-y-0 p-4">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Notifications</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {notifications.slice(0, 3).map(n => (
                          <div key={n.id} className={`p-3 rounded-xl border ${n.isRead ? 'bg-gray-50 border-gray-100' : 'bg-blue-50/50 border-blue-100'}`}>
                            <p className="text-[10px] font-black text-gray-900 leading-tight mb-1">{n.title}</p>
                            <p className="text-[9px] text-gray-500 font-medium truncate">{n.message}</p>
                          </div>
                        ))}
                        {notifications.length === 0 && <p className="text-center text-[10px] text-gray-400 py-4 italic">No new alerts</p>}
                      </div>
                      <Link href="/dashboard" className="block text-center mt-4 text-[10px] font-black text-blue-600 uppercase hover:underline">View All</Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-l pl-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900">{user.firstName}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{user.role}</p>
                  </div>
                  <button onClick={logout} className="text-gray-400 hover:text-red-600 transition-colors">
                    <FaSignOutAlt className="text-lg" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 font-medium text-sm px-4 py-2 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md active:scale-95">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
