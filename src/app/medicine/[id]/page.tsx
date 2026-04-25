'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Medicine } from '@/lib/types';
import { ArrowLeft, Trash2, Save } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ConfirmModal';

export default function MedicineFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isEdit = id && id !== 'new';

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: '',
    strength: '',
    pillsPerDay: 1,
    pillsPerStrip: 10,
    latestPricePerStrip: 0,
    currentPills: 0,
  });

  useEffect(() => {
    if (isEdit) {
      fetch('/api/medicines')
        .then(res => res.json())
        .then((data: Medicine[]) => {
          const med = data.find(m => m.id === id);
          if (med) setFormData(med);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Saving medicine...');

    const payload = {
      ...formData,
      id: isEdit ? id : `med_${Date.now()}`,
    };

    try {
      const res = await fetch('/api/medicines', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Medicine saved successfully', { id: toastId });
        router.push('/');
        router.refresh();
      } else {
        toast.error('Failed to save medicine', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    setSaving(true);
    const toastId = toast.loading('Deleting medicine...');
    try {
      const res = await fetch('/api/medicines', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success('Medicine deleted successfully', { id: toastId });
        router.push('/');
        router.refresh();
      } else {
        toast.error('Failed to delete medicine', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred', { id: toastId });
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-emerald-500 font-bold">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="p-2 bg-white text-emerald-600 rounded-full shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-emerald-900">{isEdit ? 'Edit Medicine' : 'Add Medicine'}</h1>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-700 uppercase ml-1">Medicine Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Medicine A"
              className="input-field"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-700 uppercase ml-1">Strength <span className="text-emerald-400 normal-case">(optional)</span></label>
            <input
              type="text"
              value={formData.strength}
              onChange={e => setFormData({ ...formData, strength: e.target.value })}
              placeholder="e.g. 10mg"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-700 uppercase ml-1">Pills per Day</label>
              <input
                type="number"
                required
                min="0.1"
                step="0.1"
                value={formData.pillsPerDay}
                onChange={e => setFormData({ ...formData, pillsPerDay: parseFloat(e.target.value) })}
                className="input-field"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-700 uppercase ml-1">Pills per Strip</label>
              <input
                type="number"
                required
                min="1"
                value={formData.pillsPerStrip}
                onChange={e => setFormData({ ...formData, pillsPerStrip: parseInt(e.target.value) })}
                className="input-field"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-700 uppercase ml-1">Latest Price per Strip (฿)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.latestPricePerStrip}
              onChange={e => setFormData({ ...formData, latestPricePerStrip: parseFloat(e.target.value) })}
              className="input-field"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-700 uppercase ml-1">Current Pills in Stock</label>
            <input
              type="number"
              required
              min="0"
              value={formData.currentPills}
              onChange={e => setFormData({ ...formData, currentPills: parseInt(e.target.value) })}
              className="input-field"
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center space-x-2 h-14"
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : 'Save Medicine'}</span>
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={saving}
              className="w-full py-4 text-red-500 font-bold flex items-center justify-center space-x-2 active:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 size={20} />
              <span>Delete Medicine</span>
            </button>
          )}
        </div>
      </form>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete Medicine"
        message="Are you sure you want to delete this medicine? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
