'use client';

import { useState, useMemo } from 'react';
import { Medicine, Settings } from '@/lib/types';
import Modal from './Modal';
import { Copy, Check, Calendar, Timer } from 'lucide-react';
import { addDays, format, differenceInDays } from 'date-fns';
import { clsx } from 'clsx';

import toast from 'react-hot-toast';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicines: Medicine[];
  settings: Settings;
}

export default function CreateOrderModal({ isOpen, onClose, medicines, settings }: CreateOrderModalProps) {
  const [targetMode, setTargetMode] = useState<'days' | 'date'>('days');
  const [targetDays, setTargetDays] = useState(settings.defaultOrderTargetDays.toString());
  const [targetDate, setTargetDate] = useState(format(addDays(new Date(), settings.defaultOrderTargetDays), 'yyyy-MM-dd'));
  const [copied, setCopied] = useState(false);

  const orderResult = useMemo(() => {
    let days = parseInt(targetDays);
    if (targetMode === 'date') {
      days = differenceInDays(new Date(targetDate), new Date());
    }
    if (isNaN(days) || days <= 0) return null;

    const items = medicines.map(med => {
      const daysLeft = Math.floor(med.currentPills / med.pillsPerDay);
      const daysToFill = days - daysLeft;
      
      if (daysToFill <= 0) return null;

      const pillsNeeded = daysToFill * med.pillsPerDay;
      const stripsNeeded = Math.ceil(pillsNeeded / med.pillsPerStrip);
      const estimatedCost = stripsNeeded * med.latestPricePerStrip;

      return {
        name: med.name,
        strength: med.strength,
        strips: stripsNeeded,
        pricePerStrip: med.latestPricePerStrip,
        total: estimatedCost
      };
    }).filter(item => item !== null) as any[];

    const totalCost = items.reduce((sum, item) => sum + item.total, 0);

    return { items, totalCost, targetDays: days };
  }, [medicines, targetMode, targetDays, targetDate]);

  const generateLineMessage = () => {
    if (!orderResult) return '';
    
    let msg = `รายการสั่งซื้อยา\n`;
    msg += `เป้าหมาย: ใช้พอ ${orderResult.targetDays} วัน\n\n`;
    
    orderResult.items.forEach(item => {
      msg += `ยา ${item.name} ${item.strength} ${item.strips} แผง ราคา ${item.pricePerStrip}x${item.strips} = ${item.total.toLocaleString()} บาท\n`;
    });
    
    msg += `\nรวมประมาณ ${orderResult.totalCost.toLocaleString()} บาท`;
    return msg;
  };

  const handleCopy = () => {
    const msg = generateLineMessage();
    navigator.clipboard.writeText(msg);
    toast.success('LINE message copied to clipboard!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Medicine Order">
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-bold text-emerald-700 uppercase ml-1">Order Target</label>
          <div className="flex bg-emerald-50 p-1 rounded-xl">
            <button
              onClick={() => setTargetMode('days')}
              className={clsx(
                "flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all",
                targetMode === 'days' ? "bg-white text-emerald-600 shadow-sm" : "text-emerald-400"
              )}
            >
              <Timer size={16} />
              <span>Days</span>
            </button>
            <button
              onClick={() => setTargetMode('date')}
              className={clsx(
                "flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all",
                targetMode === 'date' ? "bg-white text-emerald-600 shadow-sm" : "text-emerald-400"
              )}
            >
              <Calendar size={16} />
              <span>Date</span>
            </button>
          </div>

          {targetMode === 'days' ? (
            <div className="flex gap-2">
              {[30, 60, 90, 120].map(d => (
                <button
                  key={d}
                  onClick={() => setTargetDays(d.toString())}
                  className={clsx(
                    "flex-1 py-2 rounded-lg text-xs font-bold transition-all border",
                    targetDays === d.toString() ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-emerald-600 border-emerald-100"
                  )}
                >
                  {d}d
                </button>
              ))}
              <input
                type="number"
                value={targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
                className="w-16 px-2 py-2 rounded-lg border border-emerald-100 text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Custom"
              />
            </div>
          ) : (
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="input-field"
            />
          )}
        </div>

        <div className="card bg-emerald-950 p-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Copy size={80} />
          </div>
          <h3 className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Preview (Thai)</h3>
          <div className="text-sm font-medium whitespace-pre-wrap font-mono leading-relaxed">
            {generateLineMessage() || 'No items needed for this target.'}
          </div>
        </div>

        <button
          onClick={handleCopy}
          disabled={!orderResult || orderResult.items.length === 0}
          className={clsx(
            "btn-primary w-full flex items-center justify-center space-x-2 h-14",
            copied ? "bg-emerald-600" : ""
          )}
        >
          {copied ? (
            <>
              <Check size={20} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={20} />
              <span>Copy LINE Message</span>
            </>
          )}
        </button>

        {(!orderResult || orderResult.items.length === 0) && (
          <p className="text-center text-xs text-emerald-500 font-medium italic">
            Everything is well-stocked for this target!
          </p>
        )}
      </div>
    </Modal>
  );
}
