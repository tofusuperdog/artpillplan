import { Medicine } from './types';
import { differenceInCalendarDays } from 'date-fns';

export function calculateLivePills(medicine: Medicine): number {
  if (!medicine.lastUpdated) return medicine.currentPills;
  
  const daysPassed = differenceInCalendarDays(new Date(), new Date(medicine.lastUpdated));
  const pillsConsumed = Math.max(0, daysPassed * medicine.pillsPerDay);
  return Math.max(0, medicine.currentPills - pillsConsumed);
}

export function calculateDaysLeft(medicine: Medicine): number {
  const livePills = calculateLivePills(medicine);
  return Math.floor(livePills / medicine.pillsPerDay);
}
