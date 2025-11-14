'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BankTransactionChartProps {
  data: { date: string; amount: number }[];
  height?: number;
  color?: string;
  className?: string;
}

export default function BankTransactionChart({
  data,
  height = 200,
  color = '#3b82f6',
  className = '',
}: BankTransactionChartProps) {
  // Format data for display
  const chartData = useMemo(() => {
    return data.map((point) => ({
      date: point.date,
      amount: point.amount / 1_000_000, // Convert to millions for display
      displayDate: new Date(point.date).toLocaleDateString('nb-NO', {
        day: 'numeric',
        month: 'short',
      }),
    }));
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const fullDate = new Date(data.date).toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <p className="mb-1 text-xs font-medium text-gray-500">{fullDate}</p>
        <p className="text-sm font-semibold text-blue-600">
          NOK {data.amount.toFixed(1)} mil.
        </p>
      </div>
    );
  };

  // Calculate tick positions for x-axis (show every month)
  const xAxisTicks = useMemo(() => {
    const ticks: string[] = [];
    const seenMonths = new Set<string>();

    chartData.forEach((point) => {
      const monthKey = point.date.substring(0, 7); // YYYY-MM
      if (!seenMonths.has(monthKey)) {
        seenMonths.add(monthKey);
        ticks.push(point.date);
      }
    });

    return ticks;
  }, [chartData]);

  // Format x-axis labels
  const formatXAxis = (dateStr: string): string => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
    return months[date.getMonth()] || 'Jan';
  };

  // Calculate domain with padding
  const yDomain = useMemo(() => {
    const values = chartData.map((d) => d.amount);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [chartData]);

  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-natural-forest">
          Banktransaksjoner 2024
        </h3>
        <p className="text-sm text-gray-600">
          Daglig korthandel på Grünerløkka (+5 Urbant område)
        </p>
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              ticks={xAxisTicks}
              tickFormatter={formatXAxis}
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <YAxis
              domain={yDomain}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickFormatter={(value) => `${value.toFixed(0)} mil.`}
              label={{
                value: 'NOK (millioner)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 11, fill: '#6b7280' },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              name="Banktransaksjoner"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-center text-xs text-gray-500">
        Total årsomsetning: NOK 3,97 milliarder
      </div>
    </div>
  );
}
