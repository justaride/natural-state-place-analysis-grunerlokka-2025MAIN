# Aktivitetskalender 2024 - Implementeringsguide

## ✅ Hva er gjort

### 1. Data opprettet
- **`/public/data/aktiviteter-2024.json`** - Komplett JSON-fil med:
  - Metadata om alle 156 arrangementer
  - Statistikk per måned og kategori
  - Hierarkisk klassifisering (nivå 1-5)
  - De 7 viktigste arrangementene med full informasjon

### 2. Oppdatert analyse-data
- **`/src/data/analyser/2024-arsrapport.json`** - Oppdatert med:
  - 7 nøkkelarrangementer i `events`-arrayet
  - Oppdaterte datakilder (inkludert aktivitetskartlegging)
  - Nye notater om 156 arrangementer
  - Referanse til fullstendig aktivitetskalender

### 3. Page-komponent klar
- **`/analysis-page-component.tsx`** - Komplett Next.js-komponent med:
  - Events-seksjon som viser nøkkelarrangementer
  - Impact-level badges (høy/middels/lav)
  - Link til fullstendig aktivitetskalender
  - Integrert med eksisterende Plaace-data

---

## 📋 Hva må gjøres manuelt

### Steg 1: Opprett dynamic route for analyser

```bash
mkdir -p src/app/analyser/\[id\]
mv analysis-page-component.tsx src/app/analyser/\[id\]/page.tsx
```

### Steg 2: Test at siden fungerer

```bash
npm run dev
# Gå til: http://localhost:3000/analyser/2024-arsrapport
```

Du skal nå se:
- Nøkkeldata (befolkning, trafikk, besøkende, omsetning)
- **Ny seksjon: "Nøkkelarrangementer 2024"** med 7 events
- Alle Plaace-grafer som før
- Notater inkludert informasjon om 156 arrangementer

### Steg 3: (Valgfritt) Legg til fullstendig aktivitetskalender-side

Du kan lage en dedikert side for aktivitetskalenderen:

```typescript
// src/app/aktiviteter/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aktivitetskalender 2024',
  description: '156 dokumenterte arrangementer på Grünerløkka i 2024',
};

export default async function AktiviteterPage() {
  const response = await fetch('/data/aktiviteter-2024.json');
  const data = await response.json();

  return (
    <div>
      <h1>Grünerløkka Aktivitetskalender 2024</h1>
      <p>{data.metadata.totalEvents} arrangementer dokumentert</p>
      {/* Legg til timeline, charts, filters etc */}
    </div>
  );
}
```

---

## 🎨 Foreslåtte forbedringer

### 1. Lag en timeline-visualisering

Du kan bruke Recharts (allerede installert) til å lage en visuell tidslinje:

```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const monthlyData = [
  { month: 'Jan', events: 0 },
  { month: 'Feb', events: 10 },
  { month: 'Mar', events: 11 },
  // ... etc
];

<BarChart width={600} height={300} data={monthlyData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="events" fill="#588157" />
</BarChart>
```

### 2. Legg til filter-funksjonalitet

```typescript
// Filtrer etter kategori
const [selectedCategory, setSelectedCategory] = useState('alle');

const filteredEvents = events.filter(e =>
  selectedCategory === 'alle' || e.category === selectedCategory
);
```

### 3. Lag hierarki-visualisering

```typescript
// Pie chart som viser fordeling av hierarki-nivåer
const hierarchyData = [
  { name: 'Nivå 1: Mega', value: 7, color: '#214330' },
  { name: 'Nivå 2: Store', value: 15, color: '#588157' },
  { name: 'Nivå 3: Mellomstore', value: 28, color: '#A3B18A' },
  { name: 'Nivå 4: Små', value: 83, color: '#DAD7CD' },
  { name: 'Nivå 5: Mikro', value: 23, color: '#E9ECEF' },
];
```

---

## 📊 Data som er tilgjengelig

### Fra `/public/data/aktiviteter-2024.json`:

```json
{
  "metadata": {
    "totalEvents": 156,
    "hierarkiNivaer": { ... }
  },
  "statistikk": {
    "perManed": {
      "juni": 34,  // Peak month
      "desember": 33,
      ...
    },
    "perKategori": {
      "kulturarrangement": 98,
      "marked": 18,
      ...
    },
    "gratisVsBetalt": {
      "betalt": 86,
      "gratis": 57,
      "begge": 13
    },
    "toppLokasjoner": {
      "Blå": 28,
      "Rockefeller/John Dee": 18,
      ...
    }
  },
  "events": [ ... ]
}
```

### Fra `/src/data/analyser/2024-arsrapport.json`:

```json
{
  "events": [
    {
      "id": "oslo-pride-2024",
      "title": "Oslo Pride 2024 (50-årsjubileum)",
      "date": "2024-06-29",
      "type": "cultural",
      "impactLevel": "high",
      "description": "70,000 deltakere..."
    },
    ...
  ]
}
```

---

## 🚀 Deployment til Vercel

Når du er klar:

```bash
git add .
git commit -m "Add activity calendar data and visualizations for 2024"
git push origin main
```

Vercel vil automatisk deploye endringene.

---

## 💡 Tips for videre utvikling

1. **Interaktivt kart**: Bruk Mapbox eller Leaflet til å vise arrangementer geografisk
2. **Søk-funksjon**: La brukere søke etter arrangement etter navn, dato, eller lokasjon
3. **Eksport til kalender**: Tilby iCal-eksport for arrangementer
4. **Sammenligning**: Vis hvordan Grünerløkka skiller seg fra andre områder
5. **Tidsserie-analyse**: Vis trender over flere år (når 2025-data er tilgjengelig)

---

## ❓ Spørsmål?

Kontakt meg hvis du trenger hjelp med:
- TypeScript-typer for events
- Recharts-implementering
- Styling med Tailwind
- Next.js App Router dynamic routes

**Dokumentasjon:**
- Next.js: https://nextjs.org/docs
- Recharts: https://recharts.org/
- Tailwind CSS: https://tailwindcss.com/docs
