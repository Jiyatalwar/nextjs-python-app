'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    if (!password) {
      setStatus({ type: 'error', message: 'Please enter your password.' });
      return;
    }

    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();
      if (res.ok) {
        if (rememberMe && data.access_token) {
          localStorage.setItem('token', data.access_token);
        }
        localStorage.setItem('user', JSON.stringify(data.user || { email: trimmedEmail }));

        setStatus({ type: 'success', message: 'Login successful! Redirecting to your dashboard...' });
        setTimeout(() => router.push('/dashboard'), 600);
      } else {
        setStatus({ type: 'error', message: data.detail || 'Login failed. Please try again.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'We could not reach the server. Please try again in a moment.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 p-4 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Log in</h1>
        </div>

        {status.message && (
          <div
            aria-live="polite"
            className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
              status.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="you@example.com"
              aria-invalid={status.type === 'error' && !validateEmail(email.trim())}
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 pr-11 text-base outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-3 flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="font-medium text-orange-600 hover:text-orange-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          New here?{' '}
          <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
