'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, User, Phone, Leaf, CheckCircle, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useUIStore } from '@/lib/store/useUIStore';

interface AuthPageProps {
  mode: 'login' | 'register';
}

export default function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const { login, register, loginWithGoogle } = useAuthStore();
  const { showToast } = useUIStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    try {
      if (isLogin) {
        await login(email, password);
        showToast('Successfully logged in! Welcome back to Green Decor.');
      } else {
        await register(name, email, password, phone);
        showToast('Account created! Welcome to the Green Decor family.');
      }
      router.push('/account');
    } catch (err) {
      const fbError = err as { code?: string; message?: string };
      const friendly =
        fbError.code === 'auth/invalid-credential' || fbError.code === 'auth/invalid-login-credentials' || fbError.code === 'auth/user-not-found' || fbError.code === 'auth/wrong-password'
          ? 'Incorrect email or password. Please try again.'
          : fbError.code === 'auth/email-already-in-use'
          ? 'An account with that email already exists. Try signing in instead.'
          : fbError.code === 'auth/weak-password'
          ? 'Password should be at least 6 characters.'
          : fbError.code === 'auth/network-request-failed'
          ? 'Network error — check your connection and try again.'
          : fbError.message || 'Authentication failed. Please try again.';
      setFormError(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setFormError('');

    try {
      await loginWithGoogle();
      showToast('Signed in with Google!');
      router.push('/account');
    } catch (err) {
      const fbError = err as { code?: string; message?: string };
      if (fbError.code !== 'auth/popup-closed-by-user') {
        setFormError(fbError.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex relative h-screen sticky top-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1400&q=80"
          alt="Green Decor Plants"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#14402a]/50" />
        <div className="relative z-10 flex p-10 w-full items-start">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-white" />
            <span className="font-serif font-extrabold text-xl text-white tracking-tight">GREEN DECOR</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col min-h-screen w-full px-5 sm:px-10 lg:px-16 py-8 lg:py-12 justify-center">
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#14402a]">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
          </svg>
          <span className="font-serif font-extrabold text-xl text-[#14402a] tracking-tight">GREEN DECOR</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#14402a]">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-sm text-[#52685a] mt-1.5">
              {isLogin
                ? 'Sign in to access your orders, saved addresses, and wishlist.'
                : 'Join Pakistan’s leading nature & indoor green community.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#f4f7f2] border border-[#e5ece3] mb-7">
            <Link
              href="/login"
              className={`text-center py-2.5 rounded-xl text-sm font-bold transition-all ${
                isLogin ? 'bg-[#14402a] text-white shadow-sm' : 'text-[#52685a] hover:text-[#14402a]'
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={`text-center py-2.5 rounded-xl text-sm font-bold transition-all ${
                !isLogin ? 'bg-[#14402a] text-white shadow-sm' : 'text-[#52685a] hover:text-[#14402a]'
              }`}
            >
              Register
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{formError}</span>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#172b21] mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hamza Khan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-[#d6e2d3] text-sm focus:ring-2 focus:ring-[#14402a] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#172b21] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-[#d6e2d3] text-sm focus:ring-2 focus:ring-[#14402a] focus:outline-none"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#172b21] mb-1.5">Phone Number (Pakistan)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-[#d6e2d3] text-sm focus:ring-2 focus:ring-[#14402a] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#172b21]">Password</label>
                {isLogin && (
                  <a href="#forgot" className="text-xs text-[#14402a] hover:underline font-medium">
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#d6e2d3] text-sm focus:ring-2 focus:ring-[#14402a] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-[#14402a]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start gap-2 text-[11px] text-[#52685a] bg-[#f4f7f2] border border-[#e5ece3] rounded-xl px-3 py-2.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>By creating an account you agree to our Terms & Privacy Policy. Your details stay private and are always encrypted.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#14402a] text-white text-sm font-bold hover:bg-[#1b5539] transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[11px] text-[#52685a]">
            <span className="flex-1 h-px bg-[#e5ece3]" />
            or
            <span className="flex-1 h-px bg-[#e5ece3]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-white hover:bg-[#f4f7f2] text-[#172b21] text-sm font-semibold border border-[#d6e2d3] transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
              <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {isLogin ? (
            <p className="text-center text-xs text-[#52685a] mt-6">
              New to Green Decor?{' '}
              <Link href="/register" className="text-[#14402a] font-bold hover:underline">
                Create an account
              </Link>
            </p>
          ) : (
            <p className="text-center text-xs text-[#52685a] mt-6 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d47343]" />
              Already a member?{' '}
              <Link href="/login" className="text-[#14402a] font-bold hover:underline">
                Sign in
              </Link>
            </p>
          )}

          <div className="mt-8 text-center lg:hidden">
            <Link href="/" className="text-xs text-[#52685a] hover:text-[#14402a] font-medium">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}