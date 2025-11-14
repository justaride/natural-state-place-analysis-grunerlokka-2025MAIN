import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { loadAnalysis, getAllAnalysisIds } from '@/lib/place-loader';
import Image from 'next/image';

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllAnalysisIds();
  return ids.map((id) => ({
    id: id,
  }));
}

export async function generateMetadata({ params }: AnalysisPageProps) {
  const { id } = await params;
  const analysis = await loadAnalysis(id);

  if (!analysis) {
    return {
      title: 'Analyse ikke funnet',
    };
  }

  return {
    title: analysis.title,
    description: `Place analysis: ${analysis.title}`,
  };
}

export default async function AnalysisDetailPage({ params }: AnalysisPageProps) {
  const { id } = await params;
  const analysis = await loadAnalysis(id);

  if (!analysis) {
    notFound();
  }

  const formatPeriod = () => {
    if (analysis.period.type === 'month') {
      const monthNames = [
        'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `${monthNames[analysis.period.month! - 1]} ${analysis.period.year}`;
    } else if (analysis.period.type === 'year') {
      return `${analysis.period.year}`;
    } else if (analysis.period.type === 'quarter') {
      return `Q${analysis.period.quarter} ${analysis.period.year}`;
    }
    return analysis.period.label;
  };

  return (
    <>
      {/* Header Section */}
      <section className="border-b border-gray-200 bg-gradient-to-br from-natural-forest to-natural-sage py-12 text-white">
        <Container>
          <div className="mb-4">
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm">
              {formatPeriod()}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold">{analysis.title}</h1>
          <p className="text-lg text-white/90">
            {analysis.area.displayName}
          </p>
        </Container>
      </section>

      {/* Content */}
      <Container className="py-12">
        {/* Key Metrics Dashboard */}
        {analysis.plaaceData.nokkeldata && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-natural-forest">
              Nøkkeldata
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {analysis.plaaceData.nokkeldata.befolkning && (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-500 mb-2">Befolkning</div>
                    <div className="text-3xl font-bold text-natural-forest">
                      {analysis.plaaceData.nokkeldata.befolkning.toLocaleString('nb-NO')}
                    </div>
                  </CardContent>
                </Card>
              )}
              {analysis.plaaceData.nokkeldata.dagligTrafikk && (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-500 mb-2">Daglig trafikk</div>
                    <div className="text-3xl font-bold text-natural-forest">
                      {analysis.plaaceData.nokkeldata.dagligTrafikk.toLocaleString('nb-NO')}
                    </div>
                  </CardContent>
                </Card>
              )}
              {analysis.plaaceData.nokkeldata.besokende && (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-500 mb-2">Besøkende</div>
                    <div className="text-3xl font-bold text-natural-forest">
                      {analysis.plaaceData.nokkeldata.besokende.toLocaleString('nb-NO')}
                    </div>
                  </CardContent>
                </Card>
              )}
              {analysis.plaaceData.nokkeldata.handelsomsetning && (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-500 mb-2">Omsetning</div>
                    <div className="text-3xl font-bold text-natural-forest">
                      {(analysis.plaaceData.nokkeldata.handelsomsetning / 1000000).toFixed(0)}M
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Screenshots/Graphs by Category */}
        {analysis.plaaceData.screenshots && analysis.plaaceData.screenshots.length > 0 && (
          <div className="space-y-12">
            {/* Overview/Nøkkeldata */}
            {analysis.plaaceData.screenshots.filter(s => s.kategori === 'oversikt').length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-natural-forest">
                  Oversikt & Nøkkeldata
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {analysis.plaaceData.screenshots
                    .filter(s => s.kategori === 'oversikt')
                    .map((screenshot) => (
                      <Card key={screenshot.id}>
                        <CardContent className="p-0">
                          <div className="relative aspect-video w-full bg-gray-100">
                            <Image
                              src={screenshot.path}
                              alt={screenshot.beskrivelse}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-natural-forest">
                              {screenshot.filnavn}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                              {screenshot.beskrivelse}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* Bevegelse */}
            {analysis.plaaceData.screenshots.filter(s => s.kategori === 'bevegelse').length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-natural-forest">
                  Bevegelse & Besøkende
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {analysis.plaaceData.screenshots
                    .filter(s => s.kategori === 'bevegelse')
                    .map((screenshot) => (
                      <Card key={screenshot.id}>
                        <CardContent className="p-0">
                          <div className="relative aspect-video w-full bg-gray-100">
                            <Image
                              src={screenshot.path}
                              alt={screenshot.beskrivelse}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-natural-forest">
                              {screenshot.filnavn}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                              {screenshot.beskrivelse}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* Marked */}
            {analysis.plaaceData.screenshots.filter(s => s.kategori === 'marked').length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-natural-forest">
                  Marked & Handel
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {analysis.plaaceData.screenshots
                    .filter(s => s.kategori === 'marked')
                    .map((screenshot) => (
                      <Card key={screenshot.id}>
                        <CardContent className="p-0">
                          <div className="relative aspect-video w-full bg-gray-100">
                            <Image
                              src={screenshot.path}
                              alt={screenshot.beskrivelse}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-natural-forest">
                              {screenshot.filnavn}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                              {screenshot.beskrivelse}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* Demografi */}
            {analysis.plaaceData.screenshots.filter(s => s.kategori === 'demografi').length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-natural-forest">
                  Demografi
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {analysis.plaaceData.screenshots
                    .filter(s => s.kategori === 'demografi')
                    .map((screenshot) => (
                      <Card key={screenshot.id}>
                        <CardContent className="p-0">
                          <div className="relative aspect-video w-full bg-gray-100">
                            <Image
                              src={screenshot.path}
                              alt={screenshot.beskrivelse}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-natural-forest">
                              {screenshot.filnavn}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                              {screenshot.beskrivelse}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* Utvikling */}
            {analysis.plaaceData.screenshots.filter(s => s.kategori === 'utvikling').length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-natural-forest">
                  Utvikling & Trender
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {analysis.plaaceData.screenshots
                    .filter(s => s.kategori === 'utvikling')
                    .map((screenshot) => (
                      <Card key={screenshot.id}>
                        <CardContent className="p-0">
                          <div className="relative aspect-video w-full bg-gray-100">
                            <Image
                              src={screenshot.path}
                              alt={screenshot.beskrivelse}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-natural-forest">
                              {screenshot.filnavn}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                              {screenshot.beskrivelse}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        {analysis.metadata.notater && analysis.metadata.notater.length > 0 && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Notater</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-gray-700">
                  {analysis.metadata.notater.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data Sources */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Datakilder: {analysis.plaaceData.datakilder.join(', ')} |
          Oppdatert: {new Date(analysis.metadata.sistOppdatert).toLocaleDateString('nb-NO')}
        </div>
      </Container>
    </>
  );
}
