import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { FaArrowRight, FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import AuthLayout from '../../components/AuthLayout';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, googleLogin } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error('Google authentication failed.');
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Sign in successful!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      image="/images/shop3.png"
      imageAlt="A welcoming barbershop in Kenya"
      title="Welcome back"
      description="Sign in to find your next appointment or manage your business."
      panelTitle={<>Your next<br />great look starts here.</>}
      panelDescription="Discover trusted barbers and salons, book a time that works for you, and get back to feeling your best."
      switchPrompt="New to Kenya Barbers?"
      switchLabel="Create an account"
      switchHref="/auth/register"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-bold text-slate-700">
            Email address
          </label>
          <div className="relative">
            <FaEnvelope className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="mb-2 block text-sm font-bold text-slate-700">
            Password
          </label>
          <div className="relative">
            <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
              Signing in...
            </>
          ) : (
            <>
              Sign in <FaArrowRight className="text-sm" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">or</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error('Google login failed')}
          theme="outline"
          size="large"
          width={280}
        />
      </div>

      <p className="mt-7 text-center text-sm text-slate-500">
        New here?{' '}
        <Link href="/auth/register" className="font-bold text-blue-700 transition hover:text-blue-800">
          Create your free account
        </Link>
      </p>
    </AuthLayout>
  );
}
