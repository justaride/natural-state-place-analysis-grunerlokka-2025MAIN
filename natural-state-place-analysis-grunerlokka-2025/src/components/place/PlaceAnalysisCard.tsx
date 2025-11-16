import Link from 'next/link';
import Image from 'next/image';
import type { PlaceAnalysis } from '@/types/place-analysis';

interface PlaceAnalysisCardProps {
  analysis: PlaceAnalysis;
}

export default function PlaceAnalysisCard({ analysis }: PlaceAnalysisCardProps) {
  const formatPeriod = (period: PlaceAnalysis['period']) => {
    if (period.type === 'month') {
      const monthNames = [
        'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `${monthNames[period.month! - 1]} ${period.year}`;
    }
    return period.label;
  };

  const getAnalysisTypeLabel = (type: PlaceAnalysis['analysisType']) => {
    const labels = {
      'monthly': 'Månedlig',
      'comparative': 'Sammenligning',
      'event-impact': 'Hendelsesanalyse',
      'timeline': 'Tidslinje',
      'media': 'Media'
    };
    return labels[type];
  };

  const getAnalysisTypeColor = (type: PlaceAnalysis['analysisType']) => {
    const colors = {
      'monthly': 'bg-natural-forest',
      'comparative': 'bg-analysis-highlight',
      'event-impact': 'bg-natural-sage',
      'timeline': 'bg-natural-earth',
      'media': 'bg-analysis-neutral'
    };
    return colors[type];
  };

  // Determine hero image based on analysis type
  const getHeroImage = () => {
    // First check if analysis has heroImage in metadata
    if (analysis.metadata?.heroImage) {
      return analysis.metadata.heroImage;
    }

    // Fallback to hardcoded images for specific analyses
    if (analysis.id === '2024-arsrapport') {
      return '/images/areas/grunerlokka.jpg';
    } else if (analysis.id === 'sammenligning-2024') {
      return '/images/areas/sammenligning-collage.jpg';
    } else if (analysis.id === 'kvartalsrapport-banktransaksjoner') {
      return '/images/analyser/grunerlokka-hero.jpg';
    }
    return null;
  };

  const heroImage = getHeroImage();

  return (
    <Link href={`/analyser/${analysis.id}`} className="group">
      <div className="h-full rounded-2xl border border-gray-200/50 bg-white overflow-hidden shadow-soft transition-all duration-300 hover:shadow-large hover:-translate-y-1">
        {/* Hero Image */}
        {heroImage ? (
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
            <Image
              src={heroImage}
              alt={analysis.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Text overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${getAnalysisTypeColor(analysis.analysisType)} bg-opacity-90`}>
                  {getAnalysisTypeLabel(analysis.analysisType)}
                </span>
              </div>
              <h3 className="text-2xl font-bold drop-shadow-lg">
                {analysis.title}
              </h3>
              <p className="mt-1 text-sm opacity-90">
                {formatPeriod(analysis.period)}
              </p>
            </div>
          </div>
        ) : (
          /* Fallback: Original header design for analyses without hero images */
          <div className="bg-gradient-to-r from-natural-forest to-natural-sage p-6 text-white">
            <div className="mb-2 flex items-center justify-between">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${getAnalysisTypeColor(analysis.analysisType)} text-white`}>
                {getAnalysisTypeLabel(analysis.analysisType)}
              </span>
              <span className="text-sm opacity-80">
                {analysis.area.name}
              </span>
            </div>
            <h3 className="text-2xl font-bold">
              {formatPeriod(analysis.period)}
            </h3>
          </div>
        )}

        <div className="p-6">
          {/* CTA */}
          <div className="flex items-center gap-2 text-sm font-medium text-natural-forest group-hover:gap-3 transition-all">
            <span>Se full analyse</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
