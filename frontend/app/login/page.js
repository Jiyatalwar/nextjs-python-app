'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  
  // Initialize App Router navigation
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg('Login successful!');
        
        // 1. Save authentication token and user info to localStorage
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
        }
        localStorage.setItem('user', JSON.stringify(data.user || { email }));

        // 2. Redirect to the dashboard
        router.push('/dashboard');
      } else {
        setMsg(data.detail || 'Login failed');
      }
    } catch {
      setMsg('Server Connection Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {msg && <p className="mb-4 text-center text-sm font-semibold text-blue-600">{msg}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded font-medium hover:bg-green-700">
            Log In
          </button>
        </form>
        <div className="mt-4 text-sm flex justify-between">
          <Link href="/forgot-password" className="text-orange-600 hover:underline">Forgot Password?</Link>
          <Link href="/signup" className="text-blue-600 hover:underline">Create Account</Link>
        </div>
      </div>
    </div>
  );
}