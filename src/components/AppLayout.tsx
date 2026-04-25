'use client';

import Link from 'next/link';
import { Pill, Settings, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

import { Toaster } from 'react-hot-toast';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') return (
    <>
      <Toaster position="top-center" toastOptions={{ className: 'text-sm font-bold', style: { borderRadius: '16px', background: '#fff', color: '#064e3b' } }} />
      {children}
    </>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-emerald-50 flex flex-col">
      <Toaster position="top-center" toastOptions={{ className: 'text-sm font-bold', style: { borderRadius: '16px', background: '#fff', color: '#064e3b' } }} />
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Pill className="text-emerald-500 w-6 h-6" />
          <h1 className="text-xl font-bold text-emerald-900">ArtPillPlan</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-emerald-100 flex justify-around items-center py-3 px-6 pb-safe shadow-[0_-4px_20px_rgba(16,185,129,0.05)]">
        <Link 
          href="/" 
          className={clsx(
            "flex flex-col items-center space-y-1 transition-colors",
            pathname === '/' ? "text-emerald-600" : "text-emerald-300 hover:text-emerald-400"
          )}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold">DASHBOARD</span>
        </Link>
        
        <Link 
          href="/settings" 
          className={clsx(
            "flex flex-col items-center space-y-1 transition-colors",
            pathname === '/settings' ? "text-emerald-600" : "text-emerald-300 hover:text-emerald-400"
          )}
        >
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-bold">SETTINGS</span>
        </Link>
      </nav>
    </div>
  );
}
