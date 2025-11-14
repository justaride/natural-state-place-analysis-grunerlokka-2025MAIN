import Image from 'next/image';
import Container from '@/components/ui/Container';
import {
  ArrowUpRight,
  Building2,
  Leaf,
  LineChart,
  RefreshCw,
  Mail,
  PhoneCall,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

export const metadata = {
  title: 'Om Prosjektet',
  description: 'Informasjon om Aspelin Ramm Vulkan Oslo prosjektet',
};

const heroStats = [
  { label: 'Eiendommer i pilot', value: '4 porteføljer' },
  { label: 'Oppdateringsfrekvens', value: 'Månedlige leveranser' },
  { label: 'Dataspor', value: 'Demografi • Marked • Mobilitet' },
];

const specialisations = [
  {
    icon: Building2,
    title: 'Stedsutvikling',
    description:
      'Vi bringer steder og byrom til live med en verdibasert og markedsorientert tilnærming og tydelig identitet.',
  },
  {
    icon: Target,
    title: 'Stedsøkonomi',
    description:
      'Vi kartlegger natur-, menneske- og samfunnsverdi før vi definerer markedsverdi og inntektsplan for stedet.',
  },
  {
    icon: LineChart,
    title: 'Markedsutvikling',
    description:
      'Vi bygger nye bærekraftige forretningsmodeller og strategier for selskaper, verdikjeder og offentlig sektor.',
  },
  {
    icon: Leaf,
    title: 'Bærekraftig økonomi',
    description:
      'Helhetlig økonomisk rådgivning som likestiller natur, mennesker og samfunn med finansielle nøkkeltall.',
  },
  {
    icon: RefreshCw,
    title: 'Sirkulærøkonomi',
    description:
      'Vår Circular Economy-avdeling hjelper organisasjoner over fra lineære til sirkulære verdikjeder med konkrete tiltak.',
  },
];

const caseStudies = [
  {
    title: 'Vulkan – Aspelin Ramm',
    description: 'Langsiktig innsiktsprogram for kontor, hotell og kulturarenaer på Vulkan.',
    stat: '12 mnd dataserier',
    image: '/images/vulkan-arena-hero.jpg',
  },
  {
    title: 'Brenneriveien-kvartalet',
    description: 'Scenarioarbeid for stedsidentitet, leietakerprofil og besøksstrømmer.',
    stat: '3 utviklingsscenarier',
    image: '/images/bellonabygget-hero.webp',
  },
  {
    title: 'Grünerløkka handel',
    description: 'Plaace-data kombinert med feltstudier for å styrke lokal handel og aktørmiks.',
    stat: '450+ aktørdata',
    image: '/images/scandic-hotel-vulkan-hero.jpg',
  },
];

const methodSections = [
  {
    title: 'Omsorgsfull verdiskaping',
    body:
      'Natural State-metoden hjelper deg å løfte ideer inn i et fremtidsrettet og bevisst marked. Vi kartlegger hvilke verdier som finnes i prosjektet, hvordan de kan utvikles, og hvordan vi sikrer optimal verdiskaping – for natur, mennesker, samfunn og marked. Metoden er publisert av Springer Nature.',
  },
  {
    title: 'Verdien av stedet',
    body:
      'Vi definerer total verdi og inntektspotensial gjennom å analysere natur-, menneske- og samfunnsverdi før markedsverdien fastsettes. Deretter utvikler vi en handlingsplan for å realisere verdiene over tid.',
  },
];

const quoteText =
  '“The theory of Natural State is introducing a less accurate but more meaningful economic language... You need to describe the human values, the societal values and the natural values as part of the market structure.”';

const trustHighlights = [
  {
    icon: ShieldCheck,
    title: 'Kontrollert tilgang',
    text: 'Passordbeskyttet portal med logging av endringer og klare rettighetsnivåer.',
  },
  {
    icon: Sparkles,
    title: 'Iterativ utvikling',
    text: 'Design og datasett oppdateres løpende i samarbeid med Aspelin Ramm-teamet.',
  },
  {
    icon: Users,
    title: 'Partnerskap',
    text: 'Felles analyseboard og månedlige arbeidsmøter sikrer kontinuerlig avstemming.',
  },
];

const contactDetails = [
  { icon: Mail, label: 'contact@naturalstate.no', href: 'mailto:contact@naturalstate.no' },
  { icon: PhoneCall, label: '+47 22 38 00 00', href: 'tel:+4722380000' },
];

const clients = [
  { name: 'Aspelin Ramm', logo: '/images/aspelin-ramm-logo.svg' },
  { name: 'Natural State', logo: '/images/natural-state-logo.png' },
];

export default function OmProsjektetPage() {
  return (
    <div className="space-y-16 py-16 md:space-y-20 md:py-24">
      <Container>
        <section className="rounded-3xl bg-gradient-sunrise px-8 py-10 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            Natural State • Aspelin Ramm
          </p>
          <h1 className="mt-4 font-display text-4xl leading-snug md:text-5xl">
            Strategisk partner for verdibasert stedsutvikling på Vulkan
          </h1>
          <p className="mt-4 max-w-3xl text-base text-white/85 md:text-lg">
            Natural State er et strategi- og økonomibyrå med spesialisering innen stedsutvikling, stedsøkonomi og bærekraftig økonomi. Vi kombinerer Plaace-data, feltstudier og Natural State-metoden for å gi Aspelin Ramm kontinuerlig beslutningsstøtte.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xs uppercase tracking-wide text-white/70">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>

      <Container>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-lokka-secondary">Hva vi bidrar med</p>
            <h2 className="mt-2 font-display text-3xl text-lokka-primary">Natural State kompetanse</h2>
          </div>
          <p className="text-sm text-lokka-secondary md:max-w-md">
            Innsikten i portalen er del av et større arbeid der vi kartlegger og utvikler verdier innen natur, mennesker, samfunn og marked.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {specialisations.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-soft">
              <item.icon className="h-8 w-8 text-lokka-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-lokka-primary">{item.title}</h3>
              <p className="mt-2 text-sm text-lokka-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-lokka-secondary">Utvalgte caser</p>
            <h2 className="mt-2 font-display text-3xl text-lokka-primary">Arbeid i og rundt Vulkan</h2>
          </div>
          <p className="text-sm text-lokka-secondary md:max-w-md">
            Casene viser hvordan vi omsetter innsikt til scenarioer, anbefalinger og styringsverktøy for Aspelin Ramm.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {caseStudies.map((caseItem) => (
            <div key={caseItem.title} className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-soft">
              <div className="relative h-48 w-full">
                <Image
                  src={caseItem.image}
                  alt={caseItem.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-wider text-lokka-secondary">
                  {caseItem.stat}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-lokka-primary">{caseItem.title}</h3>
                <p className="mt-2 text-sm text-lokka-secondary">{caseItem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Container>
        <div className="rounded-3xl border border-gray-200/60 bg-white p-6 shadow-soft md:p-10">
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-lokka-secondary">Metode</p>
            <h2 className="font-display text-3xl text-lokka-primary">Natural State-metoden</h2>
            <p className="text-sm text-lokka-secondary">
              Metoden kobler verdiene i natur, mennesker og samfunn direkte til markedsutvikling og økonomi.
            </p>
          </div>
          <div className="space-y-4">
            {methodSections.map((section) => (
              <details key={section.title} className="group rounded-2xl border border-gray-200/60 bg-lokka-light/40 p-4">
                <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-lokka-primary">
                  {section.title}
                  <span className="text-sm text-lokka-secondary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-lokka-secondary">{section.body}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>

      <Container>
        <figure className="rounded-3xl border border-gray-200/60 bg-white p-8 text-center shadow-soft">
          <Quote className="mx-auto h-10 w-10 text-lokka-primary" aria-hidden />
          <blockquote className="mt-4 text-base italic text-lokka-secondary">{quoteText}</blockquote>
          <figcaption className="mt-3 text-sm font-semibold text-lokka-primary">
            Fra “The Kyoto Post-COVID Manifesto For Global Economics”, Springer Nature
          </figcaption>
        </figure>
      </Container>

      <Container>
        <div className="grid gap-6 md:grid-cols-3">
          {trustHighlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-soft">
              <item.icon className="h-8 w-8 text-lokka-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-lokka-primary">{item.title}</h3>
              <p className="mt-2 text-sm text-lokka-secondary">{item.text}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container>
        <div className="rounded-3xl border border-gray-200/60 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-lokka-secondary">Kunder og samarbeid</p>
          <h2 className="mt-2 font-display text-3xl text-lokka-primary">Vi bygger verdier sammen</h2>
          <p className="mt-3 text-sm text-lokka-secondary">
            Vi er stolte av å jobbe med partnere som bidrar til verdiskaping for mennesker, steder og planeten.
          </p>
          <div className="mt-6 flex flex-wrap gap-6">
            {clients.map((client) => (
              <div key={client.name} className="flex h-20 items-center rounded-2xl border border-gray-200/70 px-6">
                <Image src={client.logo} alt={client.name} width={140} height={50} className="h-12 w-auto" />
              </div>
            ))}
          </div>
        </div>
      </Container>

      <Container>
        <div className="rounded-3xl border border-gray-200/70 bg-gradient-forest px-6 py-8 text-white shadow-soft md:flex md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Samtal med oss</p>
            <h2 className="mt-3 font-display text-3xl">Klar for neste steg?</h2>
            <p className="mt-3 text-sm text-white/80">
              Vi bistår med nye innsiktsbehov, styremateriell eller konseptutvikling basert på Natural State-metoden.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 md:mt-0">
            {contactDetails.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white transition-colors hover:bg-white/20"
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
