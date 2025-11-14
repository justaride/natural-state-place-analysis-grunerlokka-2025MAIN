'use client';

import { useState, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
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
  aggregateByMonth,
  formatTimelineDate,
} from '@/lib/timeline-utils';

interface SimpleEventTimelineProps {
  events: EventReference[];
  startDate?: string;
  endDate?: string;
  bankData?: { date: string; amount: number }[];
  visitorData?: { date: string; amount: number }[];
  className?: string;
}

export default function SimpleEventTimeline({
  events,
  startDate = '2024-01-01',
  endDate = '2024-12-31',
  bankData = [],
  visitorData = [],
  className = '',
}: SimpleEventTimelineProps) {
  const [showBank, setShowBank] = useState(true); // Default to showing bank data
  const [showVisitors, setShowVisitors] = useState(true); // Default to showing visitor data

  // Transform and aggregate data
  const chartData = useMemo(() => {
    console.log(`[Timeline] Processing ${events.length} events`);

    let data = transformEventsToTimeline(events, startDate, endDate);
    data = aggregateByMonth(data);

    console.log(`[Timeline] After aggregation: ${data.length} data points`);

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

    // Format for display
    return data.map((point) => ({
      ...point,
      name: formatTimelineDate(point.date, 'month'),
      eventCount: point.eventCount || 0,
      totalAttendees: (point.totalAttendees || 0) / 1000, // Scale down for better visualization
    }));
  }, [events, startDate, endDate, showBank, showVisitors, bankData, visitorData]);

  console.log('[Timeline] Rendering with data:', chartData.slice(0, 3));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
        <p className="mb-2 font-semibold text-gray-900">{label}</p>

        <div className="space-y-1 text-sm">
          <p className="text-gray-700">
            <span className="font-medium">Arrangementer:</span> {data.eventCount}
          </p>
          {data.totalAttendees > 0 && (
            <p className="text-gray-700">
              <span className="font-medium">Besøkende:</span> {Math.round(data.totalAttendees)}k
            </p>
          )}
          {showBank && data.banktransaksjoner > 0 && (
            <p className="text-blue-600">
              <span className="font-medium">Transaksjoner:</span>{' '}
              {(data.banktransaksjoner / 1_000_000).toFixed(1)}M kr
            </p>
          )}
          {showVisitors && data.besokende > 0 && (
            <p className="text-green-600">
              <span className="font-medium">Besøkende:</span> {data.besokende.toLocaleString('nb-NO')}
            </p>
          )}
        </div>

        {data.events && data.events.length > 0 && (
          <div className="mt-3 border-t border-gray-200 pt-2">
            <p className="mb-1 text-xs font-medium text-gray-500">Topp-arrangementer:</p>
            {data.events.slice(0, 3).map((event: EventReference) => (
              <p key={event.id} className="text-xs text-gray-700">
                • {event.title}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-natural-forest">
            Arrangementer & Aktivitet 2024
          </h3>
          <p className="text-sm text-gray-600">
            Månedlig oversikt med banktransaksjoner og besøkende
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
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
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{ value: 'Antall arrangementer', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6b7280' } }}
            />
            {(showBank || showVisitors) && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                label={{
                  value: showBank ? 'Transaksjoner (M kr)' : 'Besøkende',
                  angle: 90,
                  position: 'insideRight',
                  style: { fontSize: 11, fill: '#6b7280' }
                }}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="line" />

            {/* Event count bars */}
            <Bar
              yAxisId="left"
              dataKey="eventCount"
              fill="#10b981"
              name="Antall arrangementer"
              radius={[8, 8, 0, 0]}
            />

            {/* Bank transaction line */}
            {showBank && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="banktransaksjoner"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Transaksjoner (kr)"
              />
            )}

            {/* Visitor line */}
            {showVisitors && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="besokende"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Besøkende"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <div>
          Totalt {events.length} arrangementer visualisert per måned i 2024
        </div>
        <div className="flex gap-4">
          {showBank && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              <span>Bank: 3,97 mrd kr årlig</span>
            </div>
          )}
          {showVisitors && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-600"></div>
              <span>Besøkende: ~9M årlig estimat</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
