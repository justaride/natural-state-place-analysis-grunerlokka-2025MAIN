# Graph Reusability Guide

## ✅ Yes! Graphs Can Be Reused Across Pages

Your architecture now supports **fully reusable graphs** that can appear on multiple pages, in different contexts, and in various combinations.

---

## 🎯 How It Works

### 1. **Centralized Graph Registry**

All graphs are registered in `/src/data/graphs/registry.json` with:
- Unique ID for referencing
- Path to image file
- Metadata (category, year, tags, etc.)
- Description and data sources

### 2. **Reference, Don't Duplicate**

When creating analyses, you **reference** graphs by ID instead of duplicating:

```json
// In your 2024 annual report
{
  "screenshots": [
    {
      "graphId": "grunerlokka-demografi-aldersfordeling-2024",
      "context": "Shows age distribution for full year"
    }
  ]
}

// In a comparison analysis
{
  "screenshots": [
    {
      "graphId": "grunerlokka-demografi-aldersfordeling-2024",
      "context": "Baseline for comparison with 2025"
    }
  ]
}
```

### 3. **Components Handle Display**

Use the components anywhere:

```tsx
// Single graph display
<GraphDisplay
  graph={graph}
  showCaption={true}
  size="large"
/>

// Side-by-side comparison
<ComparisonGraphView
  graphA={graph2024}
  graphB={graph2025}
  labelA="2024"
  labelB="2025"
  showDifference={true}
  difference={{ percentage: 12.5, direction: 'up' }}
/>
```

---

## 📁 File Organization for Your 2024 Content

### Recommended Structure

```
/public/images/
  /graphs/
    /2024/
      /demografi/
        - aldersfordeling.jpg          (Reusable!)
        - befolkningsutvikling.jpg     (Reusable!)
        - husholdninger.jpg            (Reusable!)
        - innvandrerandel.jpg          (Reusable!)

      /marked/
        - omsetning-maned.jpg          (Reusable!)
        - omsetning-kategori.jpg       (Reusable!)
        - virksomhetsfordeling.jpg     (Reusable!)
        - prisutviklingen.jpg          (Reusable!)

      /bevegelse/
        - trafikkmønster.jpg           (Reusable!)
        - besokende-tidspunkt.jpg      (Reusable!)
        - oppholdstid.jpg              (Reusable!)
        - transportmidler.jpg          (Reusable!)

      /sosiodemografi/
        - inntektsfordeling.jpg        (Reusable!)
        - utdanningsniva.jpg           (Reusable!)
        - yrkesfordeling.jpg           (Reusable!)

  /analyser/
    /2024-arsrapport/
      - hero.jpg
      - sammendrag.jpg
      - konklusjoner.jpg
```

---

## 🔧 How to Add Your 2024 Content

### Step 1: Prepare Your Graph Images

Export each Plaace graph/chart as a separate JPG/PNG file. Name them descriptively:
- `aldersfordeling.jpg`
- `befolkningsutvikling.jpg`
- `omsetning-maned.jpg`
- etc.

### Step 2: Add to Registry

Edit `/src/data/graphs/registry.json` and add each graph:

```json
{
  "id": "grunerlokka-demografi-aldersfordeling-2024",
  "title": "Aldersfordeling Grünerløkka 2024",
  "path": "/images/graphs/2024/demografi/aldersfordeling.jpg",
  "category": "demografi",
  "type": "chart",
  "year": 2024,
  "description": "Oversikt over aldersfordeling i Grünerløkka per 2024",
  "dataSource": ["SSB", "Plaace.ai"],
  "tags": ["aldersfordeling", "befolkning", "demografi", "2024"],
  "altText": "Søylediagram som viser aldersfordeling i Grünerløkka 2024"
}
```

### Step 3: Reference in Analyses

Create your 2024 analysis file `/src/data/analyser/2024-arsrapport.json`:

```json
{
  "id": "2024-arsrapport",
  "title": "Grünerløkka 2024 - Årsrapport",
  "analysisType": "monthly",
  "period": {
    "type": "year",
    "year": 2024,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "label": "2024"
  },
  "plaaceData": {
    "screenshots": [
      {
        "id": "demografi-1",
        "filnavn": "aldersfordeling",
        "path": "/images/graphs/2024/demografi/aldersfordeling.jpg",
        "beskrivelse": "Aldersfordeling for hele 2024",
        "kategori": "demografi"
      },
      {
        "id": "marked-1",
        "filnavn": "omsetning",
        "path": "/images/graphs/2024/marked/omsetning-maned.jpg",
        "beskrivelse": "Månedlig omsetning gjennom året",
        "kategori": "marked"
      }
      // ... more references
    ]
  }
}
```

