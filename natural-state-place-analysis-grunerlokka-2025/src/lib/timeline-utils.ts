/**
 * Utility functions for timeline data transformation
 */

import type { EventReference, TimelineDataPoint } from '@/types/place-analysis';

/**
 * Map impact level to hierarchy level
 */
export function impactToHierarchy(impactLevel?: string): 1 | 2 | 3 | 4 | 5 {
  switch (impactLevel) {
    case 'high':
      return 1;
    case 'medium':
      return 2;
    default:
      return 3;
  }
}

/**
 * Estimate hierarchy level from attendees
 */
export function attendeesToHierarchy(attendees?: number): 1 | 2 | 3 | 4 | 5 {
  if (!attendees) return 5;
  if (attendees >= 5000) return 1;
  if (attendees >= 1000) return 2;
  if (attendees >= 200) return 3;
  if (attendees >= 50) return 4;
  return 5;
}

/**
 * Get event color based on type
 */
export function getEventColor(type: string): string {
  const colors: Record<string, string> = {
    cultural: '#10b981', // green (natural-sage-like)
    commercial: '#3b82f6', // blue
    social: '#8b5cf6', // purple
    infrastructure: '#f59e0b', // amber
    policy: '#6b7280', // gray
  };
  return (colors[type] || colors.cultural) as string;
}

/**
 * Get event size based on hierarchy level (for visualization)
 */
export function getEventSize(hierarchyLevel: 1 | 2 | 3 | 4 | 5): number {
  const sizes = {
    1: 24, // Mega events
    2: 18, // Large events
    3: 12, // Medium events
    4: 8,  // Small events
    5: 6,  // Micro events
  };
  return sizes[hierarchyLevel];
}

/**
 * Transform events array to timeline data points
 * Groups events by date and adds metadata
 */
export function transformEventsToTimeline(
  events: EventReference[],
  startDate: string,
  endDate: string
): TimelineDataPoint[] {
  const dataMap = new Map<string, TimelineDataPoint>();

  // Initialize all dates in range
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0] || '' || '';
    dataMap.set(dateStr, {
      date: dateStr,
      timestamp: current.getTime(),
      events: [],
      eventCount: 0,
      totalAttendees: 0,
    });
    current.setDate(current.getDate() + 1);
  }

  // Add events to their dates
  events.forEach((event) => {
    const eventDate = event.date.split('T')[0] || '' || '';
    const dataPoint = dataMap.get(eventDate);

    if (dataPoint) {
      dataPoint.events.push(event);
      dataPoint.eventCount = (dataPoint.eventCount || 0) + 1;
      dataPoint.totalAttendees = (dataPoint.totalAttendees || 0) + (event.estimatedAttendees || 0);
    }
  });

  // Convert map to array and sort by date
  return Array.from(dataMap.values()).sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Aggregate timeline data by week
 */
export function aggregateByWeek(dataPoints: TimelineDataPoint[]): TimelineDataPoint[] {
  const weekMap = new Map<string, TimelineDataPoint>();

  dataPoints.forEach((point) => {
    const date = new Date(point.date);
    // Get Monday of the week
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const weekKey = monday.toISOString().split('T')[0] || '';

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, {
        date: weekKey,
        timestamp: monday.getTime(),
        events: [],
        eventCount: 0,
        totalAttendees: 0,
        banktransaksjoner: 0,
        besokende: 0,
      });
    }

    const weekPoint = weekMap.get(weekKey)!;
    weekPoint.events.push(...point.events);
    weekPoint.eventCount = (weekPoint.eventCount || 0) + (point.eventCount || 0);
    weekPoint.totalAttendees = (weekPoint.totalAttendees || 0) + (point.totalAttendees || 0);
    weekPoint.banktransaksjoner = (weekPoint.banktransaksjoner || 0) + (point.banktransaksjoner || 0);
    weekPoint.besokende = (weekPoint.besokende || 0) + (point.besokende || 0);
  });

  return Array.from(weekMap.values()).sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Aggregate timeline data by month
 */
export function aggregateByMonth(dataPoints: TimelineDataPoint[]): TimelineDataPoint[] {
  const monthMap = new Map<string, TimelineDataPoint>();

  dataPoints.forEach((point) => {
    const date = new Date(point.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        date: monthKey,
        timestamp: new Date(monthKey).getTime(),
        events: [],
        eventCount: 0,
        totalAttendees: 0,
        banktransaksjoner: 0,
        besokende: 0,
      });
    }

    const monthPoint = monthMap.get(monthKey)!;
    monthPoint.events.push(...point.events);
    monthPoint.eventCount = (monthPoint.eventCount || 0) + (point.eventCount || 0);
    monthPoint.totalAttendees = (monthPoint.totalAttendees || 0) + (point.totalAttendees || 0);
    monthPoint.banktransaksjoner = (monthPoint.banktransaksjoner || 0) + (point.banktransaksjoner || 0);
    monthPoint.besokende = (monthPoint.besokende || 0) + (point.besokende || 0);
  });

  return Array.from(monthMap.values()).sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Filter events by hierarchy level
 */
export function filterEventsByHierarchy(
  events: EventReference[],
  levels: (1 | 2 | 3 | 4 | 5)[]
): EventReference[] {
  return events.filter((event) => {
    const hierarchy = event.hierarchyLevel || impactToHierarchy(event.impactLevel);
    return levels.includes(hierarchy);
  });
}

/**
 * Format date for display
 */
export function formatTimelineDate(date: string, aggregation: 'day' | 'week' | 'month'): string {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
  const month = months[d.getMonth()] || 'Jan';

  switch (aggregation) {
    case 'month':
      return month;
    case 'week':
      return `Uke ${getWeekNumber(d)}`;
    case 'day':
      return `${d.getDate()}. ${month}`;
  }
}

/**
 * Get ISO week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
