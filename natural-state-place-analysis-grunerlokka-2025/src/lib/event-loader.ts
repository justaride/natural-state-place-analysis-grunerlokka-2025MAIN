/**
 * Load and transform event data from aktiviteter-2024.json
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import type { EventReference } from '@/types/place-analysis';
import { attendeesToHierarchy } from './timeline-utils';

interface RawEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  type?: string;
  category?: string;
  location?: string;
  venue?: string;
  hierarchyLevel?: number;
  estimatedAttendees?: number;
  estimatedVisitors?: number;
  attendees?: string | number;
  description?: string;
  source?: string;
}

interface AktivitetData {
  metadata: {
    totalEvents: number;
    year: number;
  };
  events?: RawEvent[];
  arrangementer?: RawEvent[];
}

/**
 * Load events from aktiviteter-2024.json
 */
export async function loadEvents(): Promise<EventReference[]> {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'aktiviteter-2024.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const data: AktivitetData = JSON.parse(fileContent);

    // Get events array (try both possible keys)
    const rawEvents = data.events || data.arrangementer || [];

    // Transform to EventReference format
    return rawEvents.map((event) => transformEvent(event));
  } catch (error) {
    console.error('Failed to load events:', error);
    return [];
  }
}

/**
 * Transform raw event to EventReference
 */
function transformEvent(raw: RawEvent): EventReference {
  // Parse attendees (try multiple field names)
  let attendees = 0;
  if (typeof raw.estimatedVisitors === 'number') {
    attendees = raw.estimatedVisitors;
  } else if (typeof raw.estimatedAttendees === 'number') {
    attendees = raw.estimatedAttendees;
  } else if (typeof raw.attendees === 'number') {
    attendees = raw.attendees;
  } else if (typeof raw.attendees === 'string') {
    // Parse strings like "5000+", "1000-2000", etc.
    const match = raw.attendees.match(/(\d+)/);
    if (match && match[1]) {
      attendees = parseInt(match[1], 10);
    }
  }

  // Map category/type to our type system
  const eventType = mapEventType(raw.type || raw.category || 'cultural');

  // Use provided hierarchy level or calculate from attendees
  const hierarchyLevel = (raw.hierarchyLevel as 1 | 2 | 3 | 4 | 5) || attendeesToHierarchy(attendees);

  // Map hierarchy to impact level
  const impactLevel = hierarchyLevel === 1 ? 'high' : hierarchyLevel === 2 ? 'medium' : 'low';

  return {
    id: raw.id,
    title: raw.title,
    date: raw.date,
    endDate: raw.endDate,
    type: eventType,
    impactLevel,
    hierarchyLevel,
    estimatedAttendees: attendees > 0 ? attendees : undefined,
    description: raw.description,
  };
}

/**
 * Map various event categories to our type system
 */
function mapEventType(category: string): 'cultural' | 'commercial' | 'infrastructure' | 'social' | 'policy' {
  const cat = category.toLowerCase();

  if (cat.includes('konser') || cat.includes('musik') || cat.includes('kultur') || cat.includes('teater') || cat.includes('kunst') || cat.includes('festival')) {
    return 'cultural';
  }

  if (cat.includes('marked') || cat.includes('messe') || cat.includes('kommers')) {
    return 'commercial';
  }

  if (cat.includes('demo') || cat.includes('markering') || cat.includes('sosial') || cat.includes('fellesskap')) {
    return 'social';
  }

  if (cat.includes('bygg') || cat.includes('infrastruktur') || cat.includes('anlegg')) {
    return 'infrastructure';
  }

  if (cat.includes('politikk') || cat.includes('møte') || cat.includes('høring')) {
    return 'policy';
  }

  // Default to cultural for music/event venues
  return 'cultural';
}

/**
 * Merge events from multiple sources
 */
export function mergeEvents(...eventSources: EventReference[][]): EventReference[] {
  const eventMap = new Map<string, EventReference>();

  for (const events of eventSources) {
    for (const event of events) {
      // If event already exists, keep the one with more data
      if (eventMap.has(event.id)) {
        const existing = eventMap.get(event.id)!;
        if ((event.description?.length || 0) > (existing.description?.length || 0)) {
          eventMap.set(event.id, event);
        }
      } else {
        eventMap.set(event.id, event);
      }
    }
  }

  return Array.from(eventMap.values()).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}
