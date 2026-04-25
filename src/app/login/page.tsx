'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pill } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        toast.success('Welcome back!');
        router.push('/');
        router.refresh();
      } else {
        toast.error('Invalid PIN code');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-emerald-50">
      <div className="w-full max-w-sm flex flex-col items-center space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Pill className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 tracking-tight text-center">
            ArtPillPlan
          </h1>
          <p className="text-emerald-600 font-medium">Medicine Stock Planner</p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-2">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="input-field text-center tracking-[1em] font-bold"
              maxLength={6}
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg h-14"
          >
            {loading ? 'Unlocking...' : 'Unlock'}
          </button>
        </form>

        <p className="text-emerald-400 text-xs mt-12">
          &copy; 2026 ArtPillPlan. All rights reserved.
        </p>
      </div>
    </div>
  );
}
