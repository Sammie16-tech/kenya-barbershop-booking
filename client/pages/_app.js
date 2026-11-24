import { GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAuthPage = router.pathname === '/auth/login' || router.pathname === '/auth/register';
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {!isAuthPage && <Navbar />}
          <main className="flex-grow">
            <Component {...pageProps} />
          </main>
          {!isAuthPage && <Footer />}
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default MyApp;