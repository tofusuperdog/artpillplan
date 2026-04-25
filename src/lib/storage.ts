import fs from 'fs/promises';
import path from 'path';
import { Medicine, Settings } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const MEDICINES_FILE = path.join(DATA_DIR, 'medicines.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

export async function readMedicines(): Promise<Medicine[]> {
  try {
    const data = await fs.readFile(MEDICINES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function writeMedicines(medicines: Medicine[]): Promise<void> {
  await fs.writeFile(MEDICINES_FILE, JSON.stringify(medicines, null, 2));
}

export async function readSettings(): Promise<Settings> {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {
      pin: '1234',
      lowStockThresholdDays: 10,
      defaultOrderTargetDays: 90,
    };
  }
}

export async function writeSettings(settings: Settings): Promise<void> {
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}
