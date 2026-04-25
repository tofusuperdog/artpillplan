'use client';

import { useState, useEffect } from 'react';
import { Medicine, Settings } from '@/lib/types';
import MedicineRow from '@/components/MedicineRow';
import StockAdjustModal from '@/components/StockAdjustModal';
import CreateOrderModal from '@/components/CreateOrderModal';
import { Plus, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [medRes, setRes] = await Promise.all([
        fetch('/api/medicines'),
        fetch('/api/settings')
      ]);
      const [medData, setData] = await Promise.all([
        medRes.json(),
        setRes.json()
      ]);
      setMedicines(medData.sort((a: Medicine, b: Medicine) => a.name.localeCompare(b.name)));
      setSettings(setData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateMedicine = (updated: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-emerald-900 font-bold">Loading your meds...</p>
      </div>
    );
  }

  const lowStockCount = settings ? medicines.filter(m => Math.floor(m.currentPills / m.pillsPerDay) < settings.lowStockThresholdDays).length : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-emerald-900 leading-tight">My Stock</h2>
          <p className="text-emerald-600 text-sm font-medium">{medicines.length} medicines tracked</p>
        </div>
        <Link 
          href="/medicine/new"
          className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </Link>
      </div>

      <div className="mb-6">
        {medicines.length > 0 ? (
          medicines.map(med => (
            <MedicineRow 
              key={med.id} 
              medicine={med} 
              lowStockThresholdDays={settings?.lowStockThresholdDays ?? 10}
              onEdit={(m) => window.location.href = `/medicine/${m.id}`}
              onStock={(m) => {
                setSelectedMed(m);
                setIsStockModalOpen(true);
              }}
            />
          ))
        ) : (
          <div className="card p-12 text-center flex flex-col items-center space-y-4 border-dashed bg-emerald-50/50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-200">
              <Plus size={32} />
            </div>
            <p className="text-emerald-400 font-bold">No medicines added yet</p>
            <Link href="/medicine/new" className="btn-secondary text-xs py-2">Add Your First Med</Link>
          </div>
        )}
      </div>

      {medicines.length > 0 && (
        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="fixed bottom-24 right-6 w-16 h-16 bg-emerald-950 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform z-20 group"
        >
          <ShoppingCart size={24} />
          {lowStockCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
              {lowStockCount}
            </span>
          )}
        </button>
      )}

      <StockAdjustModal 
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        medicine={selectedMed}
        onUpdate={handleUpdateMedicine}
      />

      {settings && (
        <CreateOrderModal 
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          medicines={medicines}
          settings={settings}
        />
      )}
    </div>
  );
}
