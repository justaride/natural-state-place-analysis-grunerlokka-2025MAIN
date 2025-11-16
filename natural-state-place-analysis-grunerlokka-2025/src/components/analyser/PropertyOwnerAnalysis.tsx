'use client';

// @ts-nocheck
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/Card';

interface DailyDataPoint {
  date: string;
  handel: number;
  matOgOpplevelser: number;
  tjenester: number;
  total: number;
  formattedDate: string;
}

interface QuarterData {
  year: number;
  quarter: number;
  quarterLabel: string;
  amount: number;
  transactionCount?: number;
  averageTransaction?: number;
}

interface PropertyOwnerAnalysisProps {
  quarterlyData: {
    metadata: any;
    data: QuarterData[];
  };
  dailyData?: {
    quarters: {
      [key: string]: DailyDataPoint[];
    };
  };
}

export default function PropertyOwnerAnalysis({
  quarterlyData,
  dailyData,
}: PropertyOwnerAnalysisProps) {
  // Filter valid data
  const validData = useMemo(
    () => quarterlyData.data.filter((d) => d.amount > 0),
    [quarterlyData.data]
  );

  // 1. TENANT CATEGORY PERFORMANCE
  const categoryPerformance = useMemo(() => {
    if (!dailyData?.quarters) return null;

    const totals = {
      handel: 0,
      matOgOpplevelser: 0,
      tjenester: 0,
    };

    const growthByCategory: Record<string, { early: number; late: number }> = {
      handel: { early: 0, late: 0 },
      matOgOpplevelser: { early: 0, late: 0 },
      tjenester: { early: 0, late: 0 },
    };

    const quarters = Object.keys(dailyData.quarters).sort();
    const midpoint = Math.floor(quarters.length / 2);

    quarters.forEach((qKey, idx) => {
      const days = dailyData.quarters[qKey];
      const period = idx < midpoint ? 'early' : 'late';

      days?.forEach((day) => {
        totals.handel += day.handel;
        totals.matOgOpplevelser += day.matOgOpplevelser;
        totals.tjenester += day.tjenester;

        growthByCategory.handel![period] += day.handel;
        growthByCategory.matOgOpplevelser![period] += day.matOgOpplevelser;
        growthByCategory.tjenester![period] += day.tjenester;
      });
    });

    const totalRevenue =
      totals.handel + totals.matOgOpplevelser + totals.tjenester;

    return {
      distribution: [
        {
          name: 'Handel',
          value: totals.handel,
          percentage: ((totals.handel / totalRevenue) * 100).toFixed(1),
          growth:
            ((growthByCategory.handel!.late - growthByCategory.handel!.early) /
              growthByCategory.handel!.early) *
            100,
        },
        {
          name: 'Mat og Opplevelser',
          value: totals.matOgOpplevelser,
          percentage: ((totals.matOgOpplevelser / totalRevenue) * 100).toFixed(
            1
          ),
          growth:
            ((growthByCategory.matOgOpplevelser!.late -
              growthByCategory.matOgOpplevelser!.early) /
              growthByCategory.matOgOpplevelser!.early) *
            100,
        },
        {
          name: 'Tjenester',
          value: totals.tjenester,
          percentage: ((totals.tjenester / totalRevenue) * 100).toFixed(1),
          growth:
            ((growthByCategory.tjenester!.late -
              growthByCategory.tjenester!.early) /
              growthByCategory.tjenester!.early) *
            100,
        },
      ],
      totals,
      totalRevenue,
    };
  }, [dailyData]);

  // 2. MARKET STRENGTH INDICATORS
  const marketStrength = useMemo(() => {
    const recentQuarters = validData.slice(-8); // Last 2 years
    const avgTransactionSize =
      recentQuarters.reduce(
        (sum, q) => sum + (q.averageTransaction || 0),
        0
      ) / recentQuarters.length;

    const avgDailyRevenue =
      recentQuarters.reduce((sum, q) => sum + q.amount, 0) /
      recentQuarters.length /
      91; // Average days per quarter

    const transactionGrowth = recentQuarters.map((q, idx) => {
      if (idx === 0) return { ...q, growth: 0 };
      const prev = recentQuarters[idx - 1];
      return {
        ...q,
        growth: ((q.amount - prev!.amount) / prev!.amount) * 100,
      };
    });

    return {
      avgTransactionSize,
      avgDailyRevenue,
      transactionGrowth,
    };
  }, [validData]);

  // 3. CATEGORY STABILITY (Volatility)
  const categoryStability = useMemo(() => {
    if (!dailyData?.quarters) return null;

    const quarters = Object.keys(dailyData.quarters).sort();
    const categoryData: {
      [key: string]: number[];
    } = {
      handel: [],
      matOgOpplevelser: [],
      tjenester: [],
    };

    quarters.forEach((qKey) => {
      const days = dailyData.quarters[qKey];
      const totals = {
        handel: 0,
        matOgOpplevelser: 0,
        tjenester: 0,
      };

      days?.forEach((day) => {
        totals.handel += day.handel;
        totals.matOgOpplevelser += day.matOgOpplevelser;
        totals.tjenester += day.tjenester;
      });

      categoryData.handel!.push(totals.handel);
      categoryData.matOgOpplevelser!.push(totals.matOgOpplevelser);
      categoryData.tjenester!.push(totals.tjenester);
    });

    const calculateCV = (values: number[]) => {
      const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
      const variance =
        values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
        values.length;
      const stdDev = Math.sqrt(variance);
      return (stdDev / mean) * 100;
    };

    return [
      {
        category: 'Handel',
        volatility: calculateCV(categoryData.handel!),
        rating:
          calculateCV(categoryData.handel!) < 15
            ? 'Svært stabil'
            : calculateCV(categoryData.handel!) < 25
              ? 'Stabil'
              : 'Moderat volatil',
      },
      {
        category: 'Mat og Opplevelser',
        volatility: calculateCV(categoryData.matOgOpplevelser!),
        rating:
          calculateCV(categoryData.matOgOpplevelser!) < 15
            ? 'Svært stabil'
            : calculateCV(categoryData.matOgOpplevelser!) < 25
              ? 'Stabil'
              : 'Moderat volatil',
      },
      {
        category: 'Tjenester',
        volatility: calculateCV(categoryData.tjenester!),
        rating:
          calculateCV(categoryData.tjenester!) < 15
            ? 'Svært stabil'
            : calculateCV(categoryData.tjenester!) < 25
              ? 'Stabil'
              : 'Moderat volatil',
      },
    ];
  }, [dailyData]);

  // 4. INVESTMENT TIMING INDICATORS - COMMENTED OUT FOR NOW
  /* const investmentTiming = useMemo(() => {
    const recent4Q = validData.slice(-4);
    const previous4Q = validData.slice(-8, -4);

    const recentAvg =
      recent4Q.reduce((sum, q) => sum + q.amount, 0) / recent4Q.length;
    const previousAvg =
      previous4Q.reduce((sum, q) => sum + q.amount, 0) / previous4Q.length;

    const momentum = ((recentAvg - previousAvg) / previousAvg) * 100;

    const lastQuarter = validData[validData.length - 1]!;
    const yearAgo = validData.find(
      (q) =>
        q.year === lastQuarter.year - 1 && q.quarter === lastQuarter.quarter
    );

    const yoyGrowth = yearAgo && lastQuarter
      ? ((lastQuarter.amount - yearAgo.amount) / yearAgo.amount) * 100
      : 0;

    // Determine phase
    let phase = 'Konsolidering';
    if (momentum > 3 && yoyGrowth > 5) phase = 'Ekspansjon';
    else if (momentum < -3 || yoyGrowth < -5) phase = 'Korreksjon';

    // Recommendation
    let recommendation = '';
    if (phase === 'Ekspansjon') {
      recommendation =
        'Gunstig tid for leieøkninger og oppgraderinger. Markedet er sterkt.';
    } else if (phase === 'Korreksjon') {
      recommendation =
        'Fokuser på leiebeholding og leietakerrelasjoner. Vurder fleksible avtaler.';
    } else {
      recommendation =
        'Stabilt marked. Vurder langsiktige investeringer og vedlikehold.';
    }

    return {
      momentum,
      yoyGrowth,
      phase,
      recommendation,
    };
  }, [validData]); */

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-natural-forest">
          Analyse for Grunneiere
        </h2>
        <p className="mt-2 text-gray-600">
          Innsikter og nøkkeltall for eiendomsforvaltning og
          investeringsbeslutninger
        </p>
      </div>

      {/* 1. TENANT CATEGORY PERFORMANCE */}
      {categoryPerformance && (
        <section>
          <h3 className="mb-6 text-2xl font-bold text-natural-forest">
            Leietakerkategori Analyse
          </h3>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Category Distribution Pie Chart */}
            <Card>
              <CardContent className="p-6">
                <h4 className="mb-4 text-lg font-semibold">
                  Omsetningsfordeling
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryPerformance.distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) =>
                        `${name}: ${percentage}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryPerformance.distribution.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        `${(value / 1_000_000).toFixed(0)}M NOK`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Growth */}
            <Card>
              <CardContent className="p-6">
                <h4 className="mb-4 text-lg font-semibold">
                  Kategorivekst (Første vs Siste halvdel)
                </h4>
                <div className="space-y-4">
                  {categoryPerformance.distribution.map((cat, idx) => (
                    <div key={idx}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium">{cat.name}</span>
                        <span
                          className={`text-sm font-semibold ${
                            cat.growth > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {cat.growth > 0 ? '+' : ''}
                          {cat.growth.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width: `${Math.min(Math.abs(cat.growth), 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Insights */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h4 className="mb-4 text-lg font-semibold">
                Strategiske Anbefalinger
              </h4>
              <div className="space-y-3 text-sm">
                {categoryPerformance.distribution.map((cat, idx) => {
                  let insight = '';
                  if (cat.growth > 10) {
                    insight = `${cat.name} viser sterk vekst (+${cat.growth.toFixed(1)}%). Vurder å allokere mer plass til denne kategorien.`;
                  } else if (cat.growth < -5) {
                    insight = `${cat.name} opplever nedgang (${cat.growth.toFixed(1)}%). Vurder støtte til eksisterende leietakere eller kategoriskifte.`;
                  } else {
                    insight = `${cat.name} holder seg stabil. Oppretthold god balanse i leietakermiksen.`;
                  }
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: COLORS[idx] }}
                      />
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* 2. MARKET STRENGTH INDICATORS */}
      <section>
        <h3 className="mb-6 text-2xl font-bold text-natural-forest">
          Markedsstyrke Indikatorer
        </h3>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">
                Gjennomsnittlig Transaksjon
              </div>
              <div className="mt-2 text-3xl font-bold text-natural-forest">
                {marketStrength.avgTransactionSize.toFixed(0)} NOK
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Siste 2 år (8 kvartaler)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Daglig Omsetning</div>
              <div className="mt-2 text-3xl font-bold text-natural-forest">
                {(marketStrength.avgDailyRevenue / 1_000_000).toFixed(1)}M NOK
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Gjennomsnitt per dag
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Siste Kvartal Vekst</div>
              <div
                className={`mt-2 text-3xl font-bold ${
                  (marketStrength.transactionGrowth[
                    marketStrength.transactionGrowth.length - 1
                  ]?.growth ?? 0) > 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {(marketStrength.transactionGrowth[
                  marketStrength.transactionGrowth.length - 1
                ]?.growth ?? 0) > 0
                  ? '+'
                  : ''}
                {(marketStrength.transactionGrowth[
                  marketStrength.transactionGrowth.length - 1
                ]?.growth ?? 0).toFixed(1)}
                %
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Kvartalsvis endring
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Growth Chart */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h4 className="mb-4 text-lg font-semibold">
              Omsetningsvekst Trend
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={marketStrength.transactionGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarterLabel" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Line
                  type="monotone"
                  dataKey="growth"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Vekst %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* 3. CATEGORY STABILITY */}
      {categoryStability && (
        <section>
          <h3 className="mb-6 text-2xl font-bold text-natural-forest">
            Kategoristabilitet & Risiko
          </h3>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {categoryStability.map((cat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx] }}
                      />
                      <div>
                        <div className="font-semibold">{cat.category}</div>
                        <div className="text-sm text-gray-600">
                          {cat.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-700">
                        {cat.volatility.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        Volatilitet (CV)
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <h5 className="mb-2 font-semibold text-blue-900">
                  Fortolkning
                </h5>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Lav volatilitet (&lt;15%): Svært stabil kategori</li>
                  <li>
                    • Moderat volatilitet (15-25%): Stabil, men noe sesongvariasjon
                  </li>
                  <li>
                    • Høy volatilitet (&gt;25%): Høyere risiko, men også
                    vekstpotensial
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* 4. INVESTMENT TIMING - HIDDEN FOR NOW */}
      {/* <section>
        <h3 className="mb-6 text-2xl font-bold text-natural-forest">
          Investeringstiming & Markedsfase
        </h3>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h4 className="mb-4 text-lg font-semibold">Nåværende Fase</h4>
              <div className="mb-6 text-center">
                <div
                  className={`inline-block rounded-full px-8 py-4 text-2xl font-bold ${
                    investmentTiming.phase === 'Ekspansjon'
                      ? 'bg-green-100 text-green-800'
                      : investmentTiming.phase === 'Korreksjon'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {investmentTiming.phase}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">
                    Momentum (Siste 4Q vs Forrige 4Q)
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      investmentTiming.momentum > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {investmentTiming.momentum > 0 ? '+' : ''}
                    {investmentTiming.momentum.toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">
                    År-over-år Vekst
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      investmentTiming.yoyGrowth > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {investmentTiming.yoyGrowth > 0 ? '+' : ''}
                    {investmentTiming.yoyGrowth.toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h4 className="mb-4 text-lg font-semibold">
                Anbefalt Strategi
              </h4>
              <div className="mb-4 rounded-lg bg-amber-50 p-4">
                <p className="text-sm leading-relaxed text-amber-900">
                  {investmentTiming.recommendation}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <h5 className="font-semibold text-gray-900">
                  Spesifikke Handlingspunkter:
                </h5>
                {investmentTiming.phase === 'Ekspansjon' && (
                  <ul className="list-disc space-y-2 pl-5 text-gray-700">
                    <li>Vurder leieøkninger ved fornying (markedet tåler det)</li>
                    <li>
                      Gjennomfør oppgraderinger som kan øke leieverdi
                    </li>
                    <li>
                      Vær selektiv med nye leietakere - du har forhandlingskraft
                    </li>
                    <li>
                      Vurder utvidelse eller oppkjøp av tilstøtende eiendommer
                    </li>
                  </ul>
                )}
                {investmentTiming.phase === 'Korreksjon' && (
                  <ul className="list-disc space-y-2 pl-5 text-gray-700">
                    <li>Hold på eksisterende leietakere - stabilitet er viktig</li>
                    <li>Vurder fleksible leievilkår for å redusere fraflytting</li>
                    <li>
                      Utsett større investeringer til markedet stabiliseres
                    </li>
                    <li>
                      Forbered strategier for forbedret marked (renovering,
                      markedsføring)
                    </li>
                  </ul>
                )}
                {investmentTiming.phase === 'Konsolidering' && (
                  <ul className="list-disc space-y-2 pl-5 text-gray-700">
                    <li>Fokuser på vedlikehold og leietakertilfredshet</li>
                    <li>
                      Planlegg strategiske oppgraderinger for neste
                      vekstfase
                    </li>
                    <li>Evaluer leietakermiks - vurder justeringer</li>
                    <li>
                      Optimaliser driftskostnader uten å påvirke kvalitet
                    </li>
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* SUMMARY INSIGHTS FOR PROPERTY OWNERS - HIDDEN FOR NOW */}
      {/* <section>
        <Card className="border-2 border-natural-forest/20">
          <CardContent className="p-8">
            <h3 className="mb-6 text-2xl font-bold text-natural-forest">
              🏢 Oppsummering: Hva Betyr Dette for Deg som Grunneier?
            </h3>

            <div className="space-y-6">
              {categoryPerformance && (
                <div>
                  <h4 className="mb-2 font-semibold text-gray-900">
                    1. Leietakermiks Optimalisering
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700">
                    Dine eiendommer genererer{' '}
                    <strong>
                      {(categoryPerformance.totalRevenue / 1_000_000_000).toFixed(
                        1
                      )}
                      B NOK
                    </strong>{' '}
                    i total omsetning fordelt på tre hovedkategorier. Mat og
                    Opplevelser dominerer med{' '}
                    {categoryPerformance.distribution[1]?.percentage}%, fulgt av
                    Handel (
                    {categoryPerformance.distribution[0]?.percentage}%) og
                    Tjenester (
                    {categoryPerformance.distribution[2]?.percentage}%). Denne
                    blandingen gir god diversifisering og stabilitet.
                  </p>
                </div>
              )}

              <div>
                <h4 className="mb-2 font-semibold text-gray-900">
                  2. Markedsposisjon
                </h4>
                <p className="text-sm leading-relaxed text-gray-700">
                  Med gjennomsnittlig daglig omsetning på{' '}
                  <strong>
                    {(marketStrength.avgDailyRevenue / 1_000_000).toFixed(1)}M
                    NOK
                  </strong>
                  , viser Grünerløkka solid markedsstyrke. Gjennomsnittlig
                  transaksjon på{' '}
                  <strong>
                    {marketStrength.avgTransactionSize.toFixed(0)} NOK
                  </strong>{' '}
                  indikerer godt kjøpekraftig publikum.
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-gray-900">
                  3. Risikoprofil
                </h4>
                <p className="text-sm leading-relaxed text-gray-700">
                  Stabilitetsanalysen viser at{' '}
                  {categoryStability &&
                    categoryStability.filter((c) => c.volatility < 20).length}{' '}
                  av 3 kategorier har lav til moderat volatilitet, noe som
                  betyr relativt forutsigbare leieinntekter og lavere risiko
                  for leietakerkonkurs.
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-gray-900">
                  4. Neste Steg
                </h4>
                <p className="text-sm leading-relaxed text-gray-700">
                  Basert på nåværende <strong>{investmentTiming.phase}</strong>
                  -fase: {investmentTiming.recommendation}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-green-50 p-6">
              <h4 className="mb-3 flex items-center gap-2 font-bold text-green-900">
                <span>💡</span> Strategisk Anbefaling
              </h4>
              <p className="text-sm leading-relaxed text-green-800">
                Grünerløkka har vist seg som et robust og attraktivt
                handelsområde med sterk recovery etter COVID-19. Som grunneier
                bør du fokusere på å opprettholde en balansert leietakermiks,
                prioritere kvalitetsleietakere innen vekstende kategorier, og
                utnytte markedsstyrkens moment for verdiskapende
                forbedringer. Data viser at området har potensial for
                fortsatt vekst, spesielt innen Mat og Opplevelser-segmentet.
              </p>
            </div>
          </CardContent>
        </Card>
      </section> */}
    </div>
  );
}
