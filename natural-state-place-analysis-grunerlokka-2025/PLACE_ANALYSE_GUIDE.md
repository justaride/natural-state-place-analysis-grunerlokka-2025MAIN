# Place Analyse - Guide for å legge til nye år

Denne guiden viser deg hvordan du legger til nye år (f.eks. 2025, 2026) til Place Analyse systemet.

## 📁 Struktur

Place Analyse bruker en dynamisk route-struktur:
```
/place-analyse/[year]
```

Dette betyr at du kan besøke:
- `/place-analyse/2024`
- `/place-analyse/2025`
- `/place-analyse/2026`
- osv...

## 🎯 Legge til et nytt år

### Steg 1: Legg til bilder

Kopier alle grafene for det nye året til:
```
/public/images/graphs/[ÅR]/
```

Følg samme struktur som 2024:

```
/public/images/graphs/2025/
  ├── bevegelse/
  │   ├── nokkeldata.jpg
  │   ├── bevegelsesmønster.jpg
  │   ├── besok-per-time.jpg
  │   ├── besok-per-ukedag.jpg
  │   ├── alder-kjonn-fordeling.jpg
  │   ├── arlig-vekst.jpg
  │   └── indeksert-vekst.jpg
  │
  ├── marked/
  │   ├── korthandel-nokkeldata.jpg
  │   ├── korthandel-detaljer.jpg
  │   └── korthandel-per-ukedag.jpg
  │
  └── geografi/
      ├── omrader-besokende.jpg
      └── kvartal/
          ├── q1/
          │   ├── topp-5-land.jpg
          │   └── topp-20-land.jpg
          ├── q2/
          │   ├── topp-5-land.jpg
          │   └── topp-20-land.jpg
          ├── q3/
          │   ├── topp-5-land.jpg
          │   └── topp-20-land.jpg
          └── q4/
              ├── topp-5-land.jpg
              └── topp-20-land.jpg
```

### Steg 2: Aktiver året i koden

Åpne filen:
```
/src/app/place-analyse/[year]/page.tsx
```

Finn denne linjen (rundt linje 13):
```typescript
const AVAILABLE_YEARS = ['2024'];
```

Legg til det nye året:
```typescript
const AVAILABLE_YEARS = ['2024', '2025'];
```

### Steg 3: Test

1. Start utviklingsserveren hvis den ikke kjører:
   ```bash
   npm run dev
   ```

2. Besøk den nye siden:
   ```
   http://localhost:3000/place-analyse/2025
   ```

3. Sjekk at:
   - Alle bildene vises korrekt
   - Årsnavigasjonen fungerer (knappene øverst og nederst)
   - Overskriften viser riktig år

## 📋 Sjekkliste for nytt år

- [ ] Kopier alle 19 bilder til `/public/images/graphs/[ÅR]/`
- [ ] Sjekk at mappestrukturen er korrekt (bevegelse, marked, geografi)
- [ ] Legg til året i `AVAILABLE_YEARS` array
- [ ] Test siden i nettleseren
- [ ] Sjekk årsnavigasjonen
- [ ] Bekreft at alle bilder vises

## 🎨 Design

Hver Place Analyse side følger denne strukturen:

1. **Header**
   - Tittel: "Place Analyse [ÅR]"
   - Årsnavigering (buttons)
   - Nøkkelinfo (Periode, Område, Kilde)

2. **Hovedinnhold**
   - Bevegelse og Besøksmønstre (7 grafer)
   - Marked og Handel (3 grafer)
   - Geografi og Internasjonale Besøkende (9 grafer)

3. **Footer**
   - Link tilbake til analyser
   - Årsnavigering (buttons)

## 💡 Tips

- **Konsistent navngiving**: Bruk samme filnavn som 2024 for enkelt vedlikehold
- **Bildekvalitet**: Hold samme størrelse og kvalitet som eksisterende bilder
- **Testing**: Test alltid i nettleseren før deployment
- **Backup**: Ta backup av bildene før du laster dem opp

## 🚀 Deployment

Når du er klar for å deploye:

```bash
npm run build
vercel
```

Eller push til GitHub, så bygger Vercel automatisk.

---

**Trenger du hjelp?** Kontakt utviklerne eller åpne en issue på GitHub.
