'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface QuarterlyDataPoint {
  year: number;
  quarter: number;
  quarterLabel: string;
  amount: number;
  transactionCount?: number;
  averageTransaction?: number;
  note?: string;
}

interface QuarterlyData {
  metadata: {
    title: string;
    period: string;
    area: string;
    currency: string;
    dataSource: string;
    lastUpdated: string;
    notes?: string[];
  };
  data: QuarterlyDataPoint[];
}

interface QuarterlyComparisonChartsProps {
  quarterlyData: QuarterlyData;
}

export default function QuarterlyComparisonCharts({
  quarterlyData,
}: QuarterlyComparisonChartsProps) {
  // Filter out placeholder data (where amount is 0)
  const validData = useMemo(
    () => quarterlyData.data.filter((d) => d.amount > 0),
    [quarterlyData.data]
  );

  // Calculate YoY growth
  const dataWithYoY = useMemo(() => {
    return validData.map((current) => {
      const previousYear = validData.find(
        (d) => d.year === current.year - 1 && d.quarter === current.quarter
      );

      const yoyGrowth = previousYear
        ? ((current.amount - previousYear.amount) / previousYear.amount) * 100
        : null;

      return {
        ...current,
        yoyGrowth,
      };
    });
  }, [validData]);

  // Prepare data for quarter comparison (Q1 vs Q1 across years, etc.)
  const quarterComparisonData = useMemo(() => {
    const quarters = [1, 2, 3, 4];
    return quarters.map((q) => {
      const quarterData = validData.filter((d) => d.quarter === q);
      const result: any = {
        quarter: `Q${q}`,
      };

      quarterData.forEach((d) => {
        result[`${d.year}`] = d.amount;
      });

      return result;
    });
  }, [validData]);

  // Get unique years for legend
  const years = useMemo(
    () => [...new Set(validData.map((d) => d.year))].sort(),
    [validData]
  );

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}B kr`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(0)}M kr`;
    }
    return `${value.toLocaleString('nb-NO')} kr`;
  };

  // Format percentage
  const formatPercentage = (value: number | null) => {
    if (value === null) return 'N/A';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  // Color palette for years
  const yearColors: Record<number, string> = {
    2019: '#8B4513',
    2020: '#DC143C',
    2021: '#FF8C00',
    2022: '#32CD32',
    2023: '#4169E1',
    2024: '#9370DB',
    2025: '#FF1493',
  };

  if (validData.length === 0) {
    return (
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center">
        <p className="text-lg font-semibold text-yellow-800">
          Ingen data tilgjengelig ennå
        </p>
        <p className="mt-2 text-sm text-yellow-700">
          Vennligst legg til dine kvartalsvise banktransaksjonsdata i{' '}
          <code className="rounded bg-yellow-100 px-2 py-1">
            src/data/quarterly/banktransaksjoner-2019-2025.json
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 1. Time Series Line Chart - All Quarters Over Time */}
      <div>
        <h3 className="mb-4 text-xl font-bold text-natural-forest md:text-2xl">
          Utvikling Over Tid (2019-2025)
        </h3>
        <p className="mb-6 text-sm text-gray-600">
          Totale banktransaksjoner per kvartal - tidslinje
        </p>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dataWithYoY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="quarterLabel"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
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
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2D5F3F"
                strokeWidth={3}
                name="Banktransaksjoner"
                dot={{ fill: '#2D5F3F', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Quarter-over-Quarter Comparison (Q1 vs Q1, Q2 vs Q2, etc.) */}
      <div>
        <h3 className="mb-4 text-xl font-bold text-natural-forest md:text-2xl">
          Sammenligning av Tilsvarende Kvartaler
        </h3>
        <p className="mb-6 text-sm text-gray-600">
          Hvordan presterer Q1 sammenlignet med Q1 tidligere år? Samme for Q2, Q3, Q4
        </p>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={quarterComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
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
              {years.map((year) => (
                <Bar
                  key={year}
                  dataKey={`${year}`}
                  fill={yearColors[year] || '#999'}
                  name={`${year}`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Year-over-Year Growth Table */}
      <div>
        <h3 className="mb-4 text-xl font-bold text-natural-forest md:text-2xl">
          År-over-År Vekst (YoY %)
        </h3>
        <p className="mb-6 text-sm text-gray-600">
          Prosentvis endring sammenlignet med samme kvartal foregående år
        </p>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 md:px-6">
                  Kvartal
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 md:px-6">
                  Beløp
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 md:px-6">
                  YoY Vekst
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {dataWithYoY.map((item, index) => (
                <tr
                  key={index}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 md:px-6">
                    {item.quarterLabel}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-gray-700 md:px-6">
                    {formatCurrency(item.amount)}
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-4 text-right text-sm font-semibold md:px-6 ${
                      item.yoyGrowth === null
                        ? 'text-gray-400'
                        : item.yoyGrowth >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                    }`}
                  >
                    {formatPercentage(item.yoyGrowth)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Key Statistics Summary */}
      <div>
        <h3 className="mb-4 text-xl font-bold text-natural-forest md:text-2xl">
          Nøkkelstatistikk
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total across all periods */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Omsetning
            </div>
            <div className="text-2xl font-bold text-natural-forest md:text-3xl">
              {formatCurrency(
                validData.reduce((sum, d) => sum + d.amount, 0)
              )}
            </div>
            <div className="mt-1 text-xs text-gray-600">
              {validData.length} kvartaler
            </div>
          </div>

          {/* Average per quarter */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Gjennomsnitt per Kvartal
            </div>
            <div className="text-2xl font-bold text-natural-forest md:text-3xl">
              {formatCurrency(
                validData.reduce((sum, d) => sum + d.amount, 0) /
                  validData.length
              )}
            </div>
            <div className="mt-1 text-xs text-gray-600">Snitt</div>
          </div>

          {/* Best quarter */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Beste Kvartal
            </div>
            <div className="text-2xl font-bold text-green-700 md:text-3xl">
              {formatCurrency(Math.max(...validData.map((d) => d.amount)))}
            </div>
            <div className="mt-1 text-xs text-gray-600">
              {
                validData.find(
                  (d) => d.amount === Math.max(...validData.map((v) => v.amount))
                )?.quarterLabel
              }
            </div>
          </div>

          {/* Worst quarter */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Laveste Kvartal
            </div>
            <div className="text-2xl font-bold text-red-700 md:text-3xl">
              {formatCurrency(Math.min(...validData.map((d) => d.amount)))}
            </div>
            <div className="mt-1 text-xs text-gray-600">
              {
                validData.find(
                  (d) => d.amount === Math.min(...validData.map((v) => v.amount))
                )?.quarterLabel
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
