import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Privacy Policy | Kenya Barbers</title>
      </Head>

      <div className="bg-blue-600 py-20">
        <div className="layout-container text-center text-white">
          <h1 className="text-4xl md:text-5xl font-black mb-6">Privacy Policy</h1>
          <p className="text-blue-100 font-medium max-w-2xl mx-auto opacity-80 uppercase tracking-widest text-xs">
            Your data security is our top priority.
          </p>
        </div>
      </div>

      <div className="layout-container py-20">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-16">
            <section>
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Information Collection</h2>
              <p className="text-xl text-gray-900 font-bold leading-relaxed">
                We collect your name, phone number, and location to provide seamless booking experiences and to connect you with local professionals.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Data Usage</h2>
              <p className="text-xl text-gray-900 font-bold leading-relaxed">
                Your data is never sold to third parties. We use your information strictly for booking confirmations, reminders, and platform improvements.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-4">M-Pesa Integration</h2>
              <p className="text-xl text-gray-900 font-bold leading-relaxed">
                When you pay, we only receive the transaction confirmation from Safaricom. Your phone number is used solely to initiate the STK Push prompt.
              </p>
            </section>
          </div>

          <div className="mt-24 pt-12 border-t border-dashed">
            <p className="text-gray-400 text-sm italic">
              Developed and Secured by <span className="text-gray-900 font-bold">Litoh Graphics Studio</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
