#!/usr/bin/env python3
import csv
import json
import re
from collections import defaultdict
from pathlib import Path

def clean_value(value):
    """Clean multiline values and extract main data"""
    if not value:
        return None
    # Remove newlines and extra spaces
    cleaned = ' '.join(value.split())
    return cleaned.strip()

def parse_omsetning(value):
    """Extract NOK amount from omsetning field"""
    if not value:
        return 0
    match = re.search(r'NOK\s+(\d+)\s+mill', value)
    if match:
        return int(match.group(1))
    return 0

def parse_percentage(value):
    """Extract percentage from YoY or market share"""
    if not value:
        return 0.0
    match = re.search(r'(-?\d+(?:\.\d+)?)\s*%', value)
    if match:
        return float(match.group(1))
    return 0.0

def parse_ansatte(value):
    """Extract employee count"""
    if not value:
        return 0
    match = re.search(r'^(\d+)', value)
    if match:
        return int(match.group(1))
    return 0

def process_csv(csv_path, area_name):
    """Process a single CSV file and return structured data"""
    aktorer = []

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            aktor = {
                'rank': clean_value(row['#']),
                'navn': clean_value(row['Navn']),
                'type': clean_value(row['Type']),
                'adresse': clean_value(row['Adresse']),
                'kommune': clean_value(row['Kommune']),
                'omsetning': parse_omsetning(row['Omsetning']),
                'omsetning_raw': clean_value(row['Omsetning']),
                'yoy_vekst': parse_percentage(row['YoY-vekst']),
                'ansatte': parse_ansatte(row['Ansatte']),
                'ansatte_raw': clean_value(row['Ansatte']),
                'markedsandel': parse_percentage(row['Markedsandel']),
            }
            aktorer.append(aktor)

    # Calculate statistics
    total_omsetning = sum(a['omsetning'] for a in aktorer)
    total_ansatte = sum(a['ansatte'] for a in aktorer)

    # Group by type
    by_type = defaultdict(lambda: {'count': 0, 'omsetning': 0, 'ansatte': 0})
    for aktor in aktorer:
        type_key = aktor['type']
        by_type[type_key]['count'] += 1
        by_type[type_key]['omsetning'] += aktor['omsetning']
        by_type[type_key]['ansatte'] += aktor['ansatte']

    # Convert to regular dict
    category_stats = {k: dict(v) for k, v in by_type.items()}

    return {
        'metadata': {
            'area': area_name,
            'generated': '2024-12-31',
            'source': 'Plaace.ai Aktørkartlegging',
            'totalActors': len(aktorer),
            'totalRevenue': total_omsetning,
            'totalEmployees': total_ansatte,
        },
        'actors': aktorer,
        'categoryStats': category_stats,
    }

# Define areas with their CSV paths and output paths
base_path = Path('/Users/gabrielboen/Downloads/EN SAMMENLIGNING-LØKKA-BJØRVIKA-SENTRUM-MAJORSTUEN-2024')
output_base = Path('/Users/gabrielboen/natural-state-place-analysis-grunerlokka-2025/src/data/aktorer/sammenligning-2024')

areas = [
    {
        'name': 'Løkka',
        'key': 'lokka',
        'csv': base_path / 'En Sammenligning - Aktørkartlegging 2024 - LØKKA  - Sheet1.csv',
        'output': output_base / 'lokka.json',
        'color': '#2D5F3F'
    },
    {
        'name': 'Bjørvika',
        'key': 'bjørvika',
        'csv': base_path / 'En Sammenligning - Aktørkartlegging 2024 - BJØRVIKA  - Sheet1.csv',
        'output': output_base / 'bjørvika.json',
        'color': '#4A90E2'
    },
    {
        'name': 'Sentrum',
        'key': 'sentrum',
        'csv': base_path / 'En Sammenligning - Aktørkartlegging 2024 - SENTRUM  - Sheet1.csv',
        'output': output_base / 'sentrum.json',
        'color': '#E74C3C'
    },
    {
        'name': 'Majorstuen',
        'key': 'majorstuen',
        'csv': base_path / 'En Sammenligning - Aktørkartlegging 2024 - MAJORSTUEN  - Sheet1.csv',
        'output': output_base / 'majorstuen.json',
        'color': '#9B59B6'
    }
]

# Process each area
area_data = {}
total_actors = 0
total_revenue = 0
total_employees = 0

print("Prosesserer aktørdata for fire områder...\n")

for area in areas:
    print(f"📍 Behandler {area['name']}...")
    data = process_csv(area['csv'], area['name'])

    # Save individual JSON
    with open(area['output'], 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # Store for combined file
    area_data[area['key']] = {
        'displayName': area['name'],
        'color': area['color'],
        'totalActors': data['metadata']['totalActors'],
        'totalRevenue': data['metadata']['totalRevenue'],
        'totalEmployees': data['metadata']['totalEmployees'],
        'categoryStats': data['categoryStats']
    }

    total_actors += data['metadata']['totalActors']
    total_revenue += data['metadata']['totalRevenue']
    total_employees += data['metadata']['totalEmployees']

    print(f"   ✓ {data['metadata']['totalActors']} aktører")
    print(f"   ✓ {data['metadata']['totalRevenue']}M NOK omsetning")
    print(f"   ✓ {data['metadata']['totalEmployees']} ansatte\n")

# Create combined file
combined = {
    'metadata': {
        'generated': '2024-12-31',
        'source': 'Plaace.ai Aktørkartlegging',
        'totalAreas': len(areas),
        'totalActors': total_actors,
        'totalRevenue': total_revenue,
        'totalEmployees': total_employees
    },
    'areas': area_data
}

combined_path = output_base / 'combined.json'
with open(combined_path, 'w', encoding='utf-8') as f:
    json.dump(combined, f, ensure_ascii=False, indent=2)

print("=" * 60)
print("✅ FULLFØRT - Aktørdata konvertert til JSON")
print("=" * 60)
print(f"📊 Totalt: {total_actors} aktører på tvers av 4 områder")
print(f"💰 Total omsetning: {total_revenue}M NOK")
print(f"👥 Totalt ansatte: {total_employees}")
print(f"\n📁 Filer lagret i: {output_base}")
