import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaClock, FaTag, FaCheckCircle, FaTimesCircle, FaSpinner, FaMapMarkerAlt } from 'react-icons/fa';
import dayjs from 'dayjs';

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments`);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12">
      <div className="layout-container">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-500 font-medium">Keep track of your grooming schedule</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : appointments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 hover-lift">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex flex-col items-center justify-center text-blue-600">
                    <span className="text-xs font-black uppercase tracking-widest">{dayjs(apt.appointmentDate).format('MMM')}</span>
                    <span className="text-2xl font-black">{dayjs(apt.appointmentDate).format('DD')}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{apt.Service?.name}</h3>
                    <p className="text-gray-500 font-bold flex items-center gap-2 text-sm mt-1">
                      <FaMapMarkerAlt className="text-blue-500" /> {apt.Shop?.name}
                    </p>
                    <div className="flex gap-4 mt-3">
                      <span className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <FaClock /> {dayjs(apt.startTime).format('hh:mm A')}
                      </span>
                      <span className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <FaTag /> KES {apt.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0">
                  <div className="flex-grow md:text-right">
                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs ${
                      apt.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                      apt.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {apt.status === 'confirmed' ? <FaCheckCircle /> : apt.status === 'pending' ? <FaSpinner className="animate-spin" /> : <FaTimesCircle />}
                      {apt.status.toUpperCase()}
                    </div>
                  </div>
                  <button className="btn-secondary py-3 px-6 text-sm">View Receipt</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <FaCalendarAlt className="text-6xl text-gray-200 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-900 mb-2">No bookings yet</h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto font-medium">Ready for a fresh look? Discover top barbers and book your first session.</p>
            <button onClick={() => router.push('/')} className="btn-primary">Find a Barber</button>
          </div>
        )}
      </div>
    </div>
  );
}
