import Image from 'next/image';
import type { Graph } from '@/types/graphs';

interface GraphDisplayProps {
  graph: Graph;
  showCaption?: boolean;
  showMetadata?: boolean;
  size?: 'small' | 'medium' | 'large' | 'full';
  caption?: string; // Override default caption
  className?: string;
}

export default function GraphDisplay({
  graph,
  showCaption = true,
  showMetadata = false,
  size = 'medium',
  caption,
  className = '',
}: GraphDisplayProps) {
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'w-full',
  };

  const getCategoryColor = (category: Graph['category']) => {
    const colors = {
      demografi: 'text-blue-600',
      marked: 'text-green-600',
      bevegelse: 'text-purple-600',
      sosiodemografi: 'text-orange-600',
      oversikt: 'text-gray-600',
      sammenligning: 'text-yellow-600',
      trend: 'text-pink-600',
    };
    return colors[category] || 'text-gray-600';
  };

  const getCategoryLabel = (category: Graph['category']) => {
    const labels = {
      demografi: 'Demografi',
      marked: 'Marked',
      bevegelse: 'Bevegelse',
      sosiodemografi: 'Sosiodemografi',
      oversikt: 'Oversikt',
      sammenligning: 'Sammenligning',
      trend: 'Trend',
    };
    return labels[category];
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-soft">
        {/* Image */}
        <div className="relative w-full aspect-video bg-gray-100">
          <Image
            src={graph.path}
            alt={graph.altText}
            fill
            className="object-contain"
            sizes={
              size === 'full'
                ? '100vw'
                : size === 'large'
                  ? '(max-width: 1200px) 100vw, 1200px'
                  : size === 'medium'
                    ? '(max-width: 768px) 100vw, 768px'
                    : '(max-width: 448px) 100vw, 448px'
            }
          />
        </div>

        {/* Caption & Metadata */}
        {(showCaption || showMetadata) && (
          <div className="p-4">
            {showCaption && (
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {graph.title}
                </h3>
                {(caption || graph.description) && (
                  <p className="mt-1 text-sm text-gray-600">
                    {caption || graph.description}
                  </p>
                )}
              </div>
            )}

            {showMetadata && (
              <div className="flex flex-wrap gap-2 text-xs">
                <span
                  className={`rounded-full px-2 py-1 font-medium ${getCategoryColor(graph.category)} bg-gray-100`}
                >
                  {getCategoryLabel(graph.category)}
                </span>
                {graph.year && (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                    {graph.year}
                    {graph.month && ` - ${graph.month.toString().padStart(2, '0')}`}
                  </span>
                )}
                {graph.dataSource && graph.dataSource.length > 0 && (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                    Kilde: {graph.dataSource.join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
