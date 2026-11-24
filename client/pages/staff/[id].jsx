import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaCalendarCheck, FaClock, FaUser, FaPhone, FaArrowLeft, FaCut, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import dayjs from 'dayjs';

export default function StaffAppointmentsPage() {
  const router = useRouter();
  const { id: staffId } = router.query;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (staffId) fetchAppointments();
  }, [staffId]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments/staff/${staffId}`);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching staff appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  const upcomingApts = appointments.filter(a => dayjs(a.appointmentDate).isAfter(dayjs().subtract(1, 'day')));
  const pastApts = appointments.filter(a => dayjs(a.appointmentDate).isBefore(dayjs().subtract(1, 'day')));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-8 transition-colors">
          <FaArrowLeft /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black mb-2">Staff Schedule</h1>
              <p className="text-blue-100 font-medium">Viewing appointments for staff ID: {staffId}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <FaCalendarCheck size={40} />
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Upcoming Appointments
            </h2>

            <div className="space-y-4">
              {upcomingApts.length > 0 ? upcomingApts.map((apt) => (
                <div key={apt.id} className="border border-gray-100 rounded-3xl p-6 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-blue-600">
                      <span className="text-[10px] font-black uppercase tracking-widest">{dayjs(apt.appointmentDate).format('MMM')}</span>
                      <span className="text-xl font-black">{dayjs(apt.appointmentDate).format('DD')}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900">{apt.Service?.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                          <FaUser className="text-blue-500" /> {apt.User?.firstName} {apt.User?.lastName}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                          <FaClock className="text-blue-500" /> {dayjs(apt.startTime).format('hh:mm A')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <a href={`tel:${apt.User?.phoneNumber}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-50 text-green-600 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-green-100 transition-all">
                      <FaPhone /> Call Client
                    </a>
                    <div className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-50 text-gray-400 px-4 py-2.5 rounded-xl font-bold text-xs">
                      <FaCheckCircle /> {apt.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-400 italic">No upcoming appointments for this staff member.</div>
              )}
            </div>
          </div>
        </div>

        {pastApts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 px-4">Past Sessions</h2>
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {pastApts.map((apt) => (
                <div key={apt.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
                      <FaCut />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{apt.Service?.name}</p>
                      <p className="text-xs text-gray-500">{dayjs(apt.appointmentDate).format('MMM DD, YYYY')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{apt.User?.firstName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{apt.status}</p>
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
