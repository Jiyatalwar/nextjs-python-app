'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setMsg('Token generated! Redirecting to reset page...');
        setTimeout(() => {
          router.push(`/reset-password?token=${data.token}`);
        }, 1200);
      } else {
        setMsg(data.detail || 'Failed to generate token');
        setLoading(false);
      }
    } catch (err) {
      setMsg('Server Connection Error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        {msg && <p className="mb-4 text-center text-sm font-semibold text-orange-600">{msg}</p>}
        <form onSubmit={handleReset} className="space-y-4">
          <input 
            type="email" 
            placeholder="Registered Email" 
            required 
            className="w-full border p-2 rounded" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700 font-medium disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Get Reset Token'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          <Link href="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}