'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Lock, User, Phone, CheckCircle, X } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { normalizeContact } from '@/lib/phone';

interface AuthPageProps {
  mode: 'login' | 'register';
}

export default function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const { login, register } = useAuthStore();
  const { showToast } = useUIStore();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const normalized = normalizeContact(phone);
    if (!normalized) {
      setFormError('Enter a valid Pakistani mobile number, e.g. 0300 1234567.');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(normalized, password);
        showToast('Successfully logged in! Welcome back to Green Decor.');
      } else {
        await register(name.trim(), normalized, password);
        showToast('Account created! Welcome to the Green Decor family.');
      }
      router.push('/account');
    } catch (err) {
      const fbError = err as { code?: string; message?: string; name?: string };
      const friendly =
        fbError.code === 'auth/invalid-credential' ||
        fbError.code === 'auth/invalid-login-credentials' ||
        fbError.code === 'auth/user-not-found' ||
        fbError.code === 'auth/wrong-password'
          ? 'Incorrect phone number or password. Please try again.'
          : fbError.code === 'auth/email-already-in-use'
          ? 'An account with that phone number already exists. Try signing in instead.'
          : fbError.code === 'auth/weak-password'
          ? 'Password should be at least 6 characters.'
          : fbError.code === 'auth/network-request-failed'
          ? 'Network error — check your connection and try again.'
          : fbError.name === 'InvalidPhoneError'
          ? 'Enter a valid Pakistani mobile number, e.g. 0300 1234567.'
          : fbError.message || 'Authentication failed. Please try again.';
      setFormError(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  const authForm = (
    <>
      <div className="flex gap-1 p-1 rounded-full bg-gray-100 mt-5">
        <Link
          href="/login"
          className={`flex-1 text-center py-2 rounded-full text-sm font-bold transition-all ${
            isLogin ? 'bg-[#0d3b2e] text-white shadow-sm' : 'text-gray-500 hover:text-[#0d3b2e]'
          }`}
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className={`flex-1 text-center py-2 rounded-full text-sm font-bold transition-all ${
            !isLogin ? 'bg-[#0d3b2e] text-white shadow-sm' : 'text-gray-500 hover:text-[#0d3b2e]'
          }`}
        >
          Register
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
        {formError && (
          <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
            <span className="mt-0.5 shrink-0">⚠</span>
            <span>{formError}</span>
          </div>
        )}

        {!isLogin && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="e.g. Hamza Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-full border border-gray-200 text-sm focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="+92 300 1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-full border border-gray-200 text-sm focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            {isLogin
              ? 'Use the same number you registered with.'
              : 'We use this to sign you in. No email needed.'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-11 py-3 rounded-full border border-gray-200 text-sm focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label="Toggle password visibility"
              className="absolute right-4 top-3 text-gray-400 hover:text-[#0d3b2e]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!isLogin && (
          <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
            <span>By creating an account you agree to our Terms & Privacy Policy. Your details stay private and are always encrypted.</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-full bg-[#0d3b2e] text-white text-sm font-bold hover:bg-[#145c43] transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      {isLogin ? (
        <p className="text-center text-xs text-gray-500 mt-5">
          New to Green Decor?{' '}
          <Link href="/register" className="text-[#0d3b2e] font-bold hover:underline">
            Create an account
          </Link>
        </p>
      ) : (
        <p className="text-center text-xs text-gray-500 mt-5">
          Already a member?{' '}
          <Link href="/login" className="text-[#0d3b2e] font-bold hover:underline">
            Sign in
          </Link>
        </p>
      )}
    </>
  );

  return (
    <div className="min-h-screen w-full bg-white lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex relative h-screen sticky top-0 overflow-hidden bg-white">
        <Image
          src="/logo.png"
          alt="Green Decor"
          fill
          priority
          sizes="50vw"
          className="object-contain"
        />
      </div>

      {/* Mobile: full-page image behind the bottom sheet */}
      <div className="lg:hidden relative min-h-[100dvh]">
        <Image
          src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1400&q=80"
          alt="Green Decor Plants"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0d3b2e]/50" />

        <div className="relative min-h-[100dvh] flex flex-col justify-end">
          <div className="relative bg-white rounded-t-3xl px-6 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] shadow-[0_-16px_48px_rgba(0,0,0,0.16)]">
            <div className="mx-auto w-10 h-1 rounded-full bg-gray-300" />
            <button
              type="button"
              onClick={() => router.push('/')}
              aria-label="Close"
              className="absolute top-4 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h1 className="mt-3 font-extrabold text-2xl text-[#0d3b2e] text-center">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-[13px] text-gray-500 mt-1 text-center">
              {isLogin
                ? 'Sign in to access your orders, saved addresses, and wishlist.'
                : 'Join Pakistan’s leading nature & indoor green community.'}
            </p>

            {authForm}
          </div>
        </div>
      </div>

      {/* Desktop column */}
      <div className="hidden lg:flex flex-col min-h-screen w-full px-5 sm:px-10 lg:px-16 py-8 lg:py-12 justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d3b2e]">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">
              {isLogin
                ? 'Sign in to access your orders, saved addresses, and wishlist.'
                : 'Join Pakistan’s leading nature & indoor green community.'}
            </p>
          </div>

          {authForm}
        </div>
      </div>
    </div>
  );
}