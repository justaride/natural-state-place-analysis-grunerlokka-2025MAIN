'use client';

import { useState, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { EventReference } from '@/types/place-analysis';
import {
  transformEventsToTimeline,
  aggregateByWeek,
  aggregateByMonth,
  filterEventsByHierarchy,
  getEventColor,
  formatTimelineDate,
} from '@/lib/timeline-utils';

interface EventTimelineProps {
  events: EventReference[];
  startDate?: string;
  endDate?: string;
  bankData?: { date: string; amount: number }[];
  visitorData?: { date: string; amount: number }[]; // Changed from 'count' to 'amount' for consistency
  className?: string;
}

export default function EventTimeline({
  events,
  startDate = '2024-01-01',
  endDate = '2024-12-31',
  bankData = [],
  visitorData = [],
  className = '',
}: EventTimelineProps) {
  const [aggregation, setAggregation] = useState<'day' | 'week' | 'month'>('month');
  const [selectedLevels, setSelectedLevels] = useState<(1 | 2 | 3 | 4 | 5)[]>([1, 2, 3]);
  const [showBank, setShowBank] = useState(false);
  const [showVisitors, setShowVisitors] = useState(false);

  // Transform and aggregate data
  const timelineData = useMemo(() => {
    let data = transformEventsToTimeline(events, startDate, endDate);

    // Filter events by hierarchy
    data = data.map((point) => ({
      ...point,
      events: filterEventsByHierarchy(point.events, selectedLevels),
    }));

    // Aggregate based on selection
    if (aggregation === 'week') {
      data = aggregateByWeek(data);
    } else if (aggregation === 'month') {
      data = aggregateByMonth(data);
    }

    // Add bank and visitor data
    if (showBank && bankData.length > 0) {
      const bankMap = new Map(bankData.map((d) => [d.date, d.amount]));
      data = data.map((point) => ({
        ...point,
        banktransaksjoner: bankMap.get(point.date) || 0,
      }));
    }

    if (showVisitors && visitorData.length > 0) {
      const visitorMap = new Map(visitorData.map((d) => [d.date, d.amount]));
      data = data.map((point) => ({
        ...point,
        besokende: visitorMap.get(point.date) || 0,
      }));
    }

    return data;
  }, [events, startDate, endDate, aggregation, selectedLevels, showBank, showVisitors, bankData, visitorData]);

  // Prepare scatter data for events (embedded in timeline data)
  const chartData = useMemo(() => {
    return timelineData.map((point) => {
      // Add event markers to each data point
      const eventMarkers: Record<string, number> = {};
      point.events.forEach((event, idx) => {
        const hierarchy = event.hierarchyLevel || 1;
        // Create multiple y-levels for different hierarchy levels
        const yLevel = 6 - hierarchy; // Invert so level 1 is highest
        eventMarkers[`event_${hierarchy}_${idx}`] = yLevel;
      });

      return {
        ...point,
        ...eventMarkers,
        // Add readable labels
        dateLabel: formatTimelineDate(point.date, aggregation),
      };
    });
  }, [timelineData, aggregation]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const point = timelineData.find((p) => p.date === data.date);

    if (!point) return null;

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
        <p className="mb-2 font-semibold text-gray-900">
          {formatTimelineDate(point.date, aggregation)}
        </p>

        {point.events.length > 0 && (
          <div className="mb-3">
            <p className="mb-1 text-xs font-medium text-gray-500">Arrangementer ({point.events.length})</p>
            <div className="space-y-1">
              {point.events.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-start gap-2">
                  <span
                    className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: getEventColor(event.type) }}
                  />
                  <div className="text-xs">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    {event.estimatedAttendees && (
                      <p className="text-gray-500">{event.estimatedAttendees.toLocaleString('nb-NO')} besøkende</p>
                    )}
                  </div>
                </div>
              ))}
              {point.events.length > 5 && (
                <p className="text-xs italic text-gray-500">+{point.events.length - 5} flere</p>
              )}
            </div>
          </div>
        )}

        {showBank && point.banktransaksjoner && (
          <div className="mb-2">
            <p className="text-xs text-gray-500">
              Transaksjoner: <span className="font-medium text-blue-600">{point.banktransaksjoner.toLocaleString('nb-NO')}</span>
            </p>
          </div>
        )}

        {showVisitors && point.besokende && (
          <div>
            <p className="text-xs text-gray-500">
              Besøkende: <span className="font-medium text-green-600">{point.besokende.toLocaleString('nb-NO')}</span>
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Aggregation selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Visning:</label>
            <div className="flex rounded-lg border border-gray-200">
              {(['day', 'week', 'month'] as const).map((agg) => (
                <button
                  key={agg}
                  onClick={() => setAggregation(agg)}
                  className={`px-3 py-1 text-sm transition-colors ${
                    aggregation === agg
                      ? 'bg-natural-sage text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  } ${agg === 'day' ? 'rounded-l-lg' : agg === 'month' ? 'rounded-r-lg' : ''}`}
                >
                  {agg === 'day' ? 'Dag' : agg === 'week' ? 'Uke' : 'Måned'}
                </button>
              ))}
            </div>
          </div>

          {/* Hierarchy level selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Vis nivå:</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    if (selectedLevels.includes(level as 1 | 2 | 3 | 4 | 5)) {
                      setSelectedLevels(selectedLevels.filter((l) => l !== level));
                    } else {
                      setSelectedLevels([...selectedLevels, level as 1 | 2 | 3 | 4 | 5]);
                    }
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                    selectedLevels.includes(level as 1 | 2 | 3 | 4 | 5)
                      ? 'border-natural-sage bg-natural-sage text-white'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data overlays */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showBank}
              onChange={(e) => setShowBank(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Banktransaksjoner</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showVisitors}
              onChange={(e) => setShowVisitors(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700">Besøkende</span>
          </label>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="dateLabel"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 6]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(value) => {
                const labels = { 5: 'Mega', 4: 'Store', 3: 'Medium', 2: 'Små', 1: 'Mikro' };
                return labels[value as keyof typeof labels] || '';
              }}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              label={{ value: 'Hierarki-nivå', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
            />
            {(showBank || showVisitors) && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                label={{ value: showBank ? 'Transaksjoner (kr)' : 'Besøkende', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: '#6b7280' } }}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />

            {/* Bank transaction line */}
            {showBank && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="banktransaksjoner"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Banktransaksjoner"
              />
            )}

            {/* Visitor line */}
            {showVisitors && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="besokende"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Besøkende"
              />
            )}

            {/* Event count visualization as bar */}
            <Scatter
              yAxisId="left"
              dataKey="eventCount"
              fill="#10b981"
              fillOpacity={0.6}
              name="Antall arrangementer"
              shape="circle"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-6 border-t border-gray-200 pt-4">
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Event-typer</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#10b981]" />
              <span className="text-xs text-gray-700">Kultur</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#3b82f6]" />
              <span className="text-xs text-gray-700">Kommersielt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#8b5cf6]" />
              <span className="text-xs text-gray-700">Sosialt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#f59e0b]" />
              <span className="text-xs text-gray-700">Infrastruktur</span>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Størrelse = Hierarki</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-gray-400" />
              <span className="text-xs text-gray-700">Nivå 1 (5000+)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-gray-400" />
              <span className="text-xs text-gray-700">Nivå 2 (1000-5000)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-gray-400" />
              <span className="text-xs text-gray-700">Nivå 3 (200-1000)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
