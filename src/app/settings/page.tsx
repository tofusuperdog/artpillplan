'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings } from '@/lib/types';
import { LogOut, Save, Shield, Clock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ConfirmModal';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    const toastId = toast.loading('Saving settings...');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success('Settings saved successfully', { id: toastId });
      } else {
        toast.error('Failed to save settings', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const executeLogout = async () => {
    const toastId = toast.loading('Logging out...');
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Logged out successfully', { id: toastId });
    router.push('/login');
    router.refresh();
  };

  if (loading || !settings) return <div className="p-6 text-center text-emerald-500 font-bold">Loading...</div>;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-emerald-900 leading-tight">Settings</h2>
        <p className="text-emerald-600 text-sm font-medium">Configure your app preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-emerald-800">
              <AlertTriangle size={18} />
              <h3 className="font-bold uppercase tracking-wider text-xs">Thresholds</h3>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-700 uppercase ml-1 flex items-center gap-1">
                Low Stock Warning (Days)
              </label>
              <input
                type="number"
                value={settings.lowStockThresholdDays}
                onChange={e => setSettings({ ...settings, lowStockThresholdDays: parseInt(e.target.value) })}
                className="input-field"
              />
              <p className="text-[10px] text-emerald-400 font-medium ml-1">Notify me when I have less than these days of medicine.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-emerald-800">
              <Clock size={18} />
              <h3 className="font-bold uppercase tracking-wider text-xs">Ordering</h3>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-700 uppercase ml-1">Default Order Target (Days)</label>
              <input
                type="number"
                value={settings.defaultOrderTargetDays}
                onChange={e => setSettings({ ...settings, defaultOrderTargetDays: parseInt(e.target.value) })}
                className="input-field"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-emerald-50">
            <div className="flex items-center space-x-3 text-emerald-800">
              <Shield size={18} />
              <h3 className="font-bold uppercase tracking-wider text-xs">Security</h3>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-700 uppercase ml-1">PIN Code</label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  value={settings.pin}
                  onChange={e => setSettings({ ...settings, pin: e.target.value })}
                  className="input-field tracking-[0.5em] font-bold pr-12"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-emerald-400 hover:text-emerald-600 transition-colors"
                >
                  {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center space-x-2 h-14 shadow-emerald-100"
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full py-4 text-emerald-400 font-bold flex items-center justify-center space-x-2 active:bg-emerald-100 rounded-xl transition-colors mt-4"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={executeLogout}
        title="Logout"
        message="Are you sure you want to logout from your device?"
        confirmText="Logout"
        isDestructive={false}
      />
    </div>
  );
}
