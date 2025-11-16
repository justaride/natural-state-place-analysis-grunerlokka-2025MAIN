# Quick Start Guide

## Run the Project

```bash
cd /Users/gabrielboen/natural-state-place-analysis-grunerlokka-2025
npm run dev
```

Then open: http://localhost:3000

## What You'll See

### Home Page (`/`)
- Hero section with Natural State branding
- 4 feature cards explaining the project
- About section
- Call-to-action buttons

### Analyser Page (`/analyser`)
- Grid of analysis cards
- Currently shows 2 monthly analyses (January & February 2025)
- Each card displays key metrics

### Om Prosjektet Page (`/om-prosjektet`)
- Project description
- Methodology
- Data sources
- Team info

## Pages Still To Build

- `/analyser/[id]` - Individual analysis detail view
- `/sammenligninger` - Comparative analyses
- `/tidslinje` - Timeline and events
- `/media` - Media analysis

## Add New Monthly Analysis

1. Copy an existing file in `src/data/analyser/`
2. Update the `id`, `period`, and data
3. Save as `YYYY-MM-monthname.json`
4. It will automatically appear on `/analyser`

## File Locations

**Pages:** `src/app/`
**Components:** `src/components/`
**Data:** `src/data/analyser/`
**Types:** `src/types/`
**Utilities:** `src/lib/`

## Color Scheme

The project uses Natural State colors:
- Forest Green: `natural-forest` (#2C5F2D)
- Sage Green: `natural-sage` (#97BC62)
- Sand: `natural-sand` (#E8DCC4)

## Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## Next Steps

1. View the site in browser
2. Review the structure
3. Decide which feature to build next:
   - Analysis detail page?
   - More sample data?
   - Comparison system?
   - Timeline/events?
4. Let me know what you'd like to work on!
