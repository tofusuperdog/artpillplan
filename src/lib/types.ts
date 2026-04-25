export interface Medicine {
  id: string;
  name: string;
  strength: string;
  pillsPerDay: number;
  pillsPerStrip: number;
  latestPricePerStrip: number;
  currentPills: number;
}

export interface Settings {
  pin: string;
  lowStockThresholdDays: number;
  defaultOrderTargetDays: number;
}
