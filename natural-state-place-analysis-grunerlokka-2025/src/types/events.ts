/**
 * Event and timeline types for impact analysis
 */

export type EventCategory =
  | 'cultural'
  | 'commercial'
  | 'infrastructure'
  | 'social'
  | 'policy'
  | 'opening'
  | 'closing'
  | 'construction';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'transformative';

/**
 * Main event interface
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string; // ISO date
  endDate?: string; // for events with duration
  location?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  impactArea: string[]; // IDs of affected areas
  impactLevel?: ImpactLevel;
  impact?: EventImpact;
  media?: string[]; // IDs of related media items
  images?: string[]; // paths to images
  sources?: string[];
  metadata: {
    opprettet: string;
    sistOppdatert: string;
    status: 'planlagt' | 'pagaende' | 'avsluttet' | 'kansellert';
  };
}

/**
 * Measured impact of an event
 */
export interface EventImpact {
  metrics: {
    metric: string;
    before: number;
    after: number;
    change: number;
    percentageChange: number;
  }[];
  measurementPeriod: {
    before: { start: string; end: string };
    after: { start: string; end: string };
  };
  summary: string;
  confidence: 'low' | 'medium' | 'high';
}

/**
 * Timeline entry for visual timeline
 */
export interface TimelineEntry {
  id: string;
  eventId?: string;
  date: string;
  title: string;
  description: string;
  category: EventCategory;
  importance: 'minor' | 'moderate' | 'major';
  icon?: string;
  color?: string;
}
