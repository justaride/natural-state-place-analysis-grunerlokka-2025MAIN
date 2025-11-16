'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/Card';

interface QuarterlyDataPoint {
  year: number;
  quarter: number;
  quarterLabel: string;
  amount: number;
}

interface QuarterlyData {
  metadata: any;
  data: QuarterlyDataPoint[];
}

interface QuarterlyInsightsProps {
  quarterlyData: QuarterlyData;
}

export default function QuarterlyInsights({ quarterlyData }: QuarterlyInsightsProps) {
  const insights = useMemo(() => {
    const validData = quarterlyData.data.filter((d) => d.amount > 0);

    // 1. Seasonal patterns (average per quarter across all years)
    const seasonalAvg = [1, 2, 3, 4].map((q) => {
      const quarterData = validData.filter((d) => d.quarter === q);
      const avg = quarterData.reduce((sum, d) => sum + d.amount, 0) / quarterData.length;
      return {
        quarter: `Q${q}`,
        average: avg,
        count: quarterData.length,
      };
    });

    // 2. Yearly totals and trends
    const yearlyTotals: any[] = [];
    const years = [...new Set(validData.map((d) => d.year))].sort();

    years.forEach((year) => {
      const yearData = validData.filter((d) => d.year === year);
      const total = yearData.reduce((sum, d) => sum + d.amount, 0);
      const complete = yearData.length === 4;

      yearlyTotals.push({
        year,
        total,
        quarterCount: yearData.length,
        complete,
        avgPerQuarter: total / yearData.length,
      });
    });

    // 3. Calculate growth trends
    const growthData = yearlyTotals.map((curr, idx) => {
      if (idx === 0) return { ...curr, yoyGrowth: null };
      const prev = yearlyTotals[idx - 1];

      // Only compare if both years have same number of quarters
      const yoyGrowth = curr.quarterCount === prev.quarterCount
        ? ((curr.total - prev.total) / prev.total) * 100
        : null;

      return { ...curr, yoyGrowth };
    });

    // 4. Best and worst quarters
    const sortedByAmount = [...validData].sort((a, b) => b.amount - a.amount);
    const best5 = sortedByAmount.slice(0, 5);
    const worst5 = sortedByAmount.slice(-5).reverse();

    // 5. COVID impact analysis
    const preCovid = validData.filter((d) => d.year === 2019);
    const covidPeak = validData.filter((d) => d.year >= 2020 && d.year <= 2021);
    const postCovid = validData.filter((d) => d.year >= 2022);

    const preCOVIDAvg = preCovid.reduce((sum, d) => sum + d.amount, 0) / preCovid.length;
    const covidAvg = covidPeak.reduce((sum, d) => sum + d.amount, 0) / covidPeak.length;
    const postCovidAvg = postCovid.reduce((sum, d) => sum + d.amount, 0) / postCovid.length;

    // 6. Volatility analysis
    const quarterlyAmounts = validData.map((d) => d.amount);
    const mean = quarterlyAmounts.reduce((sum, val) => sum + val, 0) / quarterlyAmounts.length;
    const variance = quarterlyAmounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / quarterlyAmounts.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = (stdDev / mean) * 100;

    // 7. Quarter-over-quarter momentum
    const qoqGrowth = validData.map((curr, idx) => {
      if (idx === 0) return { ...curr, qoqGrowth: null };
      const prev = validData[idx - 1]!;
      const growth = ((curr.amount - prev.amount) / prev.amount) * 100;
      return { ...curr, qoqGrowth: growth };
    });

    return {
      seasonalAvg,
      yearlyTotals,
      growthData,
      best5,
      worst5,
      preCOVIDAvg,
      covidAvg,
      postCovidAvg,
      volatility: {
        mean,
        stdDev,
        coefficientOfVariation,
      },
      qoqGrowth,
    };
  }, [quarterlyData]);

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B kr`;
    }
    return `${(value / 1_000_000).toFixed(0)}M kr`;
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return 'N/A';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-natural-forest">
          Dyptgående Dataanalyse og Innsikter
        </h2>
        <p className="mt-2 text-gray-600">
          Avdekker mønstre, trender og nøkkelindikasjoner fra 2019-2025
        </p>
      </div>

      {/* 1. Key Insights Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              💰 Total Omsetning (2019-2025)
            </div>
            <div className="text-3xl font-bold text-natural-forest">
              {formatCurrency(insights.yearlyTotals.reduce((sum, y) => sum + y.total, 0))}
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Over {insights.yearlyTotals.reduce((sum, y) => sum + y.quarterCount, 0)} kvartaler
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              📈 Sterkeste Vekst (År-over-År)
            </div>
            <div className="text-3xl font-bold text-green-700">
              {formatPercent(Math.max(...insights.growthData.filter(g => g.yoyGrowth !== null).map(g => g.yoyGrowth)))}
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {insights.growthData.find(g => g.yoyGrowth === Math.max(...insights.growthData.filter(gf => gf.yoyGrowth !== null).map(gf => gf.yoyGrowth)))?.year} vs {insights.growthData.find(g => g.yoyGrowth === Math.max(...insights.growthData.filter(gf => gf.yoyGrowth !== null).map(gf => gf.yoyGrowth)))?.year - 1}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              📉 COVID-19 Påvirkning
            </div>
            <div className="text-3xl font-bold text-red-700">
              {formatPercent(((insights.covidAvg - insights.preCOVIDAvg) / insights.preCOVIDAvg) * 100)}
            </div>
            <div className="mt-2 text-xs text-gray-600">
              2020-2021 vs 2019 baseline
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              🔄 Post-COVID Recovery
            </div>
            <div className="text-3xl font-bold text-blue-700">
              {formatPercent(((insights.postCovidAvg - insights.preCOVIDAvg) / insights.preCOVIDAvg) * 100)}
            </div>
            <div className="mt-2 text-xs text-gray-600">
              2022+ vs 2019 baseline
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              📊 Volatilitet (Stabilitet)
            </div>
            <div className="text-3xl font-bold text-purple-700">
              {insights.volatility.coefficientOfVariation.toFixed(1)}%
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Variasjonskoeffisient (lavere = mer stabilt)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              🏆 Beste Sesong
            </div>
            <div className="text-3xl font-bold text-green-700">
              {insights.seasonalAvg.sort((a, b) => b.average - a.average)[0]?.quarter}
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Gj.snitt: {formatCurrency(insights.seasonalAvg.sort((a, b) => b.average - a.average)[0]?.average ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Seasonal Pattern Analysis */}
      <div>
        <h3 className="mb-6 text-2xl font-bold text-natural-forest">
          Sesongmønster (Gjennomsnitt per Kvartal)
        </h3>
        <Card>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={insights.seasonalAvg}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Bar dataKey="average" fill="#2D5F3F" name="Gjennomsnitt" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Innsikt:</strong> {insights.seasonalAvg.sort((a, b) => b.average - a.average)[0]?.quarter} er gjennomgående det sterkeste kvartalet, mens {insights.seasonalAvg.sort((a, b) => a.average - b.average)[0]?.quarter} er det svakeste.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Yearly Trend with Growth */}
      <div>
        <h3 className="mb-6 text-2xl font-bold text-natural-forest">
          Årlig Utvikling og Vekst
        </h3>
        <Card>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={insights.growthData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D5F3F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2D5F3F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Area type="monotone" dataKey="total" stroke="#2D5F3F" fillOpacity={1} fill="url(#colorTotal)" name="Total Omsetning" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 4. Best & Worst Quarters */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-xl font-bold text-green-700">
            🏆 Top 5 Beste Kvartaler
          </h3>
          <div className="space-y-2">
            {insights.best5.map((q, idx) => (
              <Card key={`${q.year}-${q.quarter}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        #{idx + 1} {q.quarterLabel}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(q.amount)}
                      </div>
                    </div>
                    <div className="text-2xl">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '⭐'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold text-orange-700">
            📉 5 Svakeste Kvartaler
          </h3>
          <div className="space-y-2">
            {insights.worst5.map((q, idx) => (
              <Card key={`${q.year}-${q.quarter}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {q.quarterLabel}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(q.amount)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-500">
                      {idx === 0 ? 'Lavest' : ''}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Period Comparison */}
      <div>
        <h3 className="mb-6 text-2xl font-bold text-natural-forest">
          Periode-sammenligning
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Pre-COVID (2019)
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(insights.preCOVIDAvg)}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Gjennomsnitt per kvartal
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                COVID-periode (2020-2021)
              </div>
              <div className="text-2xl font-bold text-red-700">
                {formatCurrency(insights.covidAvg)}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Gjennomsnitt per kvartal
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Post-COVID (2022+)
              </div>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(insights.postCovidAvg)}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Gjennomsnitt per kvartal
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Takeaways */}
      <Card>
        <CardContent className="p-8">
          <h3 className="mb-4 text-2xl font-bold text-natural-forest">
            🔍 Nøkkelinnsikter og Konklusjoner
          </h3>
          <div className="space-y-4 text-gray-700">
            <div>
              <strong>1. COVID-19 Påvirkning:</strong> Banktransaksjoner falt med {formatPercent(((insights.covidAvg - insights.preCOVIDAvg) / insights.preCOVIDAvg) * 100)} under pandemien (2020-2021), med laveste punktet i Q1 2021.
            </div>
            <div>
              <strong>2. Sterk Recovery:</strong> Post-COVID (2022+) viser {formatPercent(((insights.postCovidAvg - insights.preCOVIDAvg) / insights.preCOVIDAvg) * 100)} vekst sammenlignet med 2019-nivåer, med 2022 som toppår.
            </div>
            <div>
              <strong>3. Sesongmønster:</strong> {insights.seasonalAvg.sort((a, b) => b.average - a.average)[0]?.quarter} er konsekvent det sterkeste kvartalet (gjennomsnitt {formatCurrency(insights.seasonalAvg.sort((a, b) => b.average - a.average)[0]?.average ?? 0)}), sannsynligvis drevet av vår/sommer-aktivitet.
            </div>
            <div>
              <strong>4. Volatilitet:</strong> Variasjonskoeffisienten på {insights.volatility.coefficientOfVariation.toFixed(1)}% indikerer {insights.volatility.coefficientOfVariation < 10 ? 'stabil' : insights.volatility.coefficientOfVariation < 15 ? 'moderat variabel' : 'høy variabilitet'} i handelsmønstre.
            </div>
            <div>
              <strong>5. Nylig Trend:</strong> {insights.growthData[insights.growthData.length - 1].yoyGrowth && insights.growthData[insights.growthData.length - 1].yoyGrowth! < 0 ? 'Nedgang' : 'Vekst'} på {formatPercent(insights.growthData[insights.growthData.length - 1].yoyGrowth)} i siste periode kan indikere {insights.growthData[insights.growthData.length - 1].yoyGrowth && insights.growthData[insights.growthData.length - 1].yoyGrowth! < 0 ? 'markedsutfordringer eller skift i forbruksmønster' : 'fortsatt positiv utvikling'}.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
