import Head from 'next/head';
import { useState } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp, FaQuestionCircle } from 'react-icons/fa';

const faqs = [
  {
    category: "Bookings",
    questions: [
      {
        q: "How do I book an appointment?",
        a: "Find a shop on the homepage, select your preferred service and staff member, pick a date and time, and click 'Confirm Booking'. You'll receive a confirmation on your dashboard."
      },
      {
        q: "Can I cancel my booking?",
        a: "Yes, you can cancel your booking from your Client Dashboard. Please note that individual shops may have their own cancellation policies regarding refunds."
      },
      {
        q: "What happens if I'm late?",
        a: "We recommend arriving 5-10 minutes early. If you're more than 15 minutes late, the shop may mark your appointment as a 'No Show' to accommodate other clients."
      }
    ]
  },
  {
    category: "Payments",
    questions: [
      {
        q: "How do I pay for my service?",
        a: "Most shops support M-Pesa. When you book, you'll receive an STK Push prompt on your phone to complete the payment securely."
      },
      {
        q: "Is it safe to pay through the platform?",
        a: "Absolutely. We use Safaricom's official M-Pesa API. We never store your PIN or sensitive financial data."
      }
    ]
  },
  {
    category: "For Shop Owners",
    questions: [
      {
        q: "How do I list my shop?",
        a: "Click 'List Your Shop' in the footer or navigation, create an account, and follow the 3-step setup process to add your services, staff, and pricing."
      },
      {
        q: "How much does it cost?",
        a: "We offer flexible monthly and yearly subscription plans. You can view the full pricing breakdown on the Partner Registration page."
      }
    ]
  }
];

export default function HelpCenter() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Help Center | Kenya Barbers</title>
      </Head>

      {/* Hero Search */}
      <div className="bg-gray-900 py-24">
        <div className="layout-container text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-8">How can we <span className="text-blue-500">help?</span></h1>
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400">
              <FaSearch />
            </div>
            <input 
              type="text"
              placeholder="Search for answers (e.g. 'M-Pesa', 'Refunds')"
              className="w-full bg-white/10 border border-white/20 rounded-[2rem] py-6 pl-14 pr-8 text-white placeholder:text-gray-500 outline-none focus:bg-white/20 transition-all font-medium text-lg shadow-2xl backdrop-blur-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="layout-container py-24">
        <div className="max-w-4xl mx-auto">
          {faqs.map((category, catIdx) => (
            <div key={catIdx} className="mb-16 last:mb-0">
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <FaQuestionCircle /> {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions
                  .filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
                  .map((faq, faqIdx) => {
                    const uniqueIdx = `${catIdx}-${faqIdx}`;
                    const isOpen = openIndex === uniqueIdx;
                    return (
                      <div 
                        key={faqIdx} 
                        className={`border rounded-3xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 hover:border-gray-200 bg-white shadow-sm'}`}
                      >
                        <button 
                          onClick={() => toggleFAQ(uniqueIdx)}
                          className="w-full p-6 text-left flex justify-between items-center group"
                        >
                          <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'}`}>
                            {faq.q}
                          </span>
                          {isOpen ? <FaChevronUp className="text-blue-600" /> : <FaChevronDown className="text-gray-400" />}
                        </button>
                        <div className={`px-6 pb-6 text-gray-600 leading-relaxed font-medium transition-all ${isOpen ? 'block' : 'hidden'}`}>
                          {faq.a}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Still Need Help? */}
      <div className="bg-gray-50 py-20 border-t border-dashed">
        <div className="layout-container text-center">
          <h3 className="text-2xl font-black text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-gray-500 font-medium mb-10">Our support team at Litoh Graphics Studio is available 24/7.</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button className="bg-blue-600 text-white px-10 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl">
              Live Chat
            </button>
            <button className="bg-white text-gray-900 border border-gray-200 px-10 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
              Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
