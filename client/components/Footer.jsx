import Link from 'next/link';
import { FaCut, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="layout-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <img src="https://www.image2url.com/r2/default/images/1777987005192-2959afc3-e5cb-4a3d-b4ea-671b8b856bf6.png" alt="Kenya Barbers Logo" className="h-16 w-auto brightness-0 invert opacity-90" />
            </Link>
            <p className="text-gray-400 font-medium leading-relaxed">
              Kenya's premium booking platform for top-rated barbers and salons. Look your best, without the wait.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Discover</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Find a Barber</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Explore Salons</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Popular Services</Link></li>
              <li><Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Special Offers</Link></li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="text-lg font-bold mb-6">For Business</h4>
            <ul className="space-y-4">
              <li><Link href="/auth/register" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">List Your Shop</Link></li>
              <li><Link href="/admin/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Partner Dashboard</Link></li>
              <li><Link href="/business/pricing" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Pricing</Link></li>
              <li><Link href="/business/success-stories" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Success Stories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/support/help" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Help Center</Link></li>
              <li><Link href="/support/terms" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Terms of Service</Link></li>
              <li><Link href="/support/privacy" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Privacy Policy</Link></li>
              <li><Link href="/support/contact" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-gray-500 text-sm font-medium">
              © {new Date().getFullYear()} Kenya Barbers. All rights reserved.
            </p>
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
              Powered by <a href="https://litohtechnologies.co.ke" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-400">Litoh Technologies</a>
            </p>
          </div>
          <div className="flex gap-6">
            <span className="text-gray-500 text-sm font-bold">Nairobi</span>
            <span className="text-gray-500 text-sm font-bold">Mombasa</span>
            <span className="text-gray-500 text-sm font-bold">Kisumu</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
