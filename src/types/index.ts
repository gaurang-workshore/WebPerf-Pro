export interface AnalysisResult {
  id: string;
  url: string;
  timestamp: number;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  progress: number;
  performance: PerformanceMetrics;
  security: SecurityAudit;
  authMethod: AuthMethod;
}

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  totalBytes: number;
  requests: number;
  assets: AssetAnalysis[];
  waterfallData: WaterfallItem[];
  coreWebVitals: CoreWebVitals;
}

export interface SecurityAudit {
  score: number;
  issues: SecurityIssue[];
  headers: HeaderAnalysis;
  encryption: EncryptionCheck;
  authentication: AuthAnalysis;
}

export interface AssetAnalysis {
  type: 'html' | 'css' | 'js' | 'image' | 'font' | 'other';
  size: number;
  count: number;
  loadTime: number;
  optimizable: boolean;
}

export interface WaterfallItem {
  name: string;
  startTime: number;
  duration: number;
  size: number;
  type: string;
  status: number;
}

export interface CoreWebVitals {
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
}

export interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  recommendation: string;
}

export interface HeaderAnalysis {
  missing: string[];
  misconfigured: string[];
  secure: string[];
}

export interface EncryptionCheck {
  https: boolean;
  tlsVersion: string;
  certificateValid: boolean;
  hsts: boolean;
}

export interface AuthAnalysis {
  method: string;
  secure: boolean;
  vulnerabilities: string[];
}

export type AuthMethod = 'token' | 'login' | 'interactive' | 'none';

export interface AuthConfig {
  method: AuthMethod;
  credentials?: {
    username?: string;
    password?: string;
    token?: string;
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
  };
}