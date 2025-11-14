/**
 * Core type definitions for place analysis
 */

export type AnalysisType = 'monthly' | 'comparative' | 'event-impact' | 'timeline' | 'media';
export type PeriodType = 'month' | 'quarter' | 'year' | 'custom';

/**
 * Main place analysis interface
 */
export interface PlaceAnalysis {
  id: string; // e.g., "2025-01-january" or "comparison-lokka-vs-grunland"
  title: string;
  analysisType: AnalysisType;
  period: TimePeriod;
  area: AreaDefinition;
  plaaceData: PlaaceMetrics;
  comparisons?: ComparisonData[];
  events?: EventReference[];
  media?: MediaReference[];
  metadata: AnalysisMetadata;
}

/**
 * Time period definition
 */
export interface TimePeriod {
  type: PeriodType;
  month?: number; // 1-12
  year: number;
  quarter?: number; // 1-4
  startDate: string; // ISO date
  endDate: string; // ISO date
  label: string; // e.g., "Januar 2025"
}

/**
 * Geographic area definition
 */
export interface AreaDefinition {
  id: string; // e.g., "grunerlokka"
  name: string; // e.g., "Grunerløkka"
  displayName: string; // e.g., "Grünerløkka, Oslo"
  type: 'district' | 'neighborhood' | 'custom';
  coordinates?: {
    lat: number;
    lng: number;
  };
  boundaries?: GeoJSON;
  subAreas?: string[]; // IDs of sub-areas
  description?: string;
}

/**
 * Plaace metrics and data
 */
export interface PlaaceMetrics {
  rapportDato: string; // ISO date
  datakilder: string[];
  screenshots: ScreenshotData[];
  nokkeldata: KeyMetrics;
  demografi?: DemographicMetrics;
  marked?: MarketMetrics;
  bevegelse?: MovementMetrics;
  sosiodemografi?: SociodemographicMetrics;
}

/**
 * Screenshot/image data
 */
export interface ScreenshotData {
  id: string;
  filnavn: string;
  path: string;
  beskrivelse: string;
  kategori: 'oversikt' | 'demografi' | 'marked' | 'bevegelse' | 'sosiodemografi' | 'konkurranse' | 'korthandel' | 'besokende' | 'internasjonal' | 'utvikling' | 'annet';
  timestamp?: string;
}

/**
 * Key summary metrics
 */
export interface KeyMetrics {
  befolkning?: number;
  befolkningVekst?: number; // percentage
  gjennomsnittsinntekt?: number;
  medianinntekt?: number;
  arbeidsledighet?: number; // percentage
  sysselsetting?: number; // percentage
  utdanningsniva?: {
    grunnskole: number;
    videregaende: number;
    universitet: number;
  };
  husholdninger?: number;
  // Place-specific metrics
  dagligTrafikk?: number;
  handelsomsetning?: number;
  besokende?: number;
}

/**
 * Demographic metrics
 */
export interface DemographicMetrics {
  totalBefolkning: number;
  befolkningsutvikling: number; // percentage change
  aldersfordeling: {
    '0-17': number;
    '18-29': number;
    '30-49': number;
    '50-66': number;
    '67+': number;
  };
  husstandsstorrelse: number;
  innvandrerandel?: number;
  familietyper?: {
    aleneboende: number;
    parUtenBarn: number;
    parMedBarn: number;
    ensligForeldere: number;
  };
}

/**
 * Market/commerce metrics
 */
export interface MarketMetrics {
  omsetning?: number;
  omsetningVekst?: number; // percentage
  transaksjoner?: number;
  prisutviklingProsent?: number;
  kvadratmeterpris?: number;
  leieprisKvadratmeter?: number;
  antallVirksomheter?: number;
  virksomhetsfordeling?: {
    kategori: string;
    antall: number;
    omsetning?: number;
  }[];
}

/**
 * Movement/traffic metrics
 */
export interface MovementMetrics {
  dagligTrafikk?: number;
  toppTrafikktimer?: string[];
  gangTrafikk?: number;
  sykkelTrafikk?: number;
  kollektivtrafikk?: number;
  besoksmønster?: {
    ukedag: number;
    helg: number;
  };
  oppholdstid?: {
    gjennomsnitt: number; // minutes
    median: number;
  };
}

/**
 * Sociodemographic metrics
 */
export interface SociodemographicMetrics {
  inntektsfordeling?: {
    kvartil1: number;
    kvartil2: number;
    kvartil3: number;
    kvartil4: number;
  };
  utdanningsnivå?: {
    grunnskole: number;
    videregaende: number;
    bachelor: number;
    master: number;
  };
  yrkesfordeling?: {
    kategori: string;
    andel: number;
  }[];
}

/**
 * Comparison data between areas or time periods
 */
export interface ComparisonData {
  id: string;
  type: 'area' | 'temporal';
  compareWith: {
    id: string;
    name: string;
    type: 'district' | 'neighborhood';
  };
  metrics: {
    metric: string;
    baseline: number;
    comparison: number;
    difference: number;
    percentageDifference: number;
  }[];
  summary: string;
}

/**
 * Event reference for impact analysis
 */
export interface EventReference {
  id: string;
  title: string;
  date: string; // ISO date
  type: 'cultural' | 'commercial' | 'infrastructure' | 'social' | 'policy';
  impactLevel?: 'low' | 'medium' | 'high';
  description?: string;
}

/**
 * Media reference/analysis
 */
export interface MediaReference {
  id: string;
  title: string;
  source: string;
  publishDate: string; // ISO date
  url?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  topics?: string[];
  excerpt?: string;
}

/**
 * Analysis metadata
 */
export interface AnalysisMetadata {
  opprettet: string; // ISO date
  sistOppdatert: string; // ISO date
  status: 'utkast' | 'publisert' | 'arkivert';
  versjon: number;
  forfatter?: string;
  kilde: string[];
  notater?: string[];
  heroImage?: string; // Path to hero image for page header
}

/**
 * Simplified GeoJSON type for boundaries
 */
export interface GeoJSON {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

/**
 * Time series data point for trend analysis
 */
export interface TimeSeriesDataPoint {
  date: string; // ISO date
  value: number;
  label?: string;
}

/**
 * Trend analysis result
 */
export interface TrendAnalysis {
  metric: string;
  dataPoints: TimeSeriesDataPoint[];
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  changePercentage: number;
  summary: string;
}
