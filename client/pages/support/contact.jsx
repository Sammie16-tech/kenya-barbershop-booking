import Head from 'next/head';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Contact Us | Kenya Barbers</title>
      </Head>

      <div className="relative py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50 -skew-x-12 transform origin-right"></div>
        
        <div className="layout-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h1 className="text-6xl font-black text-gray-900 leading-tight mb-8">
                Let's <span className="text-blue-600">Connect.</span>
              </h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12">
                Have questions about our platform or need help with a booking? Our team at Litoh Graphics Studio is here to support you.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <FaPhone />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call Us</p>
                    <p className="text-xl font-bold text-gray-900">+254 700 000 000</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-3xl bg-green-50 flex items-center justify-center text-green-600 text-2xl group-hover:bg-green-600 group-hover:text-white transition-all">
                    <FaWhatsapp />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp</p>
                    <p className="text-xl font-bold text-gray-900">Chat with Support</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center text-red-600 text-2xl group-hover:bg-red-600 group-hover:text-white transition-all">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Us</p>
                    <p className="text-xl font-bold text-gray-900">support@kenyabarbers.co.ke</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-12">
              <h3 className="text-2xl font-black text-gray-900 mb-8">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                    <input className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                    <input className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600" placeholder="07..." />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Subject</label>
                  <select className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600">
                    <option>General Inquiry</option>
                    <option>Booking Issue</option>
                    <option>Business Partnership</option>
                    <option>Technical Support</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Message</label>
                  <textarea rows="4" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600" placeholder="How can we help?"></textarea>
                </div>
                <button className="w-full btn-primary py-5 rounded-[2rem] text-sm uppercase tracking-widest font-black">
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
