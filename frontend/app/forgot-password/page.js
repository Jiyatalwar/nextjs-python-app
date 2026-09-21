'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../lib/api';

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
      const data = await apiRequest('/api/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      setMsg('Token generated! Redirecting to reset page...');
      setTimeout(() => {
        router.push(`/reset-password?token=${data.token}`);
      }, 1200);
    } catch (err) {
      setMsg('Server Connection Error');
      setLoading(false);
    }
  };

  return (
    // main  div for  layout 
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
    // link router  started here
  
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
          // ganrete token for get user details who visited 
              
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
