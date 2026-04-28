'use client';

import { useState } from 'react';
import { Medicine } from '@/lib/types';
import Modal from './Modal';
import { ShoppingBag, Hash } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
  onUpdate: (updated: Medicine) => void;
}

export default function StockAdjustModal({ isOpen, onClose, medicine, onUpdate }: StockAdjustModalProps) {
  const [mode, setMode] = useState<'buy' | 'set'>('buy');
  const [stripsBought, setStripsBought] = useState('');
  const [pricePerStrip, setPricePerStrip] = useState('');
  const [actualStock, setActualStock] = useState('');
  const [loading, setLoading] = useState(false);

  if (!medicine) return null;

  const handleSave = async () => {
    if (!medicine) return;
    setLoading(true);
    const toastId = toast.loading('Updating stock...');

    let updatedMedicine = { ...medicine };

    if (mode === 'buy') {
      const strips = parseFloat(stripsBought);
      const price = parseFloat(pricePerStrip);
      if (isNaN(strips)) {
        toast.dismiss(toastId);
        setLoading(false);
        return;
      }
      
      updatedMedicine.currentPills += strips * medicine.pillsPerStrip;
      if (!isNaN(price)) {
        updatedMedicine.latestPricePerStrip = price;
      }
    } else {
      const actual = parseInt(actualStock);
      if (isNaN(actual)) {
        toast.dismiss(toastId);
        setLoading(false);
        return;
      }
      updatedMedicine.currentPills = actual;
    }

    updatedMedicine.lastUpdated = new Date().toISOString();

    try {
      const res = await fetch('/api/medicines', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMedicine),
      });
      if (res.ok) {
        toast.success('Stock updated successfully', { id: toastId });
        onUpdate(updatedMedicine);
        onClose();
        // Reset fields
        setStripsBought('');
        setPricePerStrip('');
        setActualStock('');
      } else {
        toast.error('Failed to update stock', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adjust Stock: ${medicine.name}`}>
      <div className="flex bg-emerald-50 p-1 rounded-xl mb-6">
        <button
          onClick={() => setMode('buy')}
          className={clsx(
            "flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all",
            mode === 'buy' ? "bg-white text-emerald-600 shadow-sm" : "text-emerald-400"
          )}
        >
          <ShoppingBag size={16} />
          <span>Buy More</span>
        </button>
        <button
          onClick={() => setMode('set')}
          className={clsx(
            "flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all",
            mode === 'set' ? "bg-white text-emerald-600 shadow-sm" : "text-emerald-400"
          )}
        >
          <Hash size={16} />
          <span>Set Actual</span>
        </button>
      </div>

      <div className="space-y-4">
        {mode === 'buy' ? (
          <>
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-700 uppercase ml-1">Strips Bought</label>
              <input
                type="number"
                inputMode="decimal"
                value={stripsBought}
                onChange={(e) => setStripsBought(e.target.value)}
                placeholder="e.g. 5"
                className="input-field"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-700 uppercase ml-1">Latest Price per Strip (฿)</label>
              <input
                type="number"
                inputMode="decimal"
                value={pricePerStrip}
                onChange={(e) => setPricePerStrip(e.target.value)}
                placeholder={medicine.latestPricePerStrip.toString()}
                className="input-field"
              />
            </div>
          </>
        ) : (
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-700 uppercase ml-1">Actual Pills Remaining</label>
            <input
              type="number"
              inputMode="numeric"
              value={actualStock}
              onChange={(e) => setActualStock(e.target.value)}
              placeholder={medicine.currentPills.toString()}
              className="input-field"
            />
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary w-full mt-4"
        >
          {loading ? 'Updating...' : 'Update Stock'}
        </button>
      </div>
    </Modal>
  );
}
