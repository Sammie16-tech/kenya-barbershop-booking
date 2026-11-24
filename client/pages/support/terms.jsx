import Head from 'next/head';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Terms of Service | Kenya Barbers</title>
      </Head>

      <div className="bg-gray-50 py-20 border-b">
        <div className="layout-container text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Last updated: May 5, 2026. Please read these terms carefully before using our platform.
          </p>
        </div>
      </div>

      <div className="layout-container py-20">
        <div className="max-w-3xl mx-auto prose prose-blue lg:prose-lg">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-widest">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using the Kenya Barbers platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-widest">2. Booking & Cancellations</h2>
            <p className="text-gray-600 leading-relaxed">
              Kenya Barbers acts as a facilitator between clients and barbershops. While we strive for accuracy, all booking confirmations and cancellations are subject to the specific shop's policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-widest">3. Payments</h2>
            <p className="text-gray-600 leading-relaxed">
              Payments are processed securely via M-Pesa. Kenya Barbers does not store your financial details. Subscriptions for shop owners are billed as per the selected plan.
            </p>
          </section>
          
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 mt-20">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Need clarification?</h3>
            <p className="text-blue-800/80 mb-4">Our legal team is happy to help with any questions regarding these terms.</p>
            <a href="mailto:legal@kenyabarbers.co.ke" className="text-blue-600 font-bold hover:underline">Contact Legal Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
