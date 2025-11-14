# Natural State Place Analysis - Grünerløkka 2025

Comprehensive temporal and comparative place analysis of Grünerløkka, Oslo throughout 2025.

## About the Project

This is a year-long research and documentation project following one of Oslo's most dynamic neighborhoods through 2025. By combining monthly place analyses, comparative studies, event impact analyses, and media tracking, we build a unique understanding of how the place develops, changes, and is influenced by various factors.

## Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Zod** - Runtime validation
- **date-fns** - Date utilities

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Project Structure

```
/src
  /app               - Next.js routes and pages
    /analyser        - Analysis listing and detail pages
    /sammenligninger - Comparative analyses
    /tidslinje       - Timeline/events
    /media           - Media analysis
  /components        - React components
    /ui              - Base UI components
    /layout          - Layout components (Header, Footer)
    /place           - Place analysis components
    /maps            - Map visualization components
    /charts          - Chart components
  /lib               - Utilities and helpers
  /types             - TypeScript type definitions
  /data              - Analysis data (JSON)
    /analyser        - Monthly and other analyses
    /events          - Event database
    /media           - Media items
    /sammenligninger - Comparison configurations
  /public            - Static assets
    /images          - Images
    /pdf             - PDF reports
```

## Analysis Types

### 1. Monthly Analyses
Month-by-month snapshots with key metrics, trends, and observations for Grünerløkka.

### 2. Comparative Analyses
Comparison of Grünerløkka with other Oslo areas on specific metrics.

### 3. Event Impact Analyses
Before/after studies of specific events measuring actual impact.

### 4. Media Analyses
Tracking media coverage with sentiment analysis and thematic categorization.

## Adding New Analysis

See `/src/data/analyser/README.md` for detailed instructions on adding new analyses.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run validate:data` - Validate analysis data

## Data Sources

- **Plaace.ai** - Primary source for place data
- **SSB (Statistics Norway)** - Official demographic and socioeconomic data
- **Oslo Municipality** - Municipal data and public documents
- **Media monitoring** - News sources, blogs, and social media

## Deployment

Optimized for deployment on Vercel:

```bash
vercel
```

## License

Private project for Natural State AS.

## Contact

- gabriel@naturalstate.no
- kim@naturalstate.no
- einar@naturalstate.no

---

© 2025 Natural State AS. nature, human, society
