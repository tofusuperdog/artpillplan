import { Medicine, Settings } from './types';
import { supabase } from './supabase';

export async function readMedicines(): Promise<Medicine[]> {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // Transform to match local interface (remove DB specific fields if any)
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      strength: item.strength,
      pillsPerDay: item.pillsPerDay,
      pillsPerStrip: item.pillsPerStrip,
      latestPricePerStrip: item.latestPricePerStrip,
      currentPills: item.currentPills,
    }));
  } catch (error) {
    console.error('Error reading medicines from Supabase:', error);
    return [];
  }
}

export async function writeMedicines(medicines: Medicine[]): Promise<void> {
  try {
    // To mimic "write entire file" behavior:
    // 1. Delete all (or we could use upsert if we handled deletions differently)
    // For this simple app, we'll use a transaction-like approach or just upsert all.
    // Actually, the current API implementation in route.ts calls writeMedicines with the FULL list.
    // So we should delete what's not in the new list.
    
    const ids = medicines.map(m => m.id);
    
    // Delete items that are no longer in the list
    if (ids.length > 0) {
      await supabase.from('medicines').delete().not('id', 'in', `(${ids.join(',')})`);
    } else {
      await supabase.from('medicines').delete().neq('id', '0');
    }

    // Upsert all items in the list
    if (medicines.length > 0) {
      const { error } = await supabase
        .from('medicines')
        .upsert(medicines);
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error writing medicines to Supabase:', error);
  }
}

export async function readSettings(): Promise<Settings> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    
    return {
      pin: data.pin,
      lowStockThresholdDays: data.lowStockThresholdDays,
      defaultOrderTargetDays: data.defaultOrderTargetDays,
    };
  } catch (error) {
    console.error('Error reading settings from Supabase:', error);
    return {
      pin: '1234',
      lowStockThresholdDays: 10,
      defaultOrderTargetDays: 90,
    };
  }
}

export async function writeSettings(settings: Settings): Promise<void> {
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({
        id: 1,
        ...settings,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error writing settings to Supabase:', error);
  }
}

