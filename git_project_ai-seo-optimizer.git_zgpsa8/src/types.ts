export interface SEOResult {
  title: string;
  description: string;
  tags: string[];
  error?: string;
}

export interface AnalysisState {
  loading: boolean;
  result: SEOResult | null;
  error: string | null;
}

export interface ImageUpload {
  id: string;
  file: File;
  preview: string;
  result: SEOResult | null;
}
