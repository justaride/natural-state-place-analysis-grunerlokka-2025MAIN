/**
 * Graph and visualization types for reusable charts/images
 */

export type GraphCategory =
  | 'demografi'
  | 'marked'
  | 'bevegelse'
  | 'sosiodemografi'
  | 'oversikt'
  | 'sammenligning'
  | 'trend';

export type GraphType =
  | 'chart'
  | 'map'
  | 'table'
  | 'infographic'
  | 'screenshot'
  | 'diagram';

/**
 * Reusable graph definition
 */
export interface Graph {
  id: string; // Unique identifier for cross-referencing
  title: string;
  path: string; // Path to image file
  category: GraphCategory;
  type: GraphType;
  year?: number;
  month?: number;
  description?: string;
  dataSource?: string[];
  relatedGraphs?: string[]; // IDs of related graphs
  tags?: string[]; // For searching/filtering
  altText: string; // Accessibility
  metadata?: {
    created: string;
    width?: number;
    height?: number;
    format?: 'jpg' | 'png' | 'svg' | 'webp';
  };
}

/**
 * Graph reference in analyses
 */
export interface GraphReference {
  graphId: string; // References Graph.id
  context?: string; // How this graph relates to this specific analysis
  caption?: string; // Custom caption for this usage
  order?: number; // Display order
}

/**
 * Graph collection for organized display
 */
export interface GraphCollection {
  id: string;
  title: string;
  description?: string;
  graphs: GraphReference[];
  layout?: 'grid' | 'masonry' | 'carousel' | 'timeline';
}

/**
 * Comparison graph pairing
 */
export interface ComparisonGraphPair {
  id: string;
  title: string;
  graphA: GraphReference;
  graphB: GraphReference;
  comparisonMetric?: string;
  difference?: {
    absolute?: number;
    percentage?: number;
    direction?: 'up' | 'down' | 'neutral';
  };
}
