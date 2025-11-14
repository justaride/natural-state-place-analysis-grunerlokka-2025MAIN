/**
 * Media analysis types
 */

export type MediaType = 'article' | 'blog' | 'social' | 'report' | 'video' | 'podcast';
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'mixed';

/**
 * Main media item interface
 */
export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  source: string;
  author?: string;
  publishDate: string; // ISO date
  url?: string;
  excerpt?: string;
  fullText?: string;
  sentiment?: Sentiment;
  sentimentScore?: number; // -1 to 1
  topics: string[];
  keywords: string[];
  relatedAreas?: string[]; // area IDs
  relatedEvents?: string[]; // event IDs
  images?: string[];
  metadata: {
    opprettet: string;
    sistOppdatert: string;
    verified: boolean;
  };
}

/**
 * Aggregated media analysis
 */
export interface MediaAnalysisSummary {
  period: {
    startDate: string;
    endDate: string;
  };
  totalItems: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
    mixed: number;
  };
  topTopics: {
    topic: string;
    count: number;
    sentiment: Sentiment;
  }[];
  sourceBreakdown: {
    source: string;
    count: number;
  }[];
  trendData: {
    date: string;
    count: number;
    sentiment: number; // average sentiment score
  }[];
}

/**
 * Topic analysis
 */
export interface TopicAnalysis {
  topic: string;
  mentions: number;
  sentiment: Sentiment;
  avgSentimentScore: number;
  relatedKeywords: string[];
  timeline: {
    date: string;
    mentions: number;
  }[];
}
