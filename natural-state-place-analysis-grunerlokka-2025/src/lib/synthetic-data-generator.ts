/**
 * Generate synthetic but realistic data for bank transactions and visitor counts
 * Based on known annual totals and seasonal patterns
 */

interface DailyDataPoint {
  date: string;
  amount: number;
}

/**
 * Generate daily bank transaction data for 2024
 * Total: 3,970,000,000 kr for the year
 */
export function generateBankTransactionData(): DailyDataPoint[] {
  const data: DailyDataPoint[] = [];
  const totalYearly = 3_970_000_000; // 3.97 billion NOK
  const dailyBase = totalYearly / 365; // ~10.9 million per day

  // Seasonal multipliers (realistic Norwegian retail pattern)
  const seasonalMultipliers: Record<number, number> = {
    1: 0.75,  // Jan - slow after holidays
    2: 0.80,  // Feb - still winter slow
    3: 0.90,  // Mar - picking up
    4: 0.95,  // Apr - spring activity
    5: 1.10,  // May - 17. mai, warmer weather
    6: 1.20,  // Jun - summer peak, Pride, festivals
    7: 0.95,  // Jul - vacation, some businesses closed
    8: 1.05,  // Aug - back from vacation
    9: 1.10,  // Sep - autumn activity
    10: 1.05, // Oct - stable
    11: 1.10, // Nov - pre-Christmas
    12: 1.05, // Dec - Christmas but also closures
  };

  // Day of week multipliers
  const dowMultipliers = [0.7, 1.0, 1.0, 1.05, 1.15, 1.30, 1.20]; // Sun-Sat

  // Event boost dates (major events that increase spending)
  const eventBoosts: Record<string, number> = {
    '2024-03-08': 1.15, // 8. mars
    '2024-05-04': 1.25, // Løkkadagene
    '2024-05-17': 1.40, // 17. mai
    '2024-05-24': 1.20, // Vegetarfestival
    '2024-06-01': 1.25, // Musikkfest Oslo
    '2024-06-13': 1.35, // Piknik i Parken start
    '2024-06-14': 1.35,
    '2024-06-15': 1.35,
    '2024-06-26': 1.30, // Pride week start
    '2024-06-27': 1.35,
    '2024-06-28': 1.40,
    '2024-06-29': 1.45, // Pride parade - peak
    '2024-11-30': 1.20, // Jul på Løkka
  };

  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  const current = new Date(startDate);

  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0] || '';
    const month = current.getMonth() + 1;
    const dow = current.getDay();

    // Calculate daily amount with multipliers
    let amount = dailyBase;
    amount *= seasonalMultipliers[month] || 1.0;
    amount *= dowMultipliers[dow] || 1.0;
    amount *= eventBoosts[dateStr] || 1.0;

    // Add some random variation (±10%)
    const variation = 0.9 + Math.random() * 0.2;
    amount *= variation;

    data.push({
      date: dateStr,
      amount: Math.round(amount),
    });

    current.setDate(current.getDate() + 1);
  }

  return data;
}

/**
 * Generate daily visitor count data for 2024
 * Estimated based on population density and foot traffic patterns
 */
export function generateVisitorData(): DailyDataPoint[] {
  const data: DailyDataPoint[] = [];
  const dailyBase = 25000; // ~25k daily visitors (educated estimate for busy urban district)

  // Seasonal patterns (more outdoor activity in summer)
  const seasonalMultipliers: Record<number, number> = {
    1: 0.70,
    2: 0.75,
    3: 0.85,
    4: 0.95,
    5: 1.15,
    6: 1.30,
    7: 1.10, // Some vacations
    8: 1.20,
    9: 1.15,
    10: 1.00,
    11: 0.90,
    12: 0.85,
  };

  // Day of week (weekend is busier)
  const dowMultipliers = [0.8, 0.9, 0.95, 1.0, 1.1, 1.3, 1.4]; // Sun-Sat

  // Event visitor boosts
  const eventBoosts: Record<string, number> = {
    '2024-03-08': 1.25,
    '2024-05-04': 1.40,
    '2024-05-17': 1.60, // 17. mai - huge boost
    '2024-05-24': 1.35,
    '2024-06-01': 1.40,
    '2024-06-13': 1.50,
    '2024-06-14': 1.50,
    '2024-06-15': 1.50,
    '2024-06-26': 1.45,
    '2024-06-27': 1.50,
    '2024-06-28': 1.55,
    '2024-06-29': 2.80, // Pride parade - massive boost (70k attendees)
    '2024-11-30': 1.30,
  };

  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  const current = new Date(startDate);

  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0] || '';
    const month = current.getMonth() + 1;
    const dow = current.getDay();

    let count = dailyBase;
    count *= seasonalMultipliers[month] || 1.0;
    count *= dowMultipliers[dow] || 1.0;
    count *= eventBoosts[dateStr] || 1.0;

    // Random variation (±15%)
    const variation = 0.85 + Math.random() * 0.3;
    count *= variation;

    data.push({
      date: dateStr,
      amount: Math.round(count),
    });

    current.setDate(current.getDate() + 1);
  }

  return data;
}

/**
 * Aggregate daily data to weekly
 */
export function aggregateToWeekly(dailyData: DailyDataPoint[]): DailyDataPoint[] {
  const weekMap = new Map<string, number>();

  dailyData.forEach((point) => {
    const date = new Date(point.date);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const weekKey = monday.toISOString().split('T')[0] || '';

    const current = weekMap.get(weekKey) || 0;
    weekMap.set(weekKey, current + point.amount);
  });

  return Array.from(weekMap.entries())
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Aggregate daily data to monthly
 */
export function aggregateToMonthly(dailyData: DailyDataPoint[]): DailyDataPoint[] {
  const monthMap = new Map<string, number>();

  dailyData.forEach((point) => {
    const date = new Date(point.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;

    const current = monthMap.get(monthKey) || 0;
    monthMap.set(monthKey, current + point.amount);
  });

  return Array.from(monthMap.entries())
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
