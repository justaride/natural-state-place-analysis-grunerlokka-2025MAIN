#!/usr/bin/env python3
import csv
import json
import re
from collections import defaultdict

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

# Read CSV
aktorer = []
with open('/Users/gabrielboen/Downloads/2024 /LØKKA Området Aktørkartlegging 2024 - Sheet1.csv', 'r', encoding='utf-8') as f:
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

# Create output structure
output = {
    'metadata': {
        'generated': '2024-12-31',
        'source': 'Plaace.ai Aktørkartlegging',
        'totalActors': len(aktorer),
        'totalRevenue': total_omsetning,
        'totalEmployees': total_ansatte,
    },
    'actors': aktorer,
    'categoryStats': category_stats,
}

# Write JSON
with open('/Users/gabrielboen/natural-state-place-analysis-grunerlokka-2025/src/data/aktorer/2024-arsrapport.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"✓ Konvertert {len(aktorer)} aktører til JSON")
print(f"✓ Total omsetning: {total_omsetning} mill NOK")
print(f"✓ Total ansatte: {total_ansatte}")
print(f"✓ Kategorier: {len(category_stats)}")
