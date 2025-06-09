import { AnalysisResult, AuthConfig, PerformanceMetrics, SecurityAudit, AssetAnalysis, WaterfallItem } from '../types';

// Mock data generators for demonstration
const generateMockPerformanceMetrics = (): PerformanceMetrics => {
  const assets: AssetAnalysis[] = [
    { type: 'html', size: 50000, count: 1, loadTime: 200, optimizable: false },
    { type: 'css', size: 125000, count: 3, loadTime: 150, optimizable: true },
    { type: 'js', size: 800000, count: 8, loadTime: 400, optimizable: true },
    { type: 'image', size: 2100000, count: 12, loadTime: 300, optimizable: true },
    { type: 'font', size: 180000, count: 2, loadTime: 100, optimizable: false },
    { type: 'other', size: 45000, count: 5, loadTime: 80, optimizable: false }
  ];

  const waterfallData: WaterfallItem[] = [
    { name: 'document', startTime: 0, duration: 200, size: 50000, type: 'document', status: 200 },
    { name: 'main.css', startTime: 50, duration: 150, size: 45000, type: 'stylesheet', status: 200 },
    { name: 'app.js', startTime: 100, duration: 400, size: 250000, type: 'script', status: 200 },
    { name: 'hero.jpg', startTime: 150, duration: 300, size: 800000, type: 'image', status: 200 },
    { name: 'api/data', startTime: 300, duration: 180, size: 15000, type: 'xhr', status: 200 },
    { name: 'font.woff2', startTime: 250, duration: 100, size: 90000, type: 'font', status: 200 }
  ];

  const lcp = 1200 + Math.random() * 2000;
  const fid = 20 + Math.random() * 200;
  const cls = Math.random() * 0.3;

  return {
    loadTime: Math.round(1500 + Math.random() * 2000),
    firstContentfulPaint: Math.round(800 + Math.random() * 1000),
    largestContentfulPaint: Math.round(lcp),
    cumulativeLayoutShift: Number(cls.toFixed(3)),
    firstInputDelay: Math.round(fid),
    totalBytes: assets.reduce((sum, asset) => sum + asset.size * asset.count, 0),
    requests: assets.reduce((sum, asset) => sum + asset.count, 0),
    assets,
    waterfallData,
    coreWebVitals: {
      lcp: { 
        value: Math.round(lcp), 
        rating: lcp < 2500 ? 'good' : lcp < 4000 ? 'needs-improvement' : 'poor' 
      },
      fid: { 
        value: Math.round(fid), 
        rating: fid < 100 ? 'good' : fid < 300 ? 'needs-improvement' : 'poor' 
      },
      cls: { 
        value: cls, 
        rating: cls < 0.1 ? 'good' : cls < 0.25 ? 'needs-improvement' : 'poor' 
      }
    }
  };
};

const generateMockSecurityAudit = (authMethod: string): SecurityAudit => {
  const baseScore = 70 + Math.random() * 25;
  
  const commonIssues = [
    {
      severity: 'medium' as const,
      type: 'Missing Content Security Policy',
      description: 'The Content-Security-Policy header is not configured, which may allow XSS attacks.',
      recommendation: 'Implement a strict CSP header to prevent code injection attacks.'
    },
    {
      severity: 'low' as const,
      type: 'X-Frame-Options not set',
      description: 'The X-Frame-Options header is missing, potentially allowing clickjacking attacks.',
      recommendation: 'Set X-Frame-Options to DENY or SAMEORIGIN to prevent framing attacks.'
    }
  ];

  const authIssues = authMethod === 'login' ? [
    {
      severity: 'high' as const,
      type: 'Weak Password Policy',
      description: 'The authentication system may not enforce strong password requirements.',
      recommendation: 'Implement strong password policies including minimum length, complexity, and rotation.'
    }
  ] : [];

  return {
    score: Math.round(baseScore),
    issues: [...commonIssues, ...authIssues],
    headers: {
      secure: ['Strict-Transport-Security', 'X-Content-Type-Options'],
      missing: ['Content-Security-Policy', 'X-Frame-Options'],
      misconfigured: ['Referrer-Policy']
    },
    encryption: {
      https: true,
      tlsVersion: 'TLS 1.3',
      certificateValid: true,
      hsts: true
    },
    authentication: {
      method: authMethod,
      secure: authMethod !== 'none',
      vulnerabilities: authMethod === 'login' ? ['Weak password policy'] : []
    }
  };
};

export class PerformanceAnalyzer {
  private currentAnalysis: AnalysisResult | null = null;

  async startAnalysis(url: string, authConfig: AuthConfig): Promise<string> {
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentAnalysis = {
      id: analysisId,
      url,
      timestamp: Date.now(),
      status: 'pending',
      progress: 0,
      performance: {} as PerformanceMetrics,
      security: {} as SecurityAudit,
      authMethod: authConfig.method
    };

    // Simulate analysis process
    this.simulateAnalysis();
    
    return analysisId;
  }

  private async simulateAnalysis(): Promise<void> {
    if (!this.currentAnalysis) return;

    const steps = [
      { progress: 10, status: 'analyzing' as const, step: 'Authenticating' },
      { progress: 25, status: 'analyzing' as const, step: 'Loading page' },
      { progress: 50, status: 'analyzing' as const, step: 'Analyzing performance' },
      { progress: 75, status: 'analyzing' as const, step: 'Running security audit' },
      { progress: 90, status: 'analyzing' as const, step: 'Generating report' },
      { progress: 100, status: 'completed' as const, step: 'Analysis complete' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
      
      if (this.currentAnalysis) {
        this.currentAnalysis.progress = step.progress;
        this.currentAnalysis.status = step.status;
        
        if (step.progress === 100) {
          this.currentAnalysis.performance = generateMockPerformanceMetrics();
          this.currentAnalysis.security = generateMockSecurityAudit(this.currentAnalysis.authMethod);
        }
      }
    }
  }

  getAnalysisStatus(id: string): AnalysisResult | null {
    return this.currentAnalysis?.id === id ? this.currentAnalysis : null;
  }

  clearSession(): void {
    this.currentAnalysis = null;
  }
}

export const analyzer = new PerformanceAnalyzer();