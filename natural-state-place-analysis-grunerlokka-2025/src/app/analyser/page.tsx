import Container from '@/components/ui/Container';
import PlaceAnalysisCard from '@/components/place/PlaceAnalysisCard';
import { loadAllAnalyses } from '@/lib/place-loader';

export const metadata = {
  title: 'Analyser',
  description: 'Oversikt over stedsanalyser for Grünerløkka',
};

export default async function AnalyserPage() {
  const analyses = await loadAllAnalyses();

  return (
    <>
      {/* Header Section */}
      <section className="border-b border-gray-200 bg-gradient-to-br from-natural-forest to-natural-sage py-12 text-white">
        <Container>
          <h1 className="mb-4 text-4xl font-bold">Stedsanalyser</h1>
          <p className="text-lg text-white/90">
            Utforsk stedsanalyser for Grünerløkka
          </p>
        </Container>
      </section>

      <Container className="py-12">
        {analyses.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-600">
              Ingen analyser tilgjengelig ennå. Første analyse kommer snart!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-natural-forest">
                {analyses.length} analyse{analyses.length !== 1 ? 'r' : ''}
              </h2>
              {/* TODO: Add filters */}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {analyses.map((analysis) => (
                <PlaceAnalysisCard key={analysis.id} analysis={analysis} />
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
}
