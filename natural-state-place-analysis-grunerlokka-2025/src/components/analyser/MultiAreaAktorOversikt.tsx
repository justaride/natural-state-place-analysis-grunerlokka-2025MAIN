'use client';

import { useState } from 'react';

interface Aktor {
  rank: string;
  navn: string;
  type: string;
  adresse: string;
  kommune: string;
  omsetning: number;
  omsetning_raw: string;
  yoy_vekst: number;
  ansatte: number;
  ansatte_raw: string;
  markedsandel: number;
}

interface CategoryStats {
  count: number;
  omsetning: number;
  ansatte: number;
}

interface AreaData {
  metadata: {
    area: string;
    totalActors: number;
    totalRevenue: number;
    totalEmployees: number;
  };
  actors: Aktor[];
  categoryStats: Record<string, CategoryStats>;
}

interface AreaInfo {
  key: string;
  name: string;
  color: string;
}

interface MultiAreaAktorOversiktProps {
  areas: AreaInfo[];
  areaData: Record<string, AreaData>;
}

export default function MultiAreaAktorOversikt({ areas, areaData }: MultiAreaAktorOversiktProps) {
  const [selectedArea, setSelectedArea] = useState<string>(areas[0]?.key || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllActors, setShowAllActors] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'rank' | 'omsetning' | 'yoy_vekst'>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 20;

  // Get current area data
  const currentData = areaData[selectedArea];
  const currentAreaInfo = areas.find((a) => a.key === selectedArea);

  if (!currentData || !currentAreaInfo) {
    return null;
  }

  // Filter actors by category
  const filteredActors = selectedCategory === 'all'
    ? currentData.actors
    : currentData.actors.filter(a => a.type === selectedCategory);

  // Sort actors
  const sortedActors = [...filteredActors].sort((a, b) => {
    let aVal: number, bVal: number;

    if (sortField === 'rank') {
      aVal = parseInt(a.rank.replace('#', ''));
      bVal = parseInt(b.rank.replace('#', ''));
    } else if (sortField === 'omsetning') {
      aVal = a.omsetning || 0;
      bVal = b.omsetning || 0;
    } else { // yoy_vekst
      aVal = a.yoy_vekst || 0;
      bVal = b.yoy_vekst || 0;
    }

    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Pagination
  const totalPages = Math.ceil(sortedActors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActors = sortedActors.slice(startIndex, endIndex);

  // Show only top 15 by default
  const displayedActors = showAllActors ? paginatedActors : sortedActors.slice(0, 15);

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    setSelectedCategory('all');
    setCurrentPage(1);
    setShowAllActors(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSort = (field: 'rank' | 'omsetning' | 'yoy_vekst') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  // Top 3 categories
  const topCategories = Object.entries(currentData.categoryStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3);

  return (
    <section className="mt-8">
      {/* Area Selector */}
      <div className="mb-6 rounded-xl border border-gray-200/50 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Velg område:
        </label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {areas.map((area) => (
            <button
              key={area.key}
              onClick={() => handleAreaChange(area.key)}
              className={`relative overflow-hidden rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                selectedArea === area.key
                  ? 'border-natural-forest bg-natural-sage/10 text-natural-forest shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div
                className="absolute left-0 top-0 h-full w-1"
                style={{ backgroundColor: area.color }}
              />
              <div className="ml-2">{area.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats for Selected Area */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Antall aktører
          </div>
          <div className="text-2xl font-bold text-natural-forest">
            {currentData.metadata.totalActors}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Total omsetning
          </div>
          <div className="text-2xl font-bold text-natural-forest">
            {currentData.metadata.totalRevenue}M
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Ansatte
          </div>
          <div className="text-2xl font-bold text-natural-forest">
            {currentData.metadata.totalEmployees}
          </div>
        </div>
      </div>

      {/* Top 3 Categories */}
      <div className="mb-6">
        <h4 className="mb-4 text-lg font-bold text-natural-forest">
          Største kategorier i {currentAreaInfo.name}
        </h4>
        <div className="grid gap-4 md:grid-cols-3">
          {topCategories.map(([category, stats], index) => (
            <div
              key={category}
              className="rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xl font-bold text-natural-forest">#{index + 1}</span>
                <span className="rounded-full bg-natural-sage/20 px-3 py-1 text-xs font-medium text-natural-forest">
                  {stats.count} bedrifter
                </span>
              </div>
              <div className="mb-1 text-sm font-semibold text-natural-forest">{category}</div>
              <div className="text-xs text-gray-600">
                Omsetning: {stats.omsetning}M NOK
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="sticky top-0 z-10 mb-6 rounded-xl border border-gray-200/50 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Category Filter */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Kategori:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-natural-forest transition-colors hover:border-natural-forest focus:border-natural-forest focus:outline-none focus:ring-2 focus:ring-natural-forest/20"
            >
              <option value="all">Alle ({currentData.metadata.totalActors})</option>
              {Object.entries(currentData.categoryStats)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([category, stats]) => (
                  <option key={category} value={category}>
                    {category} ({stats.count})
                  </option>
                ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sorter:</span>
            <button
              onClick={() => handleSort('rank')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                sortField === 'rank'
                  ? 'bg-natural-forest text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Rang {sortField === 'rank' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('omsetning')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                sortField === 'omsetning'
                  ? 'bg-natural-forest text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Omsetning {sortField === 'omsetning' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('yoy_vekst')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                sortField === 'yoy_vekst'
                  ? 'bg-natural-forest text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Vekst {sortField === 'yoy_vekst' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {selectedCategory !== 'all' && (
          <div className="mt-3 text-xs text-gray-600">
            Viser {filteredActors.length} {filteredActors.length === 1 ? 'aktør' : 'aktører'} i kategorien <strong>{selectedCategory}</strong>
          </div>
        )}
      </div>

      {/* Actors Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200/50 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold md:px-6">Rang</th>
              <th className="px-4 py-3 font-semibold md:px-6">Navn</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell md:px-6">Type</th>
              <th className="px-4 py-3 font-semibold md:px-6">Omsetning</th>
              <th className="px-4 py-3 font-semibold md:px-6">Vekst</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell md:px-6">Ansatte</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell md:px-6">Andel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayedActors.map((actor) => (
              <tr
                key={actor.rank}
                className="transition-colors hover:bg-natural-sage/5"
              >
                <td className="px-4 py-4 font-bold text-natural-forest md:px-6">
                  {actor.rank}
                </td>
                <td className="px-4 py-4 md:px-6">
                  <div className="font-medium text-natural-forest">{actor.navn}</div>
                  <div className="text-xs text-gray-500">{actor.adresse}</div>
                </td>
                <td className="hidden px-4 py-4 text-gray-600 md:table-cell md:px-6">
                  {actor.type}
                </td>
                <td className="px-4 py-4 font-semibold text-natural-forest md:px-6">
                  {actor.omsetning}M
                </td>
                <td className="px-4 py-4 md:px-6">
                  <span className={`font-medium ${
                    actor.yoy_vekst > 0
                      ? 'text-green-600'
                      : actor.yoy_vekst < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                  }`}>
                    {actor.yoy_vekst > 0 ? '+' : ''}{actor.yoy_vekst}%
                  </span>
                </td>
                <td className="hidden px-4 py-4 text-gray-600 md:table-cell md:px-6">
                  {actor.ansatte}
                </td>
                <td className="hidden px-4 py-4 text-gray-600 md:table-cell md:px-6">
                  {actor.markedsandel.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination / Show More */}
      {sortedActors.length > 15 && (
        <div className="mt-6 text-center">
          {!showAllActors ? (
            <button
              onClick={() => setShowAllActors(true)}
              className="rounded-lg bg-natural-forest px-6 py-3 text-sm font-medium text-white transition-all hover:bg-natural-sage"
            >
              Vis alle {sortedActors.length} aktører
            </button>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-natural-forest transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← Forrige
                </button>
                <span className="text-sm text-gray-600">
                  Side {currentPage} av {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-natural-forest transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Neste →
                </button>
              </div>
              <button
                onClick={() => setShowAllActors(false)}
                className="text-sm text-gray-600 underline hover:text-natural-forest"
              >
                Vis bare topp 15
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
