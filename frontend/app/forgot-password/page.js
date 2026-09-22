'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleReset = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      const data = await apiRequest('/api/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: trimmedEmail }),
      });

      setStatus({ type: 'success', message: 'A reset token was created. Redirecting to the reset page...' });
      setTimeout(() => {
        router.push(`/reset-password?token=${data.token}`);
      }, 1200);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'We could not send a reset request right now.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 p-4 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Need help?</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Reset password</h1>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          Enter the email address tied to your account and we will help you create a new password.
        </p>

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

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="mb-1 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
