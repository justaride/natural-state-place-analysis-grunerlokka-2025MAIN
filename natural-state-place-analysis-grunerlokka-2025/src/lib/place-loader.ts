import fs from 'fs/promises';
import path from 'path';
import type { PlaceAnalysis } from '@/types/place-analysis';

const DATA_DIR = path.join(process.cwd(), 'src/data/analyser');

/**
 * Load all place analyses from data folder
 */
export async function loadAllAnalyses(): Promise<PlaceAnalysis[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(
      (file) => file.endsWith('.json') && file !== 'template.json'
    );

    const analyses = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        return data as PlaceAnalysis;
      })
    );

    // Sort by date (newest first)
    return analyses.sort((a, b) => {
      const dateA = new Date(a.period.startDate);
      const dateB = new Date(b.period.startDate);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error loading analyses:', error);
    return [];
  }
}

/**
 * Load a specific analysis by ID
 */
export async function loadAnalysis(id: string): Promise<PlaceAnalysis | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    return data as PlaceAnalysis;
  } catch (error) {
    console.error(`Error loading analysis ${id}:`, error);
    return null;
  }
}

/**
 * Get all analysis IDs for static generation
 */
export async function getAllAnalysisIds(): Promise<string[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    return files
      .filter((file) => file.endsWith('.json') && file !== 'template.json')
      .map((file) => file.replace('.json', ''));
  } catch (error) {
    console.error('Error getting analysis IDs:', error);
    return [];
  }
}

/**
 * Load analyses by type
 */
export async function loadAnalysesByType(
  type: PlaceAnalysis['analysisType']
): Promise<PlaceAnalysis[]> {
  const allAnalyses = await loadAllAnalyses();
  return allAnalyses.filter((analysis) => analysis.analysisType === type);
}

/**
 * Load analyses by year
 */
export async function loadAnalysesByYear(year: number): Promise<PlaceAnalysis[]> {
  const allAnalyses = await loadAllAnalyses();
  return allAnalyses.filter((analysis) => analysis.period.year === year);
}

/**
 * Get monthly analyses for a specific year
 */
export async function getMonthlyAnalyses(year: number): Promise<PlaceAnalysis[]> {
  const allAnalyses = await loadAnalysesByYear(year);
  return allAnalyses
    .filter((analysis) => analysis.analysisType === 'monthly')
    .sort((a, b) => (a.period.month || 0) - (b.period.month || 0));
}
