import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import {
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaPhone,
  FaStore,
  FaTag,
  FaUser
} from 'react-icons/fa';
import AuthLayout from '../../components/AuthLayout';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    referralCode: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, googleLogin } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      toast.success('Welcome to Kenya Barbers!');
    } catch (error) {
      toast.error('Google authentication failed.');
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const sanitizedData = {
        ...formData,
        phoneNumber: formData.phoneNumber.replace(/[\s-]/g, '')
      };
      await register(sanitizedData);
      toast.success('Account created successfully!');
      if (formData.role === 'shop_owner') {
        router.push('/admin/setup');
      } else {
        router.push('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      image="/images/shop2.png"
      imageAlt="A bright, modern salon in Kenya"
      title="Create your account"
      description="Book your next visit or bring your grooming business online."
      panelTitle={<>Good style.<br />Great connections.</>}
      panelDescription="Join a community that makes it easier to find the right professional, book with confidence, and keep your business growing."
      switchPrompt="Already have an account?"
      switchLabel="Sign in"
      switchHref="/auth/login"
      panelClassName="max-w-xl"
      contentClassName="items-start"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset>
          <legend className="mb-2 block text-sm font-bold text-slate-700">Choose how you&apos;ll use Kenya Barbers</legend>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={formData.role === 'client'}
              onClick={() => setFormData({ ...formData, role: 'client' })}
              className={`rounded-xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                formData.role === 'client'
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${
                formData.role === 'client' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                <FaUser aria-hidden="true" />
              </span>
              <span className="block text-sm font-extrabold text-slate-900">Book a service</span>
              <span className="mt-1 block text-xs text-slate-500">I&apos;m a client</span>
            </button>
            <button
              type="button"
              aria-pressed={formData.role === 'shop_owner'}
              onClick={() => setFormData({ ...formData, role: 'shop_owner' })}
              className={`rounded-xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                formData.role === 'shop_owner'
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${
                formData.role === 'shop_owner' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                <FaStore aria-hidden="true" />
              </span>
              <span className="block text-sm font-extrabold text-slate-900">Grow my business</span>
              <span className="mt-1 block text-xs text-slate-500">I&apos;m a shop owner</span>
            </button>
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="register-first-name" className="mb-2 block text-sm font-bold text-slate-700">First name</label>
            <div className="relative">
              <FaUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="register-first-name"
                name="firstName"
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
          <div>
            <label htmlFor="register-last-name" className="mb-2 block text-sm font-bold text-slate-700">Last name</label>
            <div className="relative">
              <FaUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="register-last-name"
                name="lastName"
                autoComplete="family-name"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-bold text-slate-700">Email address</label>
            <div className="relative">
              <FaEnvelope className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="register-email"
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
            <label htmlFor="register-phone" className="mb-2 block text-sm font-bold text-slate-700">Phone number</label>
            <div className="relative">
              <FaPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="register-phone"
                type="tel"
                name="phoneNumber"
                autoComplete="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="07XX XXX XXX"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-bold text-slate-700">Password</label>
            <div className="relative">
              <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="register-password"
                type={showPasswords ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {showPasswords ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="register-confirm-password" className="mb-2 block text-sm font-bold text-slate-700">Confirm password</label>
            <div className="relative">
              <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="register-confirm-password"
                type={showPasswords ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter it again"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="register-referral" className="mb-2 block text-sm font-bold text-slate-700">
            Referral code <span className="font-medium text-slate-400">(optional)</span>
          </label>
          <div className="relative">
            <FaTag className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="register-referral"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              placeholder="Enter a referral code"
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
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
              Creating your account...
            </>
          ) : (
            <>
              Create account <FaArrowRight className="text-sm" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">or sign up with</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error('Google registration failed')}
          theme="outline"
          size="large"
          width={280}
        />
      </div>

      <p className="mt-6 text-center text-xs leading-5 text-slate-400">
        By creating an account, you agree to our{' '}
        <Link href="/support/terms" className="font-semibold text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-blue-700">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/support/privacy" className="font-semibold text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-blue-700">
          Privacy Policy
        </Link>.
      </p>
    </AuthLayout>
  );
}
