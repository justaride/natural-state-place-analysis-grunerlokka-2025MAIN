import Container from '@/components/ui/Container';
import ImageViewer from '@/components/place/ImageViewer';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    year: string;
  }>;
}

// Definer tilgjengelige år - legg til nye år her når du har data
const AVAILABLE_YEARS = ['2024'];

export async function generateStaticParams() {
  return AVAILABLE_YEARS.map((year) => ({ year }));
}

export async function generateMetadata({ params }: PageProps) {
  const { year } = await params;

  return {
    title: `Place Analyse ${year}`,
    description: `Alle Plaace-grafer og nøkkeldata fra Grünerløkka ${year}`,
  };
}

export default async function PlaceAnalysePage({ params }: PageProps) {
  const { year } = await params;

  // Sjekk om året er tilgjengelig
  if (!AVAILABLE_YEARS.includes(year)) {
    notFound();
  }

  return (
    <>
      {/* Header Section */}
      <section className="border-b border-gray-200/30 bg-gradient-to-br from-natural-forest to-natural-sage py-24 text-white">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/analyser"
              className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              <span>←</span> Tilbake til analyser
            </Link>

            {/* Year Navigation */}
            <div className="flex gap-2">
              {AVAILABLE_YEARS.map((y) => (
                <Link
                  key={y}
                  href={`/place-analyse/${y}`}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    y === year
                      ? 'bg-white text-natural-forest'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {y}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex-1">
              <h1 className="mb-8 text-6xl font-bold tracking-tight">
                Place Analyse {year}
              </h1>
              <p className="max-w-3xl text-xl leading-relaxed text-white/90 mb-6">
                Komplett oversikt over Grünerløkka i {year} basert på Plaace-data.
                Denne rapporten viser besøksmønstre, handel, demografi og internasjonale besøkende gjennom hele året.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur">
                  <span className="font-semibold">Periode:</span> {year}
                </div>
                <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur">
                  <span className="font-semibold">Område:</span> Grünerløkka, Oslo
                </div>
                <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur">
                  <span className="font-semibold">Kilde:</span> Plaace.ai
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-20">
        <div className="space-y-24">
          {/* BEVEGELSE SECTION */}
          <section>
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-natural-forest mb-4">
                Bevegelse og Besøksmønstre
              </h2>
              <p className="text-lg text-gray-600">
                Analyse av besøkende, bevegelsesmønstre og demografisk fordeling på Grünerløkka i {year}.
              </p>
            </div>

            <div className="space-y-16">
              <ImageViewer
                imagePath={`/images/graphs/${year}/bevegelse/nokkeldata.jpg`}
                title={`Bevegelse Nøkkeldata ${year}`}
                description="Nøkkeldata"
                priority={true}
              />

              <ImageViewer
                imagePath={`/images/graphs/${year}/bevegelse/bevegelsesmønster.jpg`}
                title="Gjennomsnittlige daglige besøk"
                description="Bevegelsesmønster"
              />

              <ImageViewer
                imagePath={`/images/graphs/${year}/bevegelse/besok-per-time.jpg`}
                title="Besøk per time i tidsperioden"
                description="Timefordeling"
              />

              <ImageViewer
                imagePath={`/images/graphs/${year}/bevegelse/besok-per-ukedag.jpg`}
                title="Besøk per ukedag i tidsperioden"
                description="Ukedagsfordeling"
              />

              <ImageViewer
                imagePath={`/images/graphs/${year}/bevegelse/alder-kjonn-fordeling.jpg`}
                title="Alders- og kjønnsfordeling (Besøkende)"
                description="Demografi"
              />

              <ImageViewer
                imagePath={`/images/graphs/${year}/bevegelse/arlig-vekst.jpg`}
                title={`Årlig Vekst ${year}`}
                description="Vekst"
              />

              <ImageViewer
                imagePath={`/images/graphs/${year}/bevegelse/indeksert-vekst.jpg`}
                title={`Indeksert Vekst ${year}`}
                description="Indeksert Vekst"
              />
            </div>
          </section>

          {/* MARKED SECTION */}
          <section>
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-natural-forest mb-4">
                Marked og Handel
              </h2>
              <p className="text-lg text-gray-600">
                Analyse av korthandel og handelsmønstre på Grünerløkka i {year}.
              </p>
            </div>

            <div className="space-y-16">
              <ImageViewer
                imagePath={`/images/graphs/${year}/marked/korthandel-nokkeldata.jpg`}
                title={`Korthandel ${year} Nøkkeldata`}
                description="Nøkkeldata"
              />

              <ImageViewer
                imagePath={`/images/graphs/${year}/marked/korthandel-detaljer.jpg`}
                title={`Korthandel ${year} (Detaljert)`}
                description="Detaljert Analyse"
              />

              <ImageViewer
                imagePath={`/images/graphs/${year}/marked/korthandel-per-ukedag.jpg`}
                title={`Korthandel per ukedag ${year}`}
                description="Ukedagsfordeling"
              />
            </div>
          </section>

          {/* GEOGRAFI / INTERNASJONALE BESØKENDE SECTION */}
          <section>
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-natural-forest mb-4">
                Geografi og Internasjonale Besøkende
              </h2>
              <p className="text-lg text-gray-600">
                Analyse av hvor besøkende kommer fra, med fokus på internasjonale besøkende fordelt på kvartaler.
              </p>
            </div>

            <div className="space-y-16">
              <ImageViewer
                imagePath={`/images/graphs/${year}/geografi/omrader-besokende.jpg`}
                title={`Områder besøkende kommer fra (Totalt) ${year}`}
                description="Oversikt"
              />

              {/* Q1 */}
              <div className="border-t-4 border-natural-sage pt-12">
                <h3 className="text-3xl font-bold text-natural-forest mb-8">
                  Kvartal 1 (Januar - Mars)
                </h3>

                <ImageViewer
                  imagePath={`/images/graphs/${year}/geografi/kvartal/q1/topp-5-land.jpg`}
                  title={`Topp 5 Land Q1 ${year}`}
                  description="Topp 5"
                />

                <ImageViewer
                  imagePath={`/images/graphs/${year}/geografi/kvartal/q1/topp-20-land.jpg`}
                  title={`Topp 20 Land Q1 ${year}`}
                  description="Topp 20"
                />
              </div>

              {/* Q2 */}
              <div className="border-t-4 border-natural-sage pt-12">
                <h3 className="text-3xl font-bold text-natural-forest mb-8">
                  Kvartal 2 (April - Juni)
                </h3>

                <ImageViewer
                  imagePath={`/images/graphs/${year}/geografi/kvartal/q2/topp-5-land.jpg`}
                  title={`Topp 5 Land Q2 ${year}`}
                  description="Topp 5"
                />

                <ImageViewer
                  imagePath={`/images/graphs/${year}/geografi/kvartal/q2/topp-20-land.jpg`}
                  title={`Topp 20 Land Q2 ${year}`}
                  description="Topp 20"
                />
              </div>

              {/* Q3 */}
              <div className="border-t-4 border-natural-sage pt-12">
                <h3 className="text-3xl font-bold text-natural-forest mb-8">
                  Kvartal 3 (Juli - September)
                </h3>

                <ImageViewer
                  imagePath={`/images/graphs/${year}/geografi/kvartal/q3/topp-5-land.jpg`}
                  title={`Topp 5 Land Q3 ${year}`}
                  description="Topp 5"
                />

                <ImageViewer
                  imagePath={`/images/graphs/${year}/geografi/kvartal/q3/topp-20-land.jpg`}
                  title={`Topp 20 Land Q3 ${year}`}
                  description="Topp 20"
                />
              </div>

              {/* Q4 */}
              <div className="border-t-4 border-natural-sage pt-12">
                <h3 className="text-3xl font-bold text-natural-forest mb-8">
                  Kvartal 4 (Oktober - Desember)
                </h3>

                <ImageViewer
                  imagePath={`/images/graphs/${year}/geografi/kvartal/q4/topp-5-land.jpg`}
                  title={`Topp 5 Land Q4 ${year}`}
                  description="Topp 5"
                />

                <ImageViewer
                  imagePath={`/images/graphs/${year}/geografi/kvartal/q4/topp-20-land.jpg`}
                  title={`Topp 20 Land Q4 ${year}`}
                  description="Topp 20"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-20 pt-12 border-t border-gray-200 flex items-center justify-between">
          <Link
            href="/analyser"
            className="inline-flex items-center gap-2 text-natural-forest hover:text-natural-sage transition-colors text-lg font-medium"
          >
            <span>←</span> Tilbake til alle analyser
          </Link>

          {/* Year Navigation (Bottom) */}
          <div className="flex gap-2">
            {AVAILABLE_YEARS.map((y) => (
              <Link
                key={y}
                href={`/place-analyse/${y}`}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  y === year
                    ? 'bg-natural-forest text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
