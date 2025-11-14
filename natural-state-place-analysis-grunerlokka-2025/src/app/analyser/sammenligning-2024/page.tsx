import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import TabbedImageViewer from '@/components/analyser/TabbedImageViewer';
import AreaComparisonStats from '@/components/analyser/AreaComparisonStats';
import MultiAreaAktorOversikt from '@/components/analyser/MultiAreaAktorOversikt';
import { loadAnalysis } from '@/lib/place-loader';
import Link from 'next/link';
import Image from 'next/image';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const metadata = {
  title: 'Områdesammenligning 2024',
  description: 'Sammenligning av Grünerløkka, Bjørvika, Sentrum og Majorstuen',
};

export default async function Sammenligning2024Page() {
  const analysis = await loadAnalysis('sammenligning-2024');

  if (!analysis) {
    notFound();
  }

  // Load actor data
  let combinedData = null;
  let areaData: Record<string, any> = {};

  try {
    const basePath = join(process.cwd(), 'src', 'data', 'aktorer', 'sammenligning-2024');

    // Load combined stats
    const combinedPath = join(basePath, 'combined.json');
    const combinedJson = await readFile(combinedPath, 'utf-8');
    combinedData = JSON.parse(combinedJson);

    // Load individual area data
    const areaKeys = ['lokka', 'bjørvika', 'sentrum', 'majorstuen'];
    for (const key of areaKeys) {
      const areaPath = join(basePath, `${key}.json`);
      const areaJson = await readFile(areaPath, 'utf-8');
      areaData[key] = JSON.parse(areaJson);
    }
  } catch (error) {
    console.error('Could not load actor data:', error);
  }

  // Area info for components
  const areaInfo = [
    { key: 'lokka', name: 'Grünerløkka', color: '#2D5F3F' },
    { key: 'bjørvika', name: 'Bjørvika', color: '#4A90E2' },
    { key: 'sentrum', name: 'Sentrum', color: '#E74C3C' },
    { key: 'majorstuen', name: 'Majorstuen', color: '#9B59B6' }
  ];

  // Group screenshots by category (in specified order)
  const oversiktScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'oversikt'
  ) || [];

  const demografiScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'demografi'
  ) || [];

  const besokendeScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'besokende'
  ) || [];

  const bevegelseScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'bevegelse'
  ) || [];

  const konkurranseScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'konkurranse'
  ) || [];

  const korthandelScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'korthandel'
  ) || [];

  const internasjonalScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'internasjonal'
  ) || [];

  return (
    <>
      {/* Hero Image Header Section */}
      <section className="relative overflow-hidden border-b border-gray-200">
        <div className="relative aspect-[21/9] w-full md:aspect-[24/9] lg:aspect-[32/9]">
          {analysis.metadata.heroImage && (
            <Image
              src={analysis.metadata.heroImage}
              alt={analysis.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-50 mix-blend-overlay" />

          {/* Content overlay */}
          <Container className="absolute inset-0 flex flex-col justify-between py-6 md:py-8">
            <div>
              <Link
                href="/analyser"
                className="inline-flex items-center gap-2 text-xs text-white/90 transition-colors hover:text-white md:text-sm"
              >
                <span>←</span> Tilbake til oversikt
              </Link>
            </div>

            <div className="pb-4 md:pb-6">
              <div className="mb-3 md:mb-4">
                <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium backdrop-blur-sm md:text-sm">
                  Områdesammenligning
                </span>
              </div>
              <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-lg md:mb-3 md:text-4xl lg:text-5xl">
                {analysis.title}
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-white/90 drop-shadow-md md:text-lg">
                {analysis.area.displayName}
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* Area Colors Legend */}
      {analysis.area.areas && (
        <section className="border-b border-gray-200/30 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 py-8 md:py-12">
          <Container>
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl font-bold text-natural-forest md:text-3xl">Områder</h2>
              <p className="mt-2 text-sm text-gray-600 md:text-base">
                Fire sentrale bydeler i Oslo
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {analysis.area.areas.map((area) => (
                <div
                  key={area.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md md:rounded-2xl md:p-6 md:hover:-translate-y-1"
                >
                  <div
                    className="absolute right-0 top-0 h-2 w-full"
                    style={{ backgroundColor: area.color }}
                  />
                  <div className="relative mt-4">
                    <div className="mb-2 text-xl font-bold text-natural-forest md:text-2xl">
                      {area.name}
                    </div>
                    <div
                      className="h-1 w-12 rounded-full"
                      style={{ backgroundColor: area.color }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Main Content */}
      <Container className="py-12 md:py-16 lg:py-20">
        {/* 1. Oversikt */}
        {oversiktScreenshots.length > 0 && (
          <TabbedImageViewer
            screenshots={oversiktScreenshots}
            title="Oversikt"
          />
        )}

        {/* 2. Demografi */}
        {demografiScreenshots.length > 0 && (
          <TabbedImageViewer
            screenshots={demografiScreenshots}
            title="Demografi"
          />
        )}

        {/* 3. Besøkende */}
        {besokendeScreenshots.length > 0 && (
          <TabbedImageViewer
            screenshots={besokendeScreenshots}
            title="Besøkende"
          />
        )}

        {/* 4. Bevegelse */}
        {bevegelseScreenshots.length > 0 && (
          <TabbedImageViewer
            screenshots={bevegelseScreenshots}
            title="Bevegelse"
          />
        )}

        {/* 5. Konkurranse */}
        {konkurranseScreenshots.length > 0 && (
          <TabbedImageViewer
            screenshots={konkurranseScreenshots}
            title="Konkurransebildet"
          />
        )}

        {/* 6. Korthandel */}
        {korthandelScreenshots.length > 0 && (
          <TabbedImageViewer
            screenshots={korthandelScreenshots}
            title="Korthandel"
          />
        )}

        {/* 6.5 Aktørkartlegging */}
        {combinedData && Object.keys(areaData).length > 0 && (
          <>
            <AreaComparisonStats data={combinedData} />
            <MultiAreaAktorOversikt areas={areaInfo} areaData={areaData} />
          </>
        )}

        {/* 7. Internasjonal Besøkende */}
        {internasjonalScreenshots.length > 0 && (
          <TabbedImageViewer
            screenshots={internasjonalScreenshots}
            title="Internasjonalt Besøkende"
          />
        )}

        {/* Notes */}
        {analysis.metadata.notater && analysis.metadata.notater.length > 0 && (
          <div className="mt-16">
            <Card>
              <CardContent className="p-6 md:p-8">
                <h3 className="mb-4 text-xl font-bold text-natural-forest md:text-2xl">
                  Viktige notater
                </h3>
                <ul className="list-disc space-y-3 pl-5 text-gray-700">
                  {analysis.metadata.notater.map((note, index) => (
                    <li key={index} className="leading-relaxed">{note}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          Datakilder: {analysis.plaaceData.datakilder.join(', ')} |
          Oppdatert: {new Date(analysis.metadata.sistOppdatert).toLocaleDateString('nb-NO')}
        </div>
      </Container>
    </>
  );
}