### Step 4: Use in Comparisons

Create comparison analysis `/src/data/analyser/comparison-2024-vs-2025.json`:

```json
{
  "id": "comparison-2024-vs-2025",
  "title": "Grünerløkka: 2024 vs 2025",
  "analysisType": "comparative",
  "comparisons": [
    {
      "type": "temporal",
      "compareWith": {
        "id": "2024",
        "name": "2024"
      }
    }
  ],
  "plaaceData": {
    "screenshots": [
      {
        "id": "comp-demografi",
        "filnavn": "demografi-comparison",
        "path": "/images/graphs/2024/demografi/aldersfordeling.jpg",
        "beskrivelse": "2024 baseline",
        "kategori": "demografi"
      },
      {
        "id": "comp-demografi-2025",
        "filnavn": "demografi-2025",
        "path": "/images/graphs/2025/demografi/aldersfordeling.jpg",
        "beskrivelse": "2025 data",
        "kategori": "demografi"
      }
    ]
  }
}
```

---

## 🎨 Display Examples

### Example 1: Single Graph on Analysis Page

```tsx
// In your analysis detail page
import { getGraphById } from '@/lib/graph-registry';
import GraphDisplay from '@/components/place/GraphDisplay';

const graph = await getGraphById('grunerlokka-demografi-aldersfordeling-2024');

return (
  <div>
    <h2>Demografisk Profil</h2>
    <GraphDisplay
      graph={graph}
      showCaption={true}
      showMetadata={true}
      size="large"
    />
  </div>
);
```

### Example 2: Same Graph in Comparison View

```tsx
// In your comparison page
import { getGraphsByIds } from '@/lib/graph-registry';
import ComparisonGraphView from '@/components/place/ComparisonGraphView';

const [graph2024, graph2025] = await getGraphsByIds([
  'grunerlokka-demografi-aldersfordeling-2024',
  'grunerlokka-demografi-aldersfordeling-2025-01'
]);

return (
  <ComparisonGraphView
    graphA={graph2024}
    graphB={graph2025}
    labelA="Hele 2024"
    labelB="Januar 2025"
    showDifference={true}
    difference={{ percentage: 2.3, direction: 'up' }}
  />
);
```

### Example 3: Multiple Graphs in Grid

```tsx
// Display multiple related graphs
import { getGraphsByTags } from '@/lib/graph-registry';

const demografiGraphs = await getGraphsByTags(['demografi', '2024']);

return (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {demografiGraphs.map(graph => (
      <GraphDisplay
        key={graph.id}
        graph={graph}
        size="small"
      />
    ))}
  </div>
);
```

---

## ✅ Benefits of This System

1. **Single Source of Truth**: Update one image file, reflects everywhere
2. **Easy Cross-Referencing**: Use same graph in multiple analyses
3. **Flexible Display**: Show graphs at different sizes in different contexts
4. **Rich Metadata**: Search, filter, and organize by tags, categories, year
5. **Comparison Ready**: Built-in components for side-by-side comparisons
6. **Scalable**: Add hundreds of graphs without duplication

---

## 📝 Checklist for Your 2024 Content

When preparing your 2024 report content:

- [ ] Export each chart/graph as individual image files
- [ ] Organize images into category folders (demografi, marked, bevegelse)
- [ ] Add each graph to the registry with metadata
- [ ] Create 2024 annual analysis JSON file
- [ ] Reference graphs by ID in the analysis
- [ ] Test display on analysis page
- [ ] Create comparison analysis if desired
- [ ] Verify graphs appear correctly in both contexts

---

## 🚀 Ready for Your Content!

The system is now **fully prepared** to receive your 2024 content. Just:

1. **Drop your images** in `/public/images/graphs/2024/`
2. **Register them** in `/src/data/graphs/registry.json`
3. **Reference them** in your analysis JSON files
4. **They'll work everywhere** automatically!

Let me know when you're ready to add the 2024 content and I'll help you set it up! 🎉
