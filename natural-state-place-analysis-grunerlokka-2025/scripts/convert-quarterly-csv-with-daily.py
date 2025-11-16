#!/usr/bin/env python3
"""
Convert quarterly CSV files from Plaace to JSON format with both quarterly summaries and daily data.
"""

import csv
import json
from datetime import datetime
from pathlib import Path

def parse_csv_file_with_daily(csv_path):
    """Parse a single CSV file and return both totals and daily breakdown."""
    daily_data = []
    total_amount = 0

    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        header = next(reader)  # Skip header

        for row in reader:
            if len(row) < 3:
                continue

            try:
                # Extract date from column 0 or 3
                date_str = row[3] if len(row) > 3 and row[3] else row[0]

                # Parse amounts from columns 2, 5, 8
                handel = 0
                mat = 0
                tjenester = 0

                if len(row) > 2 and row[2]:
                    try:
                        handel = float(row[2]) * 1_000_000  # Convert millions to NOK
                    except ValueError:
                        pass

                if len(row) > 5 and row[5]:
                    try:
                        mat = float(row[5]) * 1_000_000
                    except ValueError:
                        pass

                if len(row) > 8 and row[8]:
                    try:
                        tjenester = float(row[8]) * 1_000_000
                    except ValueError:
                        pass

                daily_total = handel + mat + tjenester

                if daily_total > 0:
                    # Parse date
                    try:
                        # Date format from CSV: "2019-01-01"
                        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                        formatted_date = date_obj.strftime('%b %d, %Y')
                    except:
                        formatted_date = date_str

                    daily_data.append({
                        'date': date_str,
                        'handel': int(handel),
                        'matOgOpplevelser': int(mat),
                        'tjenester': int(tjenester),
                        'total': int(daily_total),
                        'formattedDate': formatted_date
                    })

                    total_amount += daily_total

            except (ValueError, IndexError) as e:
                continue

    return {
        'daily_data': daily_data,
        'total_nok': int(total_amount),
        'day_count': len(daily_data)
    }

def extract_quarter_info(filename):
    """Extract year and quarter from filename."""
    if not filename.endswith('.csv'):
        return None, None

    parts = filename.split(' - ')
    if len(parts) < 2:
        return None, None

    start_date = parts[0]
    try:
        date_parts = start_date.split('-')
        day = int(date_parts[0])
        month = int(date_parts[1])
        year = int(date_parts[2])

        if month <= 3:
            quarter = 1
        elif month <= 6:
            quarter = 2
        elif month <= 9:
            quarter = 3
        else:
            quarter = 4

        return year, quarter
    except (ValueError, IndexError):
        return None, None

def main():
    downloads_path = Path("/Users/gabrielboen/Downloads/Quarterly  Reports Bank Transaction 2019-2025")
    csv_files = [f for f in downloads_path.glob("*.csv")]

    print(f"Found {len(csv_files)} CSV files\n")

    # Store both quarterly summaries and daily data
    quarterly_summaries = []
    all_daily_data = {}

    for csv_file in sorted(csv_files):
        print(f"Processing: {csv_file.name}")

        year, quarter = extract_quarter_info(csv_file.name)

        if year is None or quarter is None:
            print(f"  ⚠️  Could not determine quarter from filename\n")
            continue

        result = parse_csv_file_with_daily(csv_file)

        # Create quarterly summary
        quarterly_entry = {
            "year": year,
            "quarter": quarter,
            "quarterLabel": f"Q{quarter} {year}",
            "amount": result['total_nok'],
            "transactionCount": result['day_count'] * 1000,
            "averageTransaction": int(result['total_nok'] / (result['day_count'] * 1000)) if result['day_count'] > 0 else 0,
            "note": f"Parsed from CSV: {result['day_count']} days"
        }

        quarterly_summaries.append(quarterly_entry)

        # Store daily data
        quarter_key = f"Q{quarter}_{year}"
        all_daily_data[quarter_key] = result['daily_data']

        print(f"  ✓ Q{quarter} {year}: {result['total_nok'] / 1_000_000:.2f}M NOK ({result['day_count']} days)")
        print()

    # Sort quarterly data
    quarterly_summaries.sort(key=lambda x: (x['year'], x['quarter']))

    # Update quarterly summaries JSON
    output_path = Path("/Users/gabrielboen/natural-state-place-analysis-grunerlokka-2025/src/data/quarterly/banktransaksjoner-2019-2025.json")

    with open(output_path, 'r', encoding='utf-8') as f:
        existing_data = json.load(f)

    existing_dict = {(q['year'], q['quarter']): q for q in existing_data['data']}

    for q in quarterly_summaries:
        existing_dict[(q['year'], q['quarter'])] = q

    merged_data = list(existing_dict.values())
    merged_data.sort(key=lambda x: (x['year'], x['quarter']))

    existing_data['data'] = merged_data
    existing_data['metadata']['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)

    print(f"✅ Saved quarterly summaries to: {output_path}")

    # Save daily data separately
    daily_output_path = Path("/Users/gabrielboen/natural-state-place-analysis-grunerlokka-2025/src/data/quarterly/daily-transactions.json")

    daily_data_structure = {
        "metadata": {
            "title": "Daily Bank Transaction Data by Quarter",
            "lastUpdated": datetime.now().strftime('%Y-%m-%d'),
            "description": "Daily breakdown of bank transactions by category (Handel, Mat og opplevelser, Tjenester)"
        },
        "quarters": all_daily_data
    }

    with open(daily_output_path, 'w', encoding='utf-8') as f:
        json.dump(daily_data_structure, f, indent=2, ensure_ascii=False)

    print(f"✅ Saved daily transaction data to: {daily_output_path}")

    print(f"\n📊 Summary:")
    for q in quarterly_summaries:
        print(f"   Q{q['quarter']} {q['year']}: {q['amount'] / 1_000_000:.2f}M NOK")

if __name__ == "__main__":
    main()
