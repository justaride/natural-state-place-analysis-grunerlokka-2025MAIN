import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import TabbedImageViewer from '@/components/analyser/TabbedImageViewer';
import AktorOversikt from '@/components/analyser/AktorOversikt';
import { loadAnalysis } from '@/lib/place-loader';
import Link from 'next/link';
import Image from 'next/image';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const metadata = {
  title: 'Grünerløkka 2024 - Årsrapport',
  description: 'Komplett stedsanalyse for Grünerløkka 2024',
};

export default async function Analyse2024Page() {
  const analysis = await loadAnalysis('2024-arsrapport');

  if (!analysis) {
    notFound();
  }

  // Load aktør data
  let aktorData = null;
  try {
    const aktorPath = join(process.cwd(), 'src', 'data', 'aktorer', '2024-arsrapport.json');
    const aktorJson = await readFile(aktorPath, 'utf-8');
    aktorData = JSON.parse(aktorJson);
  } catch (error) {
    console.error('Could not load aktør data:', error);
  }

  // Group screenshots by category (in specified order)
  const allKonkurranseScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'konkurranse'
  ) || [];

  // Extract map image separately
  const aktorkartImage = allKonkurranseScreenshots.find(s => s.id === 'konkurranse-aktorer-kart');

  // Remaining konkurranse screenshots (without map)
  const konkurranseScreenshots = allKonkurranseScreenshots.filter(
    s => s.id !== 'konkurranse-aktorer-kart'
  );

  const korthandelScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'korthandel'
  ) || [];

  const bevegelseScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'bevegelse'
  ) || [];

  const besokendeScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'besokende'
  ) || [];

  const internasjonalScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'internasjonal'
  ) || [];

  const utviklingScreenshots = analysis.plaaceData.screenshots?.filter(
    (s) => s.kategori === 'utvikling'
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
                  Årsrapport
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

      {/* Key Metrics Section */}
      {analysis.plaaceData.nokkeldata && (
        <section className="border-b border-gray-200/30 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 py-8 md:py-12">
          <Container>
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl font-bold text-natural-forest md:text-3xl">Nøkkeltall</h2>
              <p className="mt-2 text-sm text-gray-600 md:text-base">
                Viktigste data for Grünerløkka i 2024
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {analysis.plaaceData.nokkeldata.befolkning && (
                <div className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md md:rounded-2xl md:p-6 md:hover:-translate-y-1">
                  <div className="absolute right-3 top-3 text-3xl opacity-20 transition-opacity group-hover:opacity-30 md:right-4 md:top-4 md:text-4xl">
                    👥
                  </div>
                  <div className="relative">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:mb-2 md:text-xs">
                      Befolkning
                    </div>
                    <div className="mb-1 text-2xl font-bold text-natural-forest md:text-4xl">
                      {analysis.plaaceData.nokkeldata.befolkning.toLocaleString('nb-NO')}
                    </div>
                    <div className="text-xs text-gray-600 md:text-sm">
                      Innbyggere
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              )}

              {analysis.plaaceData.nokkeldata.dagligTrafikk && (
                <div className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md md:rounded-2xl md:p-6 md:hover:-translate-y-1">
                  <div className="absolute right-3 top-3 text-3xl opacity-20 transition-opacity group-hover:opacity-30 md:right-4 md:top-4 md:text-4xl">
                    🚶
                  </div>
                  <div className="relative">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:mb-2 md:text-xs">
                      Daglig trafikk
                    </div>
                    <div className="mb-1 text-2xl font-bold text-natural-forest md:text-4xl">
                      {analysis.plaaceData.nokkeldata.dagligTrafikk.toLocaleString('nb-NO')}
                    </div>
                    <div className="text-xs text-gray-600 md:text-sm">
                      Gjennomsnitt
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              )}

              {analysis.plaaceData.nokkeldata.besokende && (
                <div className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md md:rounded-2xl md:p-6 md:hover:-translate-y-1">
                  <div className="absolute right-3 top-3 text-3xl opacity-20 transition-opacity group-hover:opacity-30 md:right-4 md:top-4 md:text-4xl">
                    🌍
                  </div>
                  <div className="relative">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:mb-2 md:text-xs">
                      Besøkende
                    </div>
                    <div className="mb-1 text-2xl font-bold text-natural-forest md:text-4xl">
                      {analysis.plaaceData.nokkeldata.besokende.toLocaleString('nb-NO')}
                    </div>
                    <div className="text-xs text-gray-600 md:text-sm">
                      Totalt 2024
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              )}

              {analysis.plaaceData.nokkeldata.handelsomsetning && (
                <div className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md md:rounded-2xl md:p-6 md:hover:-translate-y-1">
                  <div className="absolute right-3 top-3 text-3xl opacity-20 transition-opacity group-hover:opacity-30 md:right-4 md:top-4 md:text-4xl">
                    💰
                  </div>
                  <div className="relative">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 md:mb-2 md:text-xs">
                      Handelsomsetning
                    </div>
                    <div className="mb-1 flex items-baseline gap-1 md:gap-2">
                      <span className="text-2xl font-bold text-natural-forest md:text-4xl">
                        {(analysis.plaaceData.nokkeldata.handelsomsetning / 1000000).toFixed(0)}
                      </span>
                      <span className="text-sm font-medium text-gray-600 md:text-lg">
                        M kr
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 md:text-sm">
                      Totalt 2024
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Main Content */}
      <Container className="py-12 md:py-16 lg:py-20">
        {/* 1. Konkurranse */}
        <div className="mb-12 md:mb-20">
          <div className="mb-6 md:mb-8">
            <h2 className="mb-2 text-2xl font-bold text-natural-forest md:mb-4 md:text-3xl">
              Konkurransebildet
            </h2>
            <p className="text-xs text-gray-600 md:text-sm">
              Detaljert stedsanalyse med demografi, besøksmønstre og markedsdata
            </p>
          </div>

          {/* Static Map Overview */}
          {aktorkartImage && (
            <div className="mb-8 md:mb-12">
              <div className="mx-auto max-w-4xl">
                <div className="overflow-hidden rounded-2xl border border-gray-200/50 shadow-lg transition-all duration-300 hover:shadow-xl">
                  <Image
                    src={aktorkartImage.path}
                    alt={aktorkartImage.beskrivelse}
                    width={2480}
                    height={3508}
                    className="h-auto w-full transition-transform duration-300 hover:scale-[1.02]"
                    quality={90}
                    priority
                  />
                </div>
                <p className="mt-4 text-center text-sm text-gray-600">
                  {aktorkartImage.beskrivelse}
                </p>
              </div>
            </div>
          )}

          {/* Tabbed Content */}
          {konkurranseScreenshots.length > 0 && (
            <TabbedImageViewer
              screenshots={konkurranseScreenshots}
              title=""
            />
          )}
        </div>

        {/* 2. Korthandel */}
        {korthandelScreenshots.length > 0 && (
          <>
            <TabbedImageViewer
              screenshots={korthandelScreenshots}
              title="Korthandel"
            />
            {/* Aktør Oversikt */}
            {aktorData && (
              <AktorOversikt
                actors={aktorData.actors}
                categoryStats={aktorData.categoryStats}
                metadata={aktorData.metadata}
              />
            )}
          </>
        )}

        {/* 3. Bevegelse */}
        {bevegelseScreenshots.length > 0 && (
          <TabbedImageViewer
            screenshots={bevegelseScreenshots}
            title="Bevegelse"
          />
        )}

        {/* 4. Besøkende */}
        {besokendeScreenshots.length > 0 && (
          <TabbedImageViewer
            screenshots={besokendeScreenshots}
            title="Besøkende"
          />
        )}

        {/* 5. Internasjonal Besøkende */}
        {internasjonalScreenshots.length > 0 && (
          <TabbedImageViewer
            screenshots={internasjonalScreenshots}
            title="Internasjonalt Besøkende"
          />
        )}

        {/* 6. Utvikling */}
        {utviklingScreenshots.length > 0 && (
          <TabbedImageViewer
            screenshots={utviklingScreenshots}
            title="Utvikling & Trender"
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
