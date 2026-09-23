'use client';

import { useEffect, useState } from 'react';

type StoredUser = {
  name?: string;
  full_name?: string;
  email?: string;
};

export default function Dashboard() {
  // user name intital 
  const [userName, setUserName] = useState('there');

  useEffect(() => {
  // store user data 
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      return;
    }

    try {
      const user: StoredUser = JSON.parse(storedUser);
      const name = user.name || user.full_name || user.email?.split('@')[0];

      if (name) {
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    } catch {
      // Keep the friendly fallback when stored user data is invalid.
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-5 py-8 text-slate-900 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Atlas</p>
            <h1 className="mt-1 text-xl font-bold text-slate-900">Dashboard</h1>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
            {userName.charAt(0).toUpperCase()}
          </div>
        </header>

        <section className="mt-12 rounded-3xl bg-slate-900/10 px-6 py-10 text-dark sm:px-10 sm:py-14">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-600">Your space is ready</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome back, {userName}.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-dark ">
            It&apos;s good to have you here. Keep an eye on your account and pick up where you left off.
          </p>
        </section>
      </div>
    </main>    
  )
}
