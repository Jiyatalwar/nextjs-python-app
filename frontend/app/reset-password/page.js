'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiRequest } from '../../lib/api';

function ResetPasswordForm() {
  // function for set token 
  const [token, setToken] = useState('');
  // function for new password 
  const [newPassword, setNewPassword] = useState('');
  // function for confrim password 
  const [confirmPassword, setConfirmPassword] = useState('');
  // funtion for show apassword set password 
  const [showPassword, setShowPassword] = useState(false);
  //  show password set 
  const [status, setStatus] = useState({ type: '', message: '' });
  // loading function
  const [loading, setLoading] = useState(false);
  //  params for search 
  const searchParams = useSearchParams();
  //router function
  const router = useRouter();
 // token function
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);
// reset handel
  const handleReset = async (e) => {
    e.preventDefault();

    if (!token.trim()) {
      setStatus({ type: 'error', message: 'A reset token is required.' });
      return;
    }
// new password 
    if (!newPassword || newPassword.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      await apiRequest('/api/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      setStatus({ type: 'success', message: 'Password updated successfully! Redirecting to login...' });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'We could not reset your password right now.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 p-4 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Security</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Choose a new password</h1>
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

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="reset-token" className="mb-1 block text-sm font-medium text-slate-700">
              Reset token
            </label>
            <input
              id="reset-token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="Paste your reset token"
            />
          </div>

          <div>
            <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-slate-700">
              New password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 pr-11 text-base outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                placeholder="Enter a new password"
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
            <p className="mt-1 text-xs text-slate-500">Use at least 8 characters.</p>
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-slate-700">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              placeholder="Re-enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            {loading ? 'Updating...' : 'Set new password'}
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

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-600">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
