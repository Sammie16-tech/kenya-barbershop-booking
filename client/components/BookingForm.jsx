import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

export default function BookingForm({ shop, services, staff }) {
  const [selectedService, setSelectedService] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Format price to KES
  const formatKES = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const fetchAvailableSlots = async () => {
    if (!selectedService || !selectedStaff || !selectedDate) return;

    try {
      setLoading(true);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/available-slots`,
        {
          params: {
            shopId: shop.id,
            serviceId: selectedService,
            staffId: selectedStaff,
            date: formattedDate
          }
        }
      );
      
      setAvailableSlots(response.data.availableSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedService, selectedStaff, selectedDate]);

  const handleBooking = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        {
          shopId: shop.id,
          serviceId: selectedService,
          staffId: selectedStaff,
          appointmentDate: selectedDate.toISOString().split('T')[0],
          startTime: selectedTime
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast.success('Appointment booked successfully!');
      // Reset form or redirect
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>
      
      {/* Progress Steps */}
      <div className="flex mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1">
            <div className={`h-2 rounded-full ${
              s <= step ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
            <p className="text-sm mt-2 text-center">
              {s === 1 && 'Service'}
              {s === 2 && 'Staff'}
              {s === 3 && 'Date & Time'}
              {s === 4 && 'Confirm'}
            </p>
          </div>
        ))}
      </div>

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => {
                  setSelectedService(service.id);
                  setStep(2);
                }}
                className={`p-4 border rounded-lg text-left hover:border-blue-600 transition-colors ${
                  selectedService === service.id 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <h4 className="font-semibold">{service.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {service.duration} mins
                </p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  {formatKES(service.price)}
                </p>
                {service.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {service.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Staff */}
      {step === 2 && (
        <div>
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Back
            </button>
            <h3 className="text-lg font-semibold">Select Barber/Stylist</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staff.map(member => (
              <button
                key={member.id}
                onClick={() => {
                  setSelectedStaff(member.id);
                  setStep(3);
                }}
                className={`p-4 border rounded-lg text-left hover:border-blue-600 transition-colors ${
                  selectedStaff === member.id 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {member.firstName} {member.lastName}
                    </h4>
                    {member.specialization && (
                      <p className="text-sm text-gray-600">
                        {member.specialization}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Select Date & Time */}
      {step === 3 && (
        <div>
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setStep(2)}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Back
            </button>
            <h3 className="text-lg font-semibold">Select Date & Time</h3>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Date
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date()}
              className="w-full p-2 border border-gray-300 rounded-md"
              dateFormat="dd/MM/yyyy"
              placeholderText="Select a date"
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Available Time Slots
              </label>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedTime(slot);
                        setStep(4);
                      }}
                      className={`p-2 rounded border text-center hover:border-blue-600 transition-colors ${
                        selectedTime === slot
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No available slots for this date
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Confirm Booking */}
      {step === 4 && (
        <div>
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setStep(3)}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Back
            </button>
            <h3 className="text-lg font-semibold">Confirm Booking</h3>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold mb-4">Booking Summary</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">
                  {services.find(s => s.id === selectedService)?.name}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Barber/Stylist:</span>
                <span className="font-medium">
                  {staff.find(s => s.id === selectedStaff)?.firstName}{' '}
                  {staff.find(s => s.id === selectedStaff)?.lastName}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {selectedDate?.toLocaleDateString('en-KE')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {services.find(s => s.id === selectedService)?.duration} mins
                </span>
              </div>
              
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total Price:</span>
                <span className="font-bold text-blue-600 text-lg">
                  {formatKES(
                    services.find(s => s.id === selectedService)?.price || 0
                  )}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </span>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      )}
    </div>
  );
}