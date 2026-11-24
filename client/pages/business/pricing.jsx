import { FaCheckCircle, FaRocket, FaStore, FaChartLine } from 'react-icons/fa';

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 'KES 200',
      period: '/month',
      desc: 'Perfect for individual barbers.',
      features: ['Up to 1 Staff Member', 'Online Bookings', 'Basic Analytics', 'Mobile App Access'],
      color: 'gray',
      btnText: 'Get Started'
    },
    {
      name: 'Pro',
      price: 'KES 300',
      period: '/month',
      desc: 'Best for established shops.',
      features: ['Unlimited Staff', 'M-Pesa Integration', 'Automated SMS Reminders', 'Advanced Revenue Insights', 'Priority Support'],
      color: 'blue',
      btnText: 'Go Pro',
      featured: true
    },
    {
      name: 'Elite',
      price: 'KES 500',
      period: '/month',
      desc: 'For premium salon chains.',
      features: ['Everything in Pro', 'Featured Search Listing', 'Custom Branding', 'Multi-location Support', 'Dedicated Account Manager'],
      color: 'indigo',
      btnText: 'Contact Sales'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="pt-32 pb-24">
        <div className="layout-container text-center mb-16">
          <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Pricing Plans</span>
          <h1 className="text-5xl font-black text-gray-900 mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Choose the plan that fits your business needs. Scale up as you grow with Kenya's #1 barbershop platform.
          </p>
        </div>

        <div className="layout-container grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-[2.5rem] p-10 shadow-xl border-2 transition-all hover:-translate-y-2 ${
                plan.featured ? 'border-blue-600 scale-105' : 'border-transparent'
              }`}
            >
              {plan.featured && (
                <div className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full w-max mx-auto mb-8 shadow-lg shadow-blue-600/30">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm font-medium mb-8">{plan.desc}</p>
              <div className="mb-10">
                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                <span className="text-gray-400 font-bold ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-4 mb-12">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                plan.featured 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700' 
                : 'bg-gray-900 text-white hover:bg-black'
              }`}>
                {plan.btnText}
              </button>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}

