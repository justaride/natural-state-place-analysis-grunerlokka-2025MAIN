import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import TabbedImageViewer from '@/components/analyser/TabbedImageViewer';
import AktorOversikt from '@/components/analyser/AktorOversikt';
import SimpleEventTimeline from '@/components/analyser/SimpleEventTimeline';
import BankTransactionChart from '@/components/analyser/BankTransactionChart';
import { loadAnalysis } from '@/lib/place-loader';
import { loadEvents, mergeEvents } from '@/lib/event-loader';
import {
  generateBankTransactionData,
  generateVisitorData,
  aggregateToMonthly
} from '@/lib/synthetic-data-generator';
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

  // Load event timeline data
  const allEvents = await loadEvents();
  const timelineEvents = mergeEvents(allEvents, analysis.events || []);

  // Generate synthetic data for visualizations
  // Based on annual totals: 3.97B kr handelsomsetning, ~9M årlige besøkende estimat
  const dailyBankData = generateBankTransactionData();
  const dailyVisitorData = generateVisitorData();

  // Aggregate to monthly for better visualization
  const monthlyBankData = aggregateToMonthly(dailyBankData);
  const monthlyVisitorData = aggregateToMonthly(dailyVisitorData);

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

      {/* Events Section */}
      {analysis.events && analysis.events.length > 0 && (
        <section className="border-b border-gray-200/30 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 py-8 md:py-12">
          <Container>
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl font-bold text-natural-forest md:text-3xl">
                Nøkkelarrangementer 2024
              </h2>
              <p className="mt-2 text-sm text-gray-600 md:text-base">
                De største arrangementene som preget Grünerløkka i 2024
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {analysis.events.map((event) => (
                <div
                  key={event.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md md:rounded-2xl md:p-6 md:hover:-translate-y-1"
                >
                  <div className="mb-3 flex items-start justify-between md:mb-4">
                    <h3 className="text-base font-semibold text-natural-forest md:text-lg">
                      {event.title}
                    </h3>
                    {event.impactLevel && (
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium md:px-3 ${
                          event.impactLevel === 'high'
                            ? 'bg-red-100 text-red-800'
                            : event.impactLevel === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {event.impactLevel === 'high'
                          ? 'Høy påvirkning'
                          : event.impactLevel === 'medium'
                            ? 'Middels'
                            : 'Lav'}
                      </span>
                    )}
                  </div>
                  <p className="mb-3 text-xs text-gray-600 md:text-sm">
                    📅 {new Date(event.date).toLocaleDateString('nb-NO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {event.description && (
                    <p className="text-xs leading-relaxed text-gray-700 md:text-sm">
                      {event.description}
                    </p>
                  )}
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="mt-6 overflow-hidden rounded-xl border border-purple-200/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-4 shadow-sm md:mt-8 md:rounded-2xl md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="mb-2 text-base font-semibold text-natural-forest md:text-lg">
                    Fullstendig aktivitetskalender
                  </h4>
                  <p className="text-xs leading-relaxed text-gray-700 md:text-sm">
                    <strong>156 arrangementer</strong> dokumentert i 2024, hvorav{' '}
                    <strong>7 mega-arrangementer</strong> med 5000+ besøkende hver.{' '}
                    <strong>45%</strong> av alle arrangementer var gratis tilgjengelige.
                  </p>
                </div>
                <a
                  href="/data/aktiviteter-2024.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-natural-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-natural-forest/90 md:px-6 md:py-3"
                >
                  <span>Se fullstendig kalender</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Timeline Section */}
      {timelineEvents && timelineEvents.length > 0 && (
        <section className="border-b border-gray-200/30 bg-gradient-to-br from-green-50/20 via-emerald-50/10 to-teal-50/20 py-8 md:py-12">
          <Container>
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl font-bold text-natural-forest md:text-3xl">
                Aktivitetstidslinje 2024
              </h2>
              <p className="mt-2 text-sm text-gray-600 md:text-base">
                Koordinert visning av banktransaksjoner og {timelineEvents.length} arrangementer gjennom året
              </p>
            </div>

            {/* Synkroniserte grafer */}
            <div className="space-y-3">
              {/* Daglig banktransaksjonsgraf */}
              <BankTransactionChart
                data={dailyBankData}
                height={200}
                color="#3b82f6"
              />

              {/* Månedlig event timeline med overlay */}
              <SimpleEventTimeline
                events={timelineEvents}
                startDate="2024-01-01"
                endDate="2024-12-31"
                bankData={monthlyBankData}
                visitorData={monthlyVisitorData}
              />
            </div>

            {/* Info box */}
            <div className="mt-6 rounded-xl border border-green-200/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50 p-4 md:rounded-2xl md:p-6">
              <h4 className="mb-2 text-base font-semibold text-natural-forest md:text-lg">
                Om visualiseringen
              </h4>
              <div className="space-y-2 text-xs leading-relaxed text-gray-700 md:text-sm">
                <p>
                  <strong>Banktransaksjoner (daglig):</strong> Øvre graf viser daglige korthandel-transaksjoner på Grünerløkka
                  (inkludert +5 Urbant område). Totalt NOK 3,97 milliarder i årlig omsetning. Tydelige ukentlige mønstre
                  med høyere aktivitet i helgene.
                </p>
                <p>
                  <strong>Arrangementer (månedlig):</strong> Nedre graf viser antall arrangementer per måned med grønne bars.
                  Bruk checkboxene for å overlay banktransaksjoner (aggregert til månedlig) og besøkende-data
                  (~9M årlig estimat) for å se korrelasjoner.
                </p>
                <p>
                  <strong>Korrelasjon:</strong> Sammenlign grafene vertikalt for å se hvordan store arrangementer
                  (f.eks. Pride i juni, Løkkadagene i mai) korrelerer med økt økonomisk aktivitet og besøkstall.
                  Dataene er modellert med realistiske sesongvariasjoner og event-påvirkning.
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Media Coverage Section */}
      {analysis.media && analysis.media.length > 0 && (
        <section className="border-b border-gray-200/30 bg-gradient-to-br from-blue-50/30 via-cyan-50/20 to-sky-50/30 py-8 md:py-12">
          <Container>
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl font-bold text-natural-forest md:text-3xl">
                Mediedekning 2024
              </h2>
              <p className="mt-2 text-sm text-gray-600 md:text-base">
                Slik ble Grünerløkka omtalt i norske medier
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {analysis.media.map((article) => (
                <div
                  key={article.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md md:rounded-2xl md:p-6 md:hover:-translate-y-1"
                >
                  <div className="mb-3 flex items-start justify-between md:mb-4">
                    <h3 className="text-base font-semibold text-natural-forest md:text-lg">
                      {article.title}
                    </h3>
                    {article.impactLevel && (
                      <span
                        className={`flex-shrink-0 rounded-full px-2 py-1 text-xs font-medium md:px-3 ${
                          article.impactLevel === 'high'
                            ? 'bg-red-100 text-red-800'
                            : article.impactLevel === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {article.impactLevel === 'high'
                          ? 'Høy påvirkning'
                          : article.impactLevel === 'medium'
                            ? 'Middels'
                            : 'Lav'}
                      </span>
                    )}
                  </div>

                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs md:text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        article.sentiment === 'positiv'
                          ? 'bg-green-100 text-green-800'
                          : article.sentiment === 'negativ'
                            ? 'bg-red-100 text-red-800'
                            : article.sentiment === 'balansert'
                              ? 'bg-blue-100 text-blue-800'
                              : article.sentiment === 'blandet'
                                ? 'bg-yellow-100 text-yellow-800'
                                : article.sentiment === 'kritisk_men_håpefull'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {article.sentiment === 'positiv' && '😊 '}
                      {article.sentiment === 'negativ' && '😟 '}
                      {article.sentiment === 'balansert' && '⚖️ '}
                      {article.sentiment === 'blandet' && '🔀 '}
                      {article.sentiment === 'kritisk_men_håpefull' && '🌅 '}
                      {article.sentiment === 'nøytral' && '📰 '}
                      {article.sentiment === 'positiv' && 'Positiv'}
                      {article.sentiment === 'negativ' && 'Negativ'}
                      {article.sentiment === 'balansert' && 'Balansert'}
                      {article.sentiment === 'blandet' && 'Blandet'}
                      {article.sentiment === 'kritisk_men_håpefull' && 'Kritisk/Håpefull'}
                      {article.sentiment === 'nøytral' && 'Nøytral'}
                    </span>
                    <span className="text-gray-600">
                      📊 {article.antallArtikler} {article.antallArtikler === 1 ? 'artikkel' : 'artikler'}
                    </span>
                  </div>

                  <p className="mb-3 text-xs leading-relaxed text-gray-700 md:text-sm">
                    {article.beskrivelse}
                  </p>

                  {article.publikasjoner && article.publikasjoner.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                      {article.publikasjoner.slice(0, 3).map((pub, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-natural-sage/10 px-2 py-1 text-xs text-natural-forest"
                        >
                          {pub}
                        </span>
                      ))}
                      {article.publikasjoner.length > 3 && (
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          +{article.publikasjoner.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </div>

            {/* Summary Card with Stats */}
            <div className="mt-6 overflow-hidden rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-4 shadow-sm md:mt-8 md:rounded-2xl md:p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="mb-3 text-base font-semibold text-natural-forest md:text-lg">
                    Medieanalyse 2024
                  </h4>
                  <div className="grid gap-3 text-xs sm:grid-cols-2 md:text-sm lg:grid-cols-4">
                    <div>
                      <div className="text-gray-600">Totalt artikler</div>
                      <div className="text-lg font-bold text-natural-forest md:text-xl">89+</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Narrativer</div>
                      <div className="text-lg font-bold text-natural-forest md:text-xl">3</div>
                      <div className="text-xs text-gray-500">Destinasjonen / Problem / Hverdags</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Sentiment</div>
                      <div className="text-lg font-bold text-green-700 md:text-xl">41% positiv</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Toppkategori</div>
                      <div className="text-lg font-bold text-natural-forest md:text-xl">Mat/Drikke</div>
                      <div className="text-xs text-gray-500">28 artikler</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-3 border-t border-blue-200/50 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-relaxed text-gray-700 md:text-sm">
                    Mediebildet er <strong>splittet i tre parallelle fortellinger</strong>:
                    Destinasjonen Løkka (41% positiv), Problem-Løkka (18% negativ), og Hverdags-Løkka (41% nyansert).
                    Analysen viser hvordan disse eksisterer separat og skaper et <strong>merkevare-paradoks</strong>.
                  </p>
                  <a
                    href="/data/mediedekning-2024.json"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-natural-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-natural-forest/90 md:px-6 md:py-3"
                  >
                    <span>Fullstendig medieanalyse</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
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
