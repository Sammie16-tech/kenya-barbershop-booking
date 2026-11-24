import { FaQuoteLeft, FaStar, FaStore } from 'react-icons/fa';

export default function SuccessStories() {
  const stories = [
    {
      name: "Classic Cuts Lounge",
      owner: "Samuel Omari",
      city: "Nairobi",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
      quote: "Kenya Barbers transformed how we manage bookings. Our 'no-shows' dropped by 80% thanks to the automated SMS reminders.",
      growth: "+150% Bookings",
      featured: true
    },
    {
      name: "The Gents Parlour",
      owner: "David Kiptoo",
      city: "Eldoret",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
      quote: "The dashboard insights helped us identify our most productive hours. We've since added two more staff members to keep up with demand.",
      growth: "+40% Revenue"
    },
    {
      name: "Elite Grooming Studio",
      owner: "Grace Wanjiru",
      city: "Mombasa",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
      quote: "M-Pesa integration makes payments seamless for my clients. They love the professionalism of the instant PDF receipts.",
      growth: "99% Client Satisfaction"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      <main className="pt-32 pb-24">
        <div className="layout-container mb-20 text-center">
          <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Success Stories</span>
          <h1 className="text-6xl font-black text-gray-900 mb-8 tracking-tight">Real Growth, <br />Real Partners.</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Join thousands of shop owners across Kenya who are scaling their businesses with our platform.
          </p>
        </div>

        <div className="layout-container grid grid-cols-1 gap-20">
          {stories.map((story, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 group`}>
              <div className="flex-1 relative overflow-hidden rounded-[3rem] h-[450px] shadow-2xl">
                <img src={story.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={story.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                   <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-[10px] font-black px-2 py-0.5 rounded uppercase">{story.growth}</span>
                   </div>
                   <h3 className="text-3xl font-black">{story.name}</h3>
                   <p className="text-gray-300 font-bold text-sm uppercase tracking-widest mt-1">{story.city}</p>
                </div>
              </div>
              <div className="flex-1 space-y-8">
                <FaQuoteLeft className="text-blue-600 text-6xl opacity-20" />
                <p className="text-3xl font-black text-gray-900 leading-tight italic">
                  "{story.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-blue-600">
                    <FaStore />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{story.owner}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Shop Owner</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="layout-container mt-32">
          <div className="bg-gray-900 rounded-[3rem] p-16 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6">Ready to write your own success story?</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto font-medium">
                Join the network today and take your barbershop or salon to the next level.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-600/20 transition-all">
                  Register My Shop
                </a>
                <a href="/business/pricing" className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all">
                  View Pricing
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

