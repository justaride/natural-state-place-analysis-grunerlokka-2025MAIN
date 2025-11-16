'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DailyDataPoint {
  date: string;
  handel: number;
  matOgOpplevelser: number;
  tjenester: number;
  total: number;
  formattedDate: string;
}

interface QuarterlyDetailChartProps {
  quarter: number;
  year: number;
  dailyData: DailyDataPoint[];
}

export default function QuarterlyDetailChart({
  quarter,
  year,
  dailyData,
}: QuarterlyDetailChartProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M kr`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(0)}k kr`;
    }
    return `${value.toLocaleString('nb-NO')} kr`;
  };

  // Calculate totals
  const totals = useMemo(() => {
    const handelTotal = dailyData.reduce((sum, d) => sum + d.handel, 0);
    const matTotal = dailyData.reduce((sum, d) => sum + d.matOgOpplevelser, 0);
    const tjenesteTotal = dailyData.reduce((sum, d) => sum + d.tjenester, 0);
    const grandTotal = dailyData.reduce((sum, d) => sum + d.total, 0);

    return {
      handel: handelTotal,
      mat: matTotal,
      tjenester: tjenesteTotal,
      total: grandTotal,
    };
  }, [dailyData]);

  if (dailyData.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-gray-600">
          Ingen detaljert daglig data tilgjengelig for Q{quarter} {year}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-natural-forest md:text-2xl">
          Daglige Transaksjoner - Q{quarter} {year}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Korthandel fordelt per dag og kategori
        </p>
      </div>

      {/* Category Totals */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-1 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#8884d8]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Handel
            </span>
          </div>
          <div className="text-xl font-bold text-natural-forest">
            {formatCurrency(totals.handel)}
          </div>
          <div className="mt-1 text-xs text-gray-600">
            {((totals.handel / totals.total) * 100).toFixed(1)}% av total
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-1 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#82ca9d]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Mat og Opplevelser
            </span>
          </div>
          <div className="text-xl font-bold text-natural-forest">
            {formatCurrency(totals.mat)}
          </div>
          <div className="mt-1 text-xs text-gray-600">
            {((totals.mat / totals.total) * 100).toFixed(1)}% av total
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-1 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ffc658]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Tjenester
            </span>
          </div>
          <div className="text-xl font-bold text-natural-forest">
            {formatCurrency(totals.tjenester)}
          </div>
          <div className="mt-1 text-xs text-gray-600">
            {((totals.tjenester / totals.total) * 100).toFixed(1)}% av total
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="formattedDate"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: any) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
              }}
            />
            <Legend />
            <Bar
              dataKey="handel"
              stackId="a"
              fill="#8884d8"
              name="Handel"
            />
            <Bar
              dataKey="matOgOpplevelser"
              stackId="a"
              fill="#82ca9d"
              name="Mat og Opplevelser"
            />
            <Bar
              dataKey="tjenester"
              stackId="a"
              fill="#ffc658"
              name="Tjenester"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Total Omsetning
          </div>
          <div className="mt-1 text-2xl font-bold text-natural-forest">
            {formatCurrency(totals.total)}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Gjennomsnitt per Dag
          </div>
          <div className="mt-1 text-2xl font-bold text-natural-forest">
            {formatCurrency(totals.total / dailyData.length)}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Høyeste Dag
          </div>
          <div className="mt-1 text-2xl font-bold text-green-700">
            {formatCurrency(Math.max(...dailyData.map((d) => d.total)))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Laveste Dag
          </div>
          <div className="mt-1 text-2xl font-bold text-orange-700">
            {formatCurrency(Math.min(...dailyData.map((d) => d.total)))}
          </div>
        </div>
      </div>
    </div>
  );
}
