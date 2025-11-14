'use client';

interface AreaStats {
  displayName: string;
  color: string;
  totalActors: number;
  totalRevenue: number;
  totalEmployees: number;
}

interface CombinedData {
  metadata: {
    totalAreas: number;
    totalActors: number;
    totalRevenue: number;
    totalEmployees: number;
  };
  areas: Record<string, AreaStats>;
}

interface AreaComparisonStatsProps {
  data: CombinedData;
}

export default function AreaComparisonStats({ data }: AreaComparisonStatsProps) {
  const areaKeys = Object.keys(data.areas);

  return (
    <section className="mt-16 rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white to-natural-sage/5 p-6 shadow-lg md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h3 className="mb-2 text-2xl font-bold text-natural-forest md:text-3xl">
          🏪 Aktørkartlegging - Områdesammenligning
        </h3>
        <p className="text-sm text-gray-600 md:text-base">
          Sammenligning av {data.metadata.totalActors.toLocaleString('nb-NO')} bedrifter på tvers av fire områder
        </p>
      </div>

      {/* Overall Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all hover:shadow-md md:p-6">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:text-xs">
            Totalt antall
          </div>
          <div className="text-2xl font-bold text-natural-forest md:text-3xl">
            {data.metadata.totalActors.toLocaleString('nb-NO')}
          </div>
          <div className="mt-1 text-xs text-gray-600">bedrifter</div>
        </div>

        <div className="rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all hover:shadow-md md:p-6">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:text-xs">
            Total omsetning
          </div>
          <div className="text-2xl font-bold text-natural-forest md:text-3xl">
            {data.metadata.totalRevenue.toLocaleString('nb-NO')}M
          </div>
          <div className="mt-1 text-xs text-gray-600">NOK</div>
        </div>

        <div className="rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all hover:shadow-md md:p-6">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:text-xs">
            Ansatte
          </div>
          <div className="text-2xl font-bold text-natural-forest md:text-3xl">
            {data.metadata.totalEmployees.toLocaleString('nb-NO')}
          </div>
          <div className="mt-1 text-xs text-gray-600">totalt</div>
        </div>

        <div className="rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all hover:shadow-md md:p-6">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:text-xs">
            Områder
          </div>
          <div className="text-2xl font-bold text-natural-forest md:text-3xl">
            {data.metadata.totalAreas}
          </div>
          <div className="mt-1 text-xs text-gray-600">bydeler</div>
        </div>
      </div>

      {/* Area Comparison */}
      <div>
        <h4 className="mb-4 text-lg font-bold text-natural-forest">Sammenligning per område</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {areaKeys.map((key) => {
            const area = data.areas[key];
            if (!area) return null;

            const avgRevenue = Math.round(area.totalRevenue / area.totalActors);
            const percentOfTotal = ((area.totalActors / data.metadata.totalActors) * 100).toFixed(1);

            return (
              <div
                key={key}
                className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md md:p-6"
              >
                {/* Color indicator */}
                <div
                  className="absolute right-0 top-0 h-2 w-full"
                  style={{ backgroundColor: area.color }}
                />

                <div className="mt-4">
                  {/* Area name */}
                  <div className="mb-3 flex items-center justify-between">
                    <h5 className="text-lg font-bold text-natural-forest">{area.displayName}</h5>
                    <span className="rounded-full bg-natural-sage/20 px-2 py-0.5 text-xs font-medium text-natural-forest">
                      {percentOfTotal}%
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aktører:</span>
                      <span className="font-semibold text-natural-forest">
                        {area.totalActors}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Omsetning:</span>
                      <span className="font-semibold text-natural-forest">
                        {area.totalRevenue}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ansatte:</span>
                      <span className="font-semibold text-natural-forest">
                        {area.totalEmployees}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-2">
                      <span className="text-gray-600">Snitt/aktør:</span>
                      <span className="font-semibold text-natural-forest">
                        {avgRevenue}M
                      </span>
                    </div>
                  </div>
                </div>

                {/* Color bar at bottom */}
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
