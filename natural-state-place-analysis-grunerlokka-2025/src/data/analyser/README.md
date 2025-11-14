# Analyser Data

This directory contains place analysis data for Grünerløkka.

## File Naming Convention

- Monthly analyses: `YYYY-MM-monthname.json` (e.g., `2025-01-januar.json`)
- Comparative analyses: `comparison-area1-vs-area2.json`
- Event impact: `event-[event-name]-impact.json`
- Timeline entries: `timeline-YYYY.json`
- Media analyses: `media-YYYY-MM.json`

## Data Structure

Each analysis file follows the `PlaceAnalysis` interface defined in `src/types/place-analysis.ts`.

## Adding New Analysis

1. Copy `template.json` (if exists) or an existing analysis
2. Update all fields with new data
3. Ensure `id` matches filename (without .json)
4. Update period dates
5. Add screenshots to `/public/images/analyser/[period]/`
6. Validate data structure matches TypeScript types

## Required Fields

- `id`: Unique identifier matching filename
- `title`: Descriptive title
- `analysisType`: One of 'monthly', 'comparative', 'event-impact', 'timeline', 'media'
- `period`: Time period information
- `area`: Geographic area definition
- `plaaceData`: Core metrics and data
- `metadata`: Creation/update information
