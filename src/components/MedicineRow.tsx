'use client';

import { Medicine } from '@/lib/types';
import { Edit2, Package, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { clsx } from 'clsx';

interface MedicineRowProps {
  medicine: Medicine;
  lowStockThresholdDays: number;
  onEdit: (medicine: Medicine) => void;
  onStock: (medicine: Medicine) => void;
}

export default function MedicineRow({ medicine, lowStockThresholdDays, onEdit, onStock }: MedicineRowProps) {
  const daysLeft = Math.floor(medicine.currentPills / medicine.pillsPerDay);
  const lastUsableDate = addDays(new Date(), daysLeft);
  const approxStrips = (medicine.currentPills / medicine.pillsPerStrip).toFixed(1);
  const isLowStock = daysLeft < lowStockThresholdDays;

  return (
    <div className={clsx(
      "p-4 mb-3 card transition-all active:scale-[0.98]",
      isLowStock ? "border-l-4 border-l-red-400 bg-red-50/30" : "border-l-4 border-l-emerald-400"
    )}>
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="font-bold text-emerald-950 text-base leading-tight">
          {medicine.name}{medicine.strength ? <span className="text-emerald-500 font-semibold ml-1.5 text-sm">{medicine.strength}</span> : null}
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(medicine)}
            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onStock(medicine)}
            className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
          >
            <Package size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-emerald-700">
        <span className="flex items-center gap-1">
          <span className="text-emerald-900 font-bold">{medicine.currentPills}</span> pills
        </span>
        <span className="flex items-center gap-1">
          <span className="text-emerald-900 font-bold">{approxStrips}</span> strips
        </span>
        <span className="flex items-center gap-1">
          <span className="text-emerald-900 font-bold">{daysLeft}</span> days left
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">
          until {format(lastUsableDate, 'MMM d, yyyy')}
        </p>
        {isLowStock && (
          <div className="flex items-center space-x-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-tighter animate-pulse">
            <AlertCircle size={10} />
            <span>Low Stock</span>
          </div>
        )}
      </div>
    </div>
  );
}
