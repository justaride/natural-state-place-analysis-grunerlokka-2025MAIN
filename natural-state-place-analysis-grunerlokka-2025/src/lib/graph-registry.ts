import fs from 'fs/promises';
import path from 'path';
import type { Graph } from '@/types/graphs';

const GRAPH_REGISTRY_PATH = path.join(process.cwd(), 'src/data/graphs');

/**
 * Load all registered graphs
 */
export async function loadAllGraphs(): Promise<Graph[]> {
  try {
    const registryFile = path.join(GRAPH_REGISTRY_PATH, 'registry.json');
    const content = await fs.readFile(registryFile, 'utf-8');
    const data = JSON.parse(content);
    return data.graphs || [];
  } catch (error) {
    console.error('Error loading graph registry:', error);
    return [];
  }
}

/**
 * Get a specific graph by ID
 */
export async function getGraphById(id: string): Promise<Graph | null> {
  const graphs = await loadAllGraphs();
  return graphs.find((g) => g.id === id) || null;
}

/**
 * Get graphs by category
 */
export async function getGraphsByCategory(
  category: Graph['category']
): Promise<Graph[]> {
  const graphs = await loadAllGraphs();
  return graphs.filter((g) => g.category === category);
}

/**
 * Get graphs by year
 */
export async function getGraphsByYear(year: number): Promise<Graph[]> {
  const graphs = await loadAllGraphs();
  return graphs.filter((g) => g.year === year);
}

/**
 * Get graphs by tags
 */
export async function getGraphsByTags(tags: string[]): Promise<Graph[]> {
  const graphs = await loadAllGraphs();
  return graphs.filter((g) =>
    g.tags && tags.some((tag) => g.tags?.includes(tag))
  );
}

/**
 * Get multiple graphs by IDs
 */
export async function getGraphsByIds(ids: string[]): Promise<Graph[]> {
  const graphs = await loadAllGraphs();
  return graphs.filter((g) => ids.includes(g.id));
}

/**
 * Search graphs by title or description
 */
export async function searchGraphs(query: string): Promise<Graph[]> {
  const graphs = await loadAllGraphs();
  const lowerQuery = query.toLowerCase();
  return graphs.filter(
    (g) =>
      g.title.toLowerCase().includes(lowerQuery) ||
      g.description?.toLowerCase().includes(lowerQuery)
  );
}
