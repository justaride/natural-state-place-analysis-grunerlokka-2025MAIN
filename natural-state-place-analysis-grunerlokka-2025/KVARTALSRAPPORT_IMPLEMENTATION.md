# Kvartalsrapport Banktransaksjoner 2019-2025 - Implementation Guide

## Overview

A new quarterly comparison page has been created for analyzing bank transaction data on Grünerløkka from 2019 to 2025. The page provides comprehensive visualizations comparing quarters across years, showing trends, YoY growth, and seasonal patterns.

## Files Created

### 1. Data Structure Files

**`src/data/analyser/kvartalsrapport-banktransaksjoner.json`**
- Analysis metadata and configuration
- Defines the page structure and content

**`src/data/quarterly/banktransaksjoner-2019-2025.json`**
- Quarterly transaction data (2019 Q1 through 2025 Q1)
- Currently contains placeholder data (all values set to 0)
- **ACTION REQUIRED**: Replace placeholder data with your actual CSV/JSON data

### 2. Components

**`src/components/analyser/QuarterlyComparisonCharts.tsx`**
- Main visualization component
- Features:
  - **Time Series Line Chart**: Shows progression of all quarters from 2019-2025
  - **Quarterly Comparison Bar Chart**: Compares Q1 vs Q1, Q2 vs Q2, etc. across years
  - **YoY Growth Table**: Displays year-over-year percentage changes
  - **Key Statistics**: Total, average, best and worst quarters

### 3. Page

**`src/app/analyser/kvartalsrapport-banktransaksjoner/page.tsx`**
- Main Next.js page for quarterly comparison
- URL: `/analyser/kvartalsrapport-banktransaksjoner`
- Includes:
  - Hero section with title and description
  - Quarter definitions (Q1-Q4) with seasonal context
  - All visualization charts
  - Data upload instructions
  - Important notes section

### 4. Navigation

**Updated `src/app/page.tsx`**
- Added new "Kvartalsrapporter" card on homepage
- Direct link to the quarterly comparison page

## Data Format

### Required Data Structure

```json
{
  "year": 2024,
  "quarter": 1,
  "quarterLabel": "Q1 2024",
  "amount": 987000000,
  "transactionCount": 145000,
  "averageTransaction": 6800
}
```

### Field Descriptions

- **year** (required): The year (2019-2025)
- **quarter** (required): Quarter number (1, 2, 3, or 4)
- **quarterLabel** (required): Human-readable label (e.g., "Q1 2024")
- **amount** (required): Total transaction amount in NOK
- **transactionCount** (optional): Number of transactions
- **averageTransaction** (optional): Average transaction size in NOK

## How to Add Your Data

### Method 1: Direct JSON Editing

1. Open `src/data/quarterly/banktransaksjoner-2019-2025.json`
2. Find the quarter you want to update
3. Replace the placeholder values (0) with your actual data
4. Save the file

### Method 2: CSV Import (Recommended)

Create a Python script to convert your CSV data:

```python
import json
import csv

# Read your CSV file
quarters = []
with open('your_data.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        quarters.append({
            "year": int(row['year']),
            "quarter": int(row['quarter']),
            "quarterLabel": f"Q{row['quarter']} {row['year']}",
            "amount": int(row['amount']),
            "transactionCount": int(row.get('transactionCount', 0)),
            "averageTransaction": int(row.get('averageTransaction', 0))
        })

# Load existing JSON
with open('src/data/quarterly/banktransaksjoner-2019-2025.json', 'r') as f:
    data = json.load(f)

# Update data
data['data'] = quarters

# Save
with open('src/data/quarterly/banktransaksjoner-2019-2025.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
```

### Expected CSV Format

```csv
year,quarter,amount,transactionCount,averageTransaction
2019,1,850000000,125000,6800
2019,2,920000000,138000,6670
2019,3,880000000,132000,6667
2019,4,910000000,140000,6500
...
```

## Features

### 1. Time Series Analysis
- Line chart showing all 25 quarters (2019 Q1 - 2025 Q1)
- Visual trend identification
- Hover tooltips with exact values

### 2. Quarter-over-Quarter Comparison
- Bar chart comparing same quarters across different years
- Easy to spot seasonal patterns
- See which Q1 (winter), Q2 (spring), Q3 (summer), Q4 (fall) performs best

### 3. YoY Growth Calculation
- Automatic calculation of year-over-year growth
- Color-coded: green for positive, red for negative
- Percentage and absolute values
- First year shows "N/A" (no previous year to compare)

### 4. Key Statistics
- **Total Omsetning**: Sum of all quarters
- **Gjennomsnitt per Kvartal**: Average transaction amount
- **Beste Kvartal**: Highest performing quarter
- **Laveste Kvartal**: Lowest performing quarter

## Customization

### Colors
Years are automatically assigned distinct colors:
- 2019: Brown (#8B4513)
- 2020: Crimson (#DC143C) - COVID year
- 2021: Orange (#FF8C00)
- 2022: Green (#32CD32)
- 2023: Royal Blue (#4169E1)
- 2024: Purple (#9370DB)
- 2025: Hot Pink (#FF1493)

### Quarter Definitions
Q1: Januar-Mars (Winter/Early Spring)
Q2: April-Juni (Spring/Early Summer)
Q3: Juli-September (Summer/Early Fall)
Q4: Oktober-Desember (Fall/Winter)

## Testing

The page has been successfully built and is ready for deployment. To test locally:

```bash
cd /Users/gabrielboen/natural-state-place-analysis-grunerlokka-2025
npm run dev
```

Then visit: `http://localhost:3000/analyser/kvartalsrapport-banktransaksjoner`

## Deployment

The page is ready for Vercel deployment. Once you push to GitHub, Vercel will automatically:
1. Build the page
2. Generate static pages
3. Deploy to production

## Next Steps

1. **Add Your Data**: Replace placeholder data in `src/data/quarterly/banktransaksjoner-2019-2025.json`
2. **Test Locally**: Run `npm run dev` and check `/analyser/kvartalsrapport-banktransaksjoner`
3. **Commit Changes**: Use git to commit the new files
4. **Push to GitHub**: Push to trigger Vercel deployment
5. **Verify Live**: Check the live site at your Vercel URL

## Notes

- The visualization component automatically filters out placeholder data (amount === 0)
- If all data is 0, a helpful message directs users to add data
- The page is fully responsive and works on mobile devices
- All charts use the same color scheme as the rest of your site (Natural State theme)

## File Paths Summary

```
src/
├── app/
│   ├── analyser/
│   │   └── kvartalsrapport-banktransaksjoner/
│   │       └── page.tsx                    # Main page
│   └── page.tsx                             # Homepage (updated)
├── components/
│   └── analyser/
│       └── QuarterlyComparisonCharts.tsx    # Visualization component
└── data/
    ├── analyser/
    │   └── kvartalsrapport-banktransaksjoner.json  # Analysis metadata
    └── quarterly/
        └── banktransaksjoner-2019-2025.json        # Quarterly data
```

---

Created: 2025-01-16
Status: ✅ Complete and Ready for Data
Build Status: ✅ Passing
