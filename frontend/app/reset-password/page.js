'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordForm() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setMsg(data.detail || 'Reset failed');
      }
    } catch (err) {
      setMsg('Server Connection Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        {msg && <p className="mb-4 text-center text-sm font-semibold text-blue-600">{msg}</p>}
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="text"
            placeholder="Reset Token"
            required
            className="w-full border p-2 rounded bg-gray-50"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter New Password"
            required
            className="w-full border p-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded font-medium hover:bg-green-700">
            Set New Password
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          <Link href="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}