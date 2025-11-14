import Image from 'next/image';
import type { Graph } from '@/types/graphs';

interface ComparisonGraphViewProps {
  graphA: Graph;
  graphB: Graph;
  labelA?: string;
  labelB?: string;
  showDifference?: boolean;
  difference?: {
    absolute?: number;
    percentage?: number;
    direction?: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export default function ComparisonGraphView({
  graphA,
  graphB,
  labelA,
  labelB,
  showDifference = false,
  difference,
  className = '',
}: ComparisonGraphViewProps) {
  const getDifferenceColor = (direction?: 'up' | 'down' | 'neutral') => {
    if (!direction) return 'text-gray-600';
    const colors = {
      up: 'text-analysis-up',
      down: 'text-analysis-down',
      neutral: 'text-analysis-neutral',
    };
    return colors[direction];
  };

  const getDifferenceIcon = (direction?: 'up' | 'down' | 'neutral') => {
    if (!direction) return '';
    const icons = {
      up: '↑',
      down: '↓',
      neutral: '→',
    };
    return icons[direction];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Title Section */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-natural-forest mb-2">
          Sammenligning
        </h3>
        <p className="text-gray-600">
          {labelA || graphA.title} vs {labelB || graphB.title}
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Graph A */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-soft">
          <div className="bg-natural-forest p-4 text-white">
            <h4 className="font-semibold">
              {labelA || `${graphA.year || ''} ${graphA.month ? `- ${graphA.month.toString().padStart(2, '0')}` : ''}`}
            </h4>
            <p className="text-sm opacity-90">{graphA.title}</p>
          </div>
          <div className="relative w-full aspect-video bg-gray-100">
            <Image
              src={graphA.path}
              alt={graphA.altText}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {graphA.description && (
            <div className="p-4">
              <p className="text-sm text-gray-600">{graphA.description}</p>
            </div>
          )}
        </div>

        {/* Graph B */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-soft">
          <div className="bg-natural-sage p-4 text-white">
            <h4 className="font-semibold">
              {labelB || `${graphB.year || ''} ${graphB.month ? `- ${graphB.month.toString().padStart(2, '0')}` : ''}`}
            </h4>
            <p className="text-sm opacity-90">{graphB.title}</p>
          </div>
          <div className="relative w-full aspect-video bg-gray-100">
            <Image
              src={graphB.path}
              alt={graphB.altText}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {graphB.description && (
            <div className="p-4">
              <p className="text-sm text-gray-600">{graphB.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Difference Display */}
      {showDifference && difference && (
        <div className="mt-6 rounded-lg border-2 border-gray-200 bg-gray-50 p-6 text-center">
          <div className="text-sm font-medium text-gray-600 mb-2">
            Endring
          </div>
          <div className={`text-4xl font-bold ${getDifferenceColor(difference.direction)}`}>
            {getDifferenceIcon(difference.direction)}
            {difference.percentage !== undefined && (
              <>
                {difference.percentage > 0 ? '+' : ''}
                {difference.percentage.toFixed(1)}%
              </>
            )}
            {difference.absolute !== undefined && difference.percentage === undefined && (
              <>
                {difference.absolute > 0 ? '+' : ''}
                {difference.absolute.toLocaleString('nb-NO')}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
