import Link from 'next/link';
import Container from '@/components/ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-natural-forest to-natural-sage py-20 text-white">
        <Container>
          <div className="max-w-3xl">
            <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm">
              Natural State Place Analysis 2025
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight">
              Grünerløkka i Forandring
            </h1>
            <p className="mb-8 text-xl text-white/90">
              Omfattende stedsanalyser av Grünerløkka gjennom hele 2025.
              Utforsk månedlige utviklingstrender, sammenlign med andre bydeler,
              analyser hendelsers innvirkning, og følg mediadekningen av området.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/analyser">
                <Button
                  size="lg"
                  className="bg-white text-natural-forest hover:bg-white/90"
                >
                  Utforsk Analyser
                </Button>
              </Link>
              <Link href="/sammenligninger">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-natural-forest"
                >
                  Se Sammenligninger
                </Button>
              </Link>
              <Link href="/om-prosjektet">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-natural-forest"
                >
                  Om Prosjektet
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <Container className="py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-natural-forest">
          Hva du finner her
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="mb-3 text-4xl">📊</div>
              <CardTitle>Månedlige Analyser</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Detaljerte stedsanalyser måned for måned. Følg demografi,
                handel, bevegelsesmønstre og utviklingstrender gjennom hele året.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="mb-3 text-4xl">📈</div>
              <CardTitle>Kvartalsrapporter</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sammenlign banktransaksjoner per kvartal fra 2019-2025.
                Følg trender, se sesongvariasjoner og YoY-vekst.
              </p>
              <Link href="/analyser/kvartalsrapport-banktransaksjoner" className="mt-2 inline-block text-sm text-natural-sage hover:underline">
                Se kvartalsrapport →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="mb-3 text-4xl">⚖️</div>
              <CardTitle>Sammenligninger</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Hvordan står Grünerløkka i forhold til andre bydeler?
                Sammenlign nøkkelmetrikker med Grønland, Majorstuen, Frogner og flere.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="mb-3 text-4xl">📅</div>
              <CardTitle>Hendelsesanalyse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Utforsk hvordan festivaler, åpninger, byggprosjekter og andre
                hendelser påvirker området. Før/etter-analyser og effektmålinger.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>

      {/* About Section */}
      <section className="bg-white py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-natural-forest">
              Et levende datasett for urban utvikling
            </h2>
            <p className="mb-6 text-lg text-gray-600">
              Natural State Place Analysis for Grünerløkka er et helårig
              forsknings- og dokumentasjonsprosjekt som følger et av Oslos
              mest dynamiske områder gjennom 2025.
            </p>
            <p className="mb-8 text-lg text-gray-600">
              Ved å kombinere Plaace-data med hendelsesregistrering,
              mediasporing og komparative analyser bygger vi en omfattende
              forståelse av stedets utvikling, utfordringer og muligheter.
            </p>
            <Link href="/om-prosjektet">
              <Button size="lg">Les mer om prosjektet</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <Container className="py-16">
        <div className="rounded-2xl bg-gradient-to-r from-natural-forest to-natural-sage p-12 text-white text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Klar til å utforske?
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Start med de månedlige analysene eller dykk rett inn i sammenligninger
            mellom ulike bydeler.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/analyser">
              <Button size="lg" variant="primary">
                Se Analyser
              </Button>
            </Link>
            <Link href="/sammenligninger">
              <Button size="lg" variant="outline">
                Sammenlign Områder
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
